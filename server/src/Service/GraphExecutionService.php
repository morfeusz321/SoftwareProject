<?php

namespace App\Service;

use App\Entity\Argument;
use App\Entity\Auth;
use App\Entity\Enum\ContentType;
use App\Entity\Expression;
use App\Entity\Graph;
use App\Entity\MapExpression;
use App\Entity\Node\Action;
use App\Entity\Node\Condition;
use App\Entity\Node\Invite;
use App\Entity\Node\Node;
use App\Entity\Node\Trigger;
use App\Entity\Request;
use App\Repository\GraphRepository;
use App\Utils\InvitesData;
use Doctrine\Common\Collections\Collection;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GraphExecutionService
{
    private LoggerInterface $logger;

    private HttpClientInterface $httpClient;

    private GraphRepository $graphRepository;

    private array $results;

    public function __construct(HttpClientInterface $httpClient, LoggerInterface $logger, GraphRepository $graphRepository)
    {
        $this->logger = $logger;
        $this->httpClient = $httpClient;
        $this->results = [];
        $this->graphRepository = $graphRepository;
    }

    /**
     * Function to execute the graph flow.
     * @param Graph $graph - The graph to execute.
     * @param bool $isSandboxMode - Whether to execute the graph in sandbox mode.
     * @return Graph - The graph after execution.
     * @throws HttpException - If the graph execution failed.
     */
    public function executeGraphFlow(Graph $graph, bool $isSandboxMode = false): Graph
    {
        $graph->clearGraphsLogs();
        $this->clearGraphLogs($graph);

        // Initialize all nodes to be not executed at the beginning.
        $isExecuted = [];
        foreach ($graph->getNodes() as $node) {
            $isExecuted[$node->getIdString()] = false;
        }

        // Initialize in-degree map for all nodes, verify that the graph is valid and get its trigger node.
        $degree = $this->initializeDegreeMap($graph);
        $triggerNode = $this->verifyGraphAndGetTrigger($graph, $isExecuted, $degree);

        $nodesToExecute = [$triggerNode];
        $this->results = [];
        while (count($nodesToExecute) > 0) {
            $this->logger->info('GraphExecutionService.executeGraphFlow: Executing nodes: ');
            foreach ($nodesToExecute as $node) {
                //                $graph->addLogs('Executing node:');
                $graph->addLogs('Executing ' . $this->getNodeName($node) . ":");

                $this->logger->debug($node->getIdString());
                $nameToLog = $node->getName() ?? $node->getIdString();
                $graph->addLogs($nameToLog);
                $this->executeNode($node, $this->results, $isSandboxMode);
                $this->logger->debug('results: ' . json_encode($this->results));

                $isExecuted[$node->getIdString()] = true;
            }

            $this->updateDegreeMap($nodesToExecute, $degree, $this->results);
            $nodesToExecute = $this->getNodesToExecute($graph, $degree, $isExecuted);
        }

        $this->getGraphRepository()->save($graph, flush: true);
        return $graph;
    }

    /**
     * Function to execute a single node.
     * @param Node $node - The node to execute.
     * @param array $results - The results of the execution.
     * @param bool $isSandboxMode - Whether to execute the graph in sandbox mode.
     * @param bool $save - Whether to save the graph after execution.
     * @throws HttpException - If the execution failed.
     */
    public function executeNode(Node $node, array &$results, bool $isSandboxMode, bool $save = true): void
    {
        try {
            $nodeId = $node->getIdString();
            if ($node instanceof Invite) {
                $results[$node->getIdString()] = $this->handleInviteNode($node, $results, $isSandboxMode);
            } elseif ($node instanceof Action) {
                $requestToExecute = $this->fillRequestWithArguments($node, $results);
                $response = json_decode($this->executeRequest($requestToExecute, $isSandboxMode), true);
                $results[$nodeId] = $response;
            } elseif ($node instanceof Condition || $node instanceof Trigger) {
                switch ($node->getType()) {
                    case Condition::CONDITION_NODE_TYPE_IF:
                        $results[$node->getIdString()] = $this->handleIfNode($node, $results);
                        break;
                    case Condition::CONDITION_NODE_TYPE_FILTER:
                        $results[$node->getIdString()] = $this->handleFilterNode($node, $results);
                        break;
                    case Condition::CONDITION_NODE_TYPE_MAP:
                        $results[$node->getIdString()] = $this->handleMapNode($node, $results);
                        break;
                    case Trigger::TRIGGER_NODE_TYPE_TRIGGER:
                        break;
                    default:
                        $this->logAndThrowException('Encountered a Condition Node with unknown type' . $node->getType());
                }
            } else {
                $this->logAndThrowException('Encountered a node which was neither Action nor Condition.');
            }
            if (array_key_exists($nodeId, $results)) {
                $resultOfNode = json_encode($results[$nodeId]);
                $node->getGraph()->addLogs("Step result evaluated to: $resultOfNode");
            }
        } catch (TransportExceptionInterface $e) {
            $node->getGraph()->addLogs($e->getMessage());
            $this->logger->warning('Transport exception', [
                'exception' => $e,
            ]);
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, message: 'In step ' . $node->getName() . ': ' . $e->getMessage());
        } catch (ClientExceptionInterface $e) {
            $node->getGraph()->addLogs($e->getMessage());
            $this->logger->warning('Client exception (4xx response)', [
                'exception' => $e,
            ]);
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, message: 'In step ' . $node->getName() . ': ' . $e->getMessage());
        } catch (DecodingExceptionInterface $e) {
            $node->getGraph()->addLogs($e->getMessage());
            $this->logger->warning("Decoding exception (response wasn't valid JSON)", [
                'exception' => $e,
            ]);
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, message: 'In step ' . $node->getName() . ': ' . $e->getMessage());
        } catch (RedirectionExceptionInterface $e) {
            $node->getGraph()->addLogs($e->getMessage());
            $this->logger->warning('Redirection exception', [
                'exception' => $e,
            ]);
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, message: 'In step ' . $node->getName() . ': ' . $e->getMessage());
        } catch (ServerExceptionInterface $e) {
            $node->getGraph()->addLogs($e->getMessage());
            $this->logger->warning('Server exception (5xx response)', [
                'exception' => $e,
            ]);
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, message: 'In step ' . $node->getName() . ': ' . $e->getMessage());
        } catch (HttpException $e) {
            $node->getGraph()->addLogs($e->getMessage());
            $this->logger->warning('Internal server error: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, message: 'In step ' . $node->getName() . ': ' . $e->getMessage());
        } finally {
            if ($save) {
                $this->getGraphRepository()->save($node->getGraph(), flush: true);
            }
        }
    }

    /**
     * Handles an if node, getting the data from the parent node specified in the parent node and comparing it to the
     * data in comparisonValue using the comparison method specified in the if node. Returns true iff the condition
     * evaluates to true. If the parent node doesn't have the required field, returns true.
     * @param Condition $node - The if node to handle.
     * @param array $results - The results of the execution.
     * @return bool - Whether the condition evaluates to true.
     */
    public function handleIfNode(Condition $node, array $results): bool
    {
        $expression = $node->getExpression();
        $leftHandSideObject = $results[$expression->getFirstFieldNodeId()] ?? null;
        return $this->compareValues($leftHandSideObject, $node, $results);
    }

    /**
     * Handles a filter node, taking the list of objects returned in its parent, a field name, and an expression, and
     * returns the list of those objects where that field exists and where the condition evaluates to true on that
     * field. If any required field is missing, the object is ignored in the filtering process.
     * @param Condition $node - The filter node to handle.
     * @param array $results - The results of the execution.
     * @return array - The list of objects where the condition evaluates to true.
     */
    public function handleFilterNode(Condition $node, array $results): array
    {
        $expression = $node->getExpression();
        $objects = $results[$expression->getFirstFieldNodeId()] ?? null;
        if ($objects === null) {
            $this->logAndThrowException('Could not filter the result because the result with id ' . $expression->getFirstFieldNodeId() . ' was not provided.');
        }

        return array_values(array_filter($objects, function ($leftHandSideObject) use ($node, $results) {
            return $this->compareValues($leftHandSideObject, $node, $results);
        }));
    }

    /**
     * Compares the values based on comparison type of the node
     * @param mixed $leftHandSideObject - The object to compare.
     * @param Condition $node - The condition node to handle.
     * @param array $results - The results of the execution.
     * @return bool - Whether the condition evaluates to true.
     */
    public function compareValues(mixed $leftHandSideObject, Condition $node, array $results): bool
    {
        $expression = $node->getExpression();
        if ($leftHandSideObject === null) {
            $this->logAndThrowException('Could not compare values because the left hand side result with id ' . $expression->getFirstFieldNodeId() . ' was not provided.');
        }

        $leftHandSideValue = $this->getFieldValueFromObject($expression->getFirstFieldValue(), $leftHandSideObject, $expression->getFirstFieldNodeId());
        if ($expression->getCompareTo() === Expression::DATE_VALUE) {
            return $expression->evaluateDate($leftHandSideValue);
        }
        if ($expression->getCompareTo() === Expression::NODE_VALUE) {
            $rightHandSideObject = $results[$expression->getSecondFieldNodeId()] ?? null;
            if ($rightHandSideObject === null) {
                $this->logAndThrowException('Could not compare values in the result because the right hand side result with id ' . $expression->getSecondFieldNodeId() . ' was not provided.');
            }
            $rightHandSideValue = $this->getFieldValueFromObject($expression->getSecondFieldNodeValue(), $rightHandSideObject, $expression->getSecondFieldNodeId());
        } else {
            $rightHandSideValue = $expression->getSecondFieldUserValue();
        }

        return $expression->evaluate($leftHandSideValue, $rightHandSideValue);
    }

    /**
     * returns the value of the field from the object
     * @param MapExpression $expression - The map expression to handle.
     * @param mixed $object - The object to get the value from.
     */
    public function retrieveEntryWithKey(MapExpression $expression, mixed $object)
    {
        if ($object === null) {
            $this->logAndThrowException('Could not map values in the result with id ' . $expression->getParentNodeId() . ' because one of the objects was null.');
        }

        return [
            $expression->getMappedFieldName() => $this->getFieldValueFromObject($expression->getFieldName(), $object, $expression->getParentNodeId()),
        ];
    }

    /**
     * Handles a map node, maps the field names
     * @param Condition $node - The map node to handle.
     * @param array $results - The results of the execution.
     */
    public function handleMapNode(Condition $node, array $results): array
    {
        $expression = $node->getMapExpression();
        $result = $results[$expression->getParentNodeId()] ?? null;
        if ($result === null) {
            $this->logAndThrowException('Could not map values in the result because the result with id ' . $expression->getParentNodeId() . ' was not provided.');
        }
        $callback = function ($object) use ($expression) {
            return $this->retrieveEntryWithKey($expression, $object);
        };

        return array_map($callback, $results[$expression->getParentNodeId()]);
    }

    /**
     * This function explodes the possibly nested field name with the '.' as the separator and then tries to find the
     * value in the object.
     *
     * @param string $nestedFieldName - the field name possibly containing '.'s for which to get the value.
     * @param array $object - the array where the field name is specified.
     * @return array|false|string - the found value found in the object.
     */
    public function getFieldValueFromObject(string $nestedFieldName, array $object, string $nodeId)
    {
        if ($nestedFieldName === 'wholeBody') {
            return json_encode($object);
        }
        $nestedNames = explode('.', $nestedFieldName);
        $value = $object;
        $totalFieldName = '';
        foreach ($nestedNames as $fieldName) {
            $totalFieldName .= $fieldName;
            $value = $value[$fieldName] ?? null;
            if ($value === null) {
                $this->logAndThrowException('The field ' . $totalFieldName . ' was not provided in the result with id ' . $nodeId . '.');
            }
            $totalFieldName .= '.';
        }
        if (!is_string($value)) {
            $value = json_encode($value);
        }

        return $value;
    }

    /**
     * Returns the nodes for which are ready to be executed, i.e. all their dependencies have already been executed (so
     * they have in-degree 0). IF nodes are only counted as "done" in this sense if they evaluated to true, so nodes
     * which depend on IF parent nodes which evaluate to false are blocked and don't get executed.
     * @param Graph $graph - The graph to get the nodes from.
     * @param array $degree - The degree of each node.
     * @param array $isExecuted - Whether each node has been executed.
     * @return array - The array to be populated with results of nodes execution
     */
    private function getNodesToExecute(Graph $graph, array $degree, array $isExecuted): array
    {
        $nodes = $graph->getNodes();

        $result = [];

        foreach ($nodes as $node) {
            // We add nodes with nothing going into them that have not been executed previously.
            if ($degree[$node->getIdString()] == 0 && ! $isExecuted[$node->getIdString()]) {
                $result[] = $node;
            }
        }

        return $result;
    }

    /**
     * Updates the degree map by decrementing the degree of all nodes that have the given nodes as neighbours.
     * @param array $nodes - The nodes to update the degree map for.
     * @param array $degree - The degree of each node.
     * @param array $result - The result of the execution.
     */
    private function updateDegreeMap(array $nodes, array &$degree, array $result): void
    {
        foreach ($nodes as $node) {
            if ($node->getType() === Condition::CONDITION_NODE_TYPE_IF && ! $result[$node->getIdString()]) {
                // We have a failed IF node, so we don't count them as done.
                continue;
            }
            foreach ($node->getNeighbours() as $child) {
                $degree[$child->getIdString()] -= 1;
            }
        }
    }

    /**
     * Initializes the degree map for the graph.
     * @param Graph $graph - The graph to initialize the degree map for.
     * @return array - The initialized degree map.
     */
    private function initializeDegreeMap(Graph $graph): array
    {
        $nodes = $graph->getNodes();

        // Initialize degree as 0 for all nodes
        $degree = [];
        foreach ($nodes as $node) {
            $degree[$node->getIdString()] = 0;
        }

        // Increment node degree for each incoming edge, not counting IF nodes.
        foreach ($nodes as $node) {
            foreach ($node->getNeighbours() as $child) {
                $degree[$child->getIdString()] += 1;
            }
        }

        return $degree;
    }

    /**
     * Verifies the graph and returns the trigger node.
     * @param Graph $graph - The graph to verify
     * @return Node - The trigger node.
     */
    private function verifyGraphAndGetTrigger(Graph $graph, array &$isExecuted, array $degree): Node
    {
        $startNode = $this->getTriggerNode($graph, $isExecuted, $degree);

        $currentlyVisiting = [];
        $visited = [];
        $this->dfs($startNode, $currentlyVisiting, $visited);

        return $startNode;
    }

//    private function verifyGraph(Graph $graph): void
//    {
//        $startNode = $this->getTriggerNode($graph, );
//
//        $currentlyVisiting = [];
//        $visited = [];
//        $this->dfs($startNode, $currentlyVisiting, $visited);
//
//        // TODO: add step which goes over all nodes and makes sure that when we have a condition node, then the parent
//        // node has an edge going into that condition node
//    }

    /**
     * Tries to find a trigger node in the graph
     * @param Graph $graph - The graph to search for the trigger node.
     * @param array $isExecuted - Whether each node has been executed.
     * @param array $degree - The degree of each node.
     * @return Node - The trigger node.
     */
    private function getTriggerNode(Graph $graph, array &$isExecuted, array $degree)
    {
        $nodes = $graph->getNodes();

        // Find nodes with in-degree zero and mark them as executed if they're not the trigger node. This is so that we
        // don't execute "isolated" nodes unconnected to the trigger.
        foreach ($nodes as $node) {
            if ($degree[$node->getIdString()] == 0 && $node->getType() != Trigger::TRIGGER_NODE_TYPE_TRIGGER) {
                $isExecuted[$node->getIdString()] = true;
            }
        }

        // Find the trigger node, checking for duplicates.
        $result = null;
        foreach ($nodes as $node) {
            if ($node->getType() === Trigger::TRIGGER_NODE_TYPE_TRIGGER) {
                if ($result != null) {
                    $this->logAndThrowException('The flow graph contains multiple trigger nodes.');
                }
                if ($degree[$node->getIdString()] != 0) {
                    $this->logAndThrowException('The trigger node has an incoming edge.');
                }
                $result = $node;
            }
        }

        // Graph didn't have a trigger node, so it's invalid.
        if ($result === null) {
            $this->logAndThrowException('The flow graph does not have a trigger node to start execution from.');
        }

        return $result;
    }

    /**
     * Performs a depth-first search on the graph, starting from the given node.
     * @param Node $node - The node to start the DFS from.
     * @param array $currentlyVisiting - The array of nodes currently being visited.
     * @param array $visited - The array of nodes that have been visited.
     */
    public function dfs(Node $node, array &$currentlyVisiting, array &$visited): void
    {
        $visited[$node->getIdString()] = true;
        $currentlyVisiting[$node->getIdString()] = true;
        foreach ($node->getNeighbours() as $neighbour) {
            if (isset($currentlyVisiting[$neighbour->getIdString()]) && $currentlyVisiting[$neighbour->getIdString()]) {
                $this->logAndThrowException('The flow graph was not a valid directed acyclic graph: cycle detected.');
            }
            if (!isset($visited[$neighbour->getIdString()]) || !$visited[$neighbour->getIdString()]) {
                $this->dfs($neighbour, $currentlyVisiting, $visited);
            }
        }
        $currentlyVisiting[$node->getIdString()] = false;
    }

    /**
     * Sets the authentication for the request.
     * @param Request $request - The request to set the authentication for.
     * @param array $options - The options to set the authentication for.
     * @return array - The options with the authentication set.
     */
    public function setAuthenticationForRequest(Request $request, array $options): array
    {
        if ($auth = $request->getAuth()) {
            $token = $auth->getToken();
            $tokenType = $auth->getType();

            switch ($tokenType) {
                case Auth::BEARER:
                case Auth::OAUTH2:
                    $options['headers']['Authorization'] = 'Bearer ' . $token;
                    break;
                case Auth::API_KEY:
                    $options['headers']['X-Auth-Token'] = $token;
                    break;
                default:
                    // Handle unknown or unsupported authentication type
                    break;
            }
        }
        return $options;
    }

    /**
     * Executes the request and returns the response.
     * @param Request $request - The request to execute.
     * @param bool $isSandboxMode - Whether to execute the request in sandbox mode.
     * @return string - The response body.
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function executeRequest(Request $request, bool $isSandboxMode): string
    {
        // Initialize the options array
        $options = [];

        // Add the auth_bearer if auth data is provided
        $options = $this->setAuthenticationForRequest($request, $options);

        // Add the body content if provided
        if ($body = $request->getBody()) {
            // Check body type
            $contentType = $this->getContentType($body);

            switch ($contentType) {
                case ContentType::JSON:
                    $options['body'] = $body;
                    $options['headers']['Content-Type'] = ContentType::JSON->value;
                    break;
                case ContentType::XML:
                    $options['body'] = $body;
                    $options['headers']['Content-Type'] = ContentType::XML->value;
                    break;
                default:
                    $this->logAndThrowException("Request body content type could not be determined.");
            }
        }

        // If we're in sandbox mode we only execute GET requests, as they should have no side effects. If not then we
        // execute the request normally.
        $response = "";
        if ($isSandboxMode && $request->getMethod() != Action::ACTION_NODE_TYPE_GET) {
            $response = json_encode([
                'content' => 'Request skipped: executing in sandbox mode.',
            ]);
        } else {
            $response = $this->getHttpClient()->request(
                $request->getMethod(),
                $request->getUrl(),
                $options
            );

            $response = $response->getContent();
        }

        return $response;
    }

    /**
     * Returns the content type of the body.
     * @param $body - The body to check the content type of.
     * @return ContentType|null - The content type of the body, or null if it could not be determined.
     */
    private function getContentType($body): ?ContentType
    {
        $json = json_decode($body);
        if (json_last_error() === JSON_ERROR_NONE) {
            return ContentType::JSON;
        }

        try {
            $xml = simplexml_load_string($body);
            if ($xml !== false) {
                return ContentType::XML;
            }
        } catch (Exception $e) {
            return null;
        }

        // If the body content is neither JSON nor XML, return null
        return null;
    }

    /**
     * Replaces the wildcards in the action node with data from previous nodes.
     * @param Action $node - The node to replace the wildcards for.
     * @param array $results - previous results
     * @return Request - The request with the wildcards replaced.
     */
    private function fillRequestWithArguments(Action $node, array $results): Request
    {
        $requestFromNode = $node->getRequest();
        $arguments = $node->getArguments();
        $request = clone $requestFromNode;
        $auth = $request->getAuth();
        if ($auth != null) {
            $auth->setToken($this->replaceWildcards($arguments, $results, $auth->getToken()));
            $request->setAuth($auth);
            $node->getGraph()->addLogs("token evaluated to " . $auth->getToken());
        }
        $request->setUrl($this->replaceWildcards($arguments, $results, $request->getUrl()));
        $node->getGraph()->addLogs("URL evaluated to " . $request->getUrl());
        $request->setBody($this->replaceWildcards($arguments, $results, $request->getBody()));
        $node->getGraph()->addLogs("Body evaluated to " . $request->getBody());
        return $request;
    }

    /**
     * Replaces the wildcards in the stringy with data from previous nodes.
     * @param Collection $arguments - The arguments to replace the wildcards with.
     * @param array $results - previous results
     * @param string $body - The body to replace the wildcards in.
     * @return string - The body with the wildcards replaced.
     */
    private function replaceWildcards(Collection $arguments, array $results, string $body): string
    {
        $matches = [];
        // Find all the wildcards in the body
        preg_match_all('/<<([a-zA-Z0-9_]+)>>/', $body, $matches);
        // Find all arguments which alias match the wildcards
        foreach ($matches[1] as $match) {
            $argumentToUse = $this->getArgumentToUse($arguments, $match);
            $valueToUse = $this->getValueToUse($results, $argumentToUse);
            // Replace the wildcard with the value of the argument
            $matchWithBrackets = '<<' . $match . '>>';
            $matchWithBrackets = str_replace('/n', '', $matchWithBrackets);
            $body = str_replace($matchWithBrackets, $valueToUse, $body);
        }
        return $body;
    }

    /**
     * Find argument with alias matching the match in the url or body
     * @param Collection $arguments - The arguments to search through.
     * @param string $match - The match to find the argument for.
     * @return Argument - The argument with the matching alias.
     */
    public function getArgumentToUse(Collection $arguments, mixed $match): Argument
    {
        $argumentToUse = null;
        foreach ($arguments as $argument) {
            if ($argument->getAlias() === $match) {
                $argumentToUse = $argument;
                break;
            }
        }
        if ($argumentToUse === null) {
            $this->logAndThrowException('The argument with alias ' . $match . ' was not provided.');
        }
        return $argumentToUse;
    }

    /**
     * Get the value of the argument to use.
     * @param array $results - the array containing the results of previous nodes.
     * @param Argument $argumentToUse - the argument containing where to find the argument value.
     * @return mixed - the found value
     */
    public function getValueToUse(array $results, Argument $argumentToUse): mixed
    {
        $result = $results[$argumentToUse->getParentId()] ?? null;
        if ($result === null) {
            $this->logAndThrowException('Could not fill in the argument ' . $argumentToUse->getField() . ' because the result with id ' . $argumentToUse->getParentId() . 'was not provided.');
        }
        return $this->getFieldValueFromObject($argumentToUse->getField(), $result, $argumentToUse->getParentId());
    }

    private function getNodeName(Node $node): string
    {
        $parts = explode('\\', get_class($node));
        $name = end($parts);

        // To print "IF Condition" or "GET Action" but not "TRIGGER Trigger"
        if ($node instanceof Action || $node instanceof Condition) {
            $name = $node->getType() . ' ' . $name;
        }

        return $name;
    }

    private function logAndThrowException(string $message)
    {
        $this->logger->warning($message);
        throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, $message);
    }

    private function clearGraphLogs(Graph $graph): void
    {
        $logs = [];
        $graph->setLogs($logs);
    }

    public function getGraphRepository(): GraphRepository
    {
        return $this->graphRepository;
    }

    public function setGraphRepository(GraphRepository $graphRepository): void
    {
        $this->graphRepository = $graphRepository;
    }

    public function getHttpClient(): HttpClientInterface
    {
        return $this->httpClient;
    }

    public function setHttpClient(HttpClientInterface $httpClient): void
    {
        $this->httpClient = $httpClient;
    }

    public function getResults(): array
    {
        return $this->results;
    }

    /**
     * Handles the invitation node and returns the result as an array.
     *
     * @param Invite $node The invitation node object.
     * @param array $results The results array containing the parent response data.
     * @return array The result of the execution as an array.
     *
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function handleInviteNode(Invite $node, array $results, $isSandboxMode): array
    {
        $invites = $this->extractInvites($node, $results);
        $requestFromNode = clone $node->getRequest();
        $body = $this->replaceEmailData($invites, $requestFromNode->getBody());
        $requestFromNode->setBody($body);

        $response = $this->executeRequest($requestFromNode, $isSandboxMode);
        return json_decode($response, true);
    }

    /**
     * Extracts the invites from the parent response data.
     *
     * @param Invite $node - The invitation node object.
     * @param array $results - The results array containing the parent response data.
     *
     * @return array - The extracted invites as an array of InvitesData objects.
     *
     * @throws HttpException - If there are missing fields in the parent's response or an invalid email is encountered.
     */
    public function extractInvites(Invite $node, array $results): array
    {
        $invites = [];
        $nodeFromWhichWeTakeEmails = $node->getEmail()->getParentId();
        $responseWithEmails = $results[$nodeFromWhichWeTakeEmails] ?? null;
        if ($responseWithEmails === null) {
            $this->logAndThrowException('Could not extract emails from the result because the result with id ' . $nodeFromWhichWeTakeEmails . ' was not provided.');
        }

        foreach ($responseWithEmails as $data) {
            $email = $this->getEmailFromData($node->getEmail(), $data);
            $metadataForEmail = $this->extractMetadataForEmail($node, $data);
            $inviteData = new InvitesData($metadataForEmail, $email);
            $invites[] = $inviteData;
        }

        return $invites;
    }

    /**
     * Extracts and validates the email from the given data array based on the specified field.
     *
     * @param Argument $emailArgument - The argument containing from where to extract the email.
     * @param array $data - The array containing the emails.
     *
     * @return string - The extracted and validated email.
     *
     * @throws HttpException - If the specified field is missing in the parent's response or an invalid email is encountered.
     */
    public function getEmailFromData(Argument $emailArgument, array $data): string
    {
        $email = $this->getFieldValueFromObject($emailArgument->getField(), $data, $emailArgument->getParentId());

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, "Provided email is not valid.");
        }

        return $email;
    }

    /**
     * Extracts the metadata for each email based on the node's arguments and the parent response data.
     *
     * @param Invite $node - The invitation node object.
     * @param array $data - The data array containing the parent response data.
     *
     * @return array - The extracted metadata for the email.
     *
     * @throws HttpException - If a specified argument field is missing in the parent's response.
     */
    public function extractMetadataForEmail(Invite $node, array $data): array
    {
        $metadataForEmail = [];

        foreach ($node->getArguments() as $argument) {
            $metadataForEmail[$argument->getAlias()] = $this->getFieldValueFromObject($argument->getField(), $data, $argument->getParentId());
        }

        return $metadataForEmail;
    }

    /**
     * Replaces the <<email_data>> placeholder in the request body with the JSON representation of the invites.
     *
     * @param array $invites - The array of InvitesData objects.
     * @param string $body - The original request body.
     *
     * @return string - The updated request body with the replaced placeholder.
     */
    public function replaceEmailData(array $invites, string $body): string
    {
        $matchWithBrackets = "<<email_data>>";
        $matchWithBrackets = str_replace('/n', '', $matchWithBrackets);
        $body = str_replace($matchWithBrackets, json_encode($invites), $body);

        return $body;
    }
}
