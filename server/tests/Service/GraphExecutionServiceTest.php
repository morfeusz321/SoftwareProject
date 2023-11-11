<?php

namespace App\Tests\Service;

use App\DataFixtures\AppFixtures;
use App\Entity\Argument;
use App\Entity\Auth;
use App\Entity\Expression;
use App\Entity\Graph;
use App\Entity\MapExpression;
use App\Entity\Node\Action;
use App\Entity\Node\Condition;
use App\Entity\Node\Invite;
use App\Entity\Node\Node;
use App\Entity\Node\Trigger;
use App\Entity\Request as RequestEntity;
use App\Repository\GraphRepository;
use App\Service\GraphExecutionService;
use App\Tests\TestConstants;
use App\Utils\InvitesData;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Uid\UuidV4;

class GraphExecutionServiceTest extends KernelTestCase
{
    private GraphExecutionService $graphExecutionService;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->graphExecutionService = self::getContainer()->get(GraphExecutionService::class);
    }

    public function testFlowExecutionSucceeds()
    {
        $graph = self::getContainer()
            ->get('doctrine')
            ->getRepository(Graph::class)
            ->find(1);

        $this->assertNotNull($graph);

        try {
            $this->graphExecutionService->executeGraphFlow($graph);
        } catch (HttpException $e) {
            $this->fail('Unexpected HttpException: ' . $e->getMessage());
        }
    }

    public function testFlowExecutionMakesRequests()
    {
        // Graph with only Action nodes
        $graph = self::getContainer()
            ->get('doctrine')
            ->getRepository(Graph::class)
            ->find(1);

        $this->assertNotNull($graph);

        // Initialize request counter
        $requestCounter = 0;

        // Create a mock HTTP client that returns a predefined JSON object and counts requests
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) use (&$requestCounter) {
            $this->assertEquals(AppFixtures::TEST_GET_URL, $url);
            $this->assertEquals(Request::METHOD_GET, $method);
            // These should be GET requests with no auth, so these should be unset in $options.
            self::assertArrayNotHasKey('body', $options);
            self::assertArrayNotHasKey('auth_bearer', $options);
            $requestCounter++;
            return new MockResponse(AppFixtures::TEST_GET_RESPONSE_JSON, [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        try {
            $this->graphExecutionService->executeGraphFlow($graph);
        } catch (HttpException $e) {
            $this->fail('Unexpected HttpException: ' . $e->getMessage());
        }

        // Check that the correct number of requests were made
        $this->assertEquals(5, $requestCounter);
    }

    public function testFlowExecutionHandlesIfCorrectly()
    {
        $graph = self::getContainer()
            ->get('doctrine')
            ->getRepository(Graph::class)
            ->find(2);

        $this->assertNotNull($graph);

        // Initialize request counter
        $requestCounter = 0;

        // Create a mock HTTP client that returns a predefined JSON object and counts requests
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) use (&$requestCounter) {
            $this->assertEquals(Request::METHOD_GET, $method);
            // These should be GET requests with no auth, so these should be unset in $options.
            self::assertArrayNotHasKey('body', $options);
            self::assertArrayNotHasKey('auth_bearer', $options);
            $requestCounter++;
            return new MockResponse(AppFixtures::TEST_GET_RESPONSE_JSON, [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        try {
            $this->graphExecutionService->executeGraphFlow($graph);
        } catch (HttpException $e) {
            $this->fail('Unexpected HttpException: ' . $e->getMessage());
        }

        // Only two requests should have been made, as one of the ifs should have failed
        $this->assertEquals(2, $requestCounter);
    }

    public function testFlowExecutionPerformsFilterCorrectly()
    {
        $graph = self::getContainer()
            ->get('doctrine')
            ->getRepository(Graph::class)
            ->find(3);

        $this->assertNotNull($graph);

        // Initialize request counter
        $requestCounter = 0;

        // Create a mock HTTP client that returns a predefined JSON object and counts requests
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) use (&$requestCounter) {
            $requestCounter++;

            $this->assertEquals(Request::METHOD_GET, $method);
            // These should be GET requests with no auth, so these should be unset in $options.
            self::assertArrayNotHasKey('body', $options);
            self::assertArrayNotHasKey('auth_bearer', $options);
            if ($url == "https://jsonplaceholder.typicode.com/posts") {
                return new MockResponse(TestConstants::POSTS_JSON, [
                    'http_code' => 200,
                ]);
            }

            return new MockResponse("{}", [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        try {
            $this->graphExecutionService->executeGraphFlow($graph);
        } catch (HttpException $e) {
            $this->fail('Unexpected HttpException: ' . $e->getMessage());
        }

        // One GET request should have been made, for getting the list of posts.
        $this->assertEquals(1, $requestCounter);

        // Look at the results of the execution.
        $results = $this->graphExecutionService->getResults();
        $getResults = []; // result of the GET request node
        $filteredResults = []; // result of the FILTER node
        foreach ($results as $id => $res) {
            $nodeType = self::getContainer()
                ->get('doctrine')
                ->getRepository(Node::class)
                ->find($id)
                ->getType();
            if ($nodeType == Action::ACTION_NODE_TYPE_GET) {
                $getResults = $res;
            } elseif ($nodeType == Condition::CONDITION_NODE_TYPE_FILTER) {
                $filteredResults = $res;
            }
        }

        // Make sure that everything in $filteredResults was in $getResults
        foreach ($filteredResults as $obj) {
            $this->assertContains($obj, $getResults);
        }

        // Make sure that everything in $filteredResults has userId=2
        foreach ($filteredResults as $obj) {
            $this->assertEquals(2, $obj['userId']);
        }

        // Make sure that every object with userId=2 in $getResults appears in $filteredResults
        foreach ($getResults as $obj) {
            if ($obj['userId'] == 2) {
                $this->assertContains($obj, $filteredResults);
            }
        }
    }

    public function testFlowExecutionHandlesArgumentInBody()
    {
        $graph = self::getContainer()
            ->get('doctrine')
            ->getRepository(Graph::class)
            ->find(4);

        $this->assertNotNull($graph);

        // Create a mock HTTP client that returns a predefined JSON object and counts requests
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) use (&$requestCounter) {
            if ($method == Request::METHOD_GET) {
                $this->assertEquals(AppFixtures::TEST_GET_URL, $url);
                // These should be GET requests with no auth, so these should be unset in $options.
                self::assertArrayNotHasKey('body', $options);
                self::assertArrayNotHasKey('authorization', $options['normalized_headers']);
                $requestCounter++;
                return new MockResponse(AppFixtures::TEST_GET_RESPONSE_JSON, [
                    'http_code' => 200,
                ]);
            } elseif ($method == Request::METHOD_POST) {
                $this->assertEquals(AppFixtures::TEST_POST_URL, $url);
                $this->assertEquals(AppFixtures::TEST_POST_BODY, $options['body']);
                // These should be POST requests with no auth, so these should be unset in $options.
                self::assertArrayNotHasKey('authorization', $options['normalized_headers']);
                $requestCounter++;
                return new MockResponse(AppFixtures::TEST_POST_RESPONSE_JSON, [
                    'http_code' => 200,
                ]);
            } else {
                $this->fail('Unexpected method: ' . $method);
            }
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        try {
            $this->graphExecutionService->executeGraphFlow($graph);
        } catch (HttpException $e) {
            $this->fail('Unexpected HttpException: ' . $e->getMessage());
        }

        $this->assertEquals(2, $requestCounter);
    }

    public function testGraphExecutionRejectsGraphWithCycle(): void
    {
        // Construct a graph that contains a cycle
        $graph = $this->getGraphWithCycle();

        // Assert that the graph was successfully constructed
        $this->assertNotNull($graph);

        // Mock the HttpClient to return a successful response, regardless of the request
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) {
            return new MockResponse("{}", [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        // Assert that the execution of the cyclic graph throws an HttpException
        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('The flow graph was not a valid directed acyclic graph: cycle detected.');

        // Try to execute the cyclic graph
        $this->graphExecutionService->executeGraphFlow($graph);
    }

    public function testGraphExecutionRejectsGraphWithEdgesGoingIntoTrigger(): void
    {
        // Construct a graph that contains a cycle
        $graph = $this->getGraphWithEdgeGoingIntoTrigger();

        // Assert that the graph was successfully constructed
        $this->assertNotNull($graph);

        // Mock the HttpClient to return a successful response, regardless of the request
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) {
            return new MockResponse("{}", [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        // Assert that the execution of the graph throws an HttpException due to an edge going into the trigger node
        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('The trigger node has an incoming edge.');

        // Try to execute the cyclic graph
        $this->graphExecutionService->executeGraphFlow($graph);
    }

    public function testGraphExecutionRejectsGraphWithoutTrigger(): void
    {
        // Construct a graph that doesn't have a trigger node
        $graph = $this->getGraphWithoutTrigger();

        // Assert that the graph was successfully constructed
        $this->assertNotNull($graph);

        // Mock the HttpClient to return a successful response, regardless of the request
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) {
            return new MockResponse("{}", [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        // Assert that the execution of the graph without a trigger node throws an HttpException
        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('The flow graph does not have a trigger node to start execution from.');

        // Try to execute the graph
        $this->graphExecutionService->executeGraphFlow($graph);
    }

    public function testGraphExecutionRejectsGraphWithMultipleTriggers(): void
    {
        // Graph with only Action nodes
        $graph = self::getContainer()
            ->get('doctrine')
            ->getRepository(Graph::class)
            ->find(1);

        // Assert that the graph was successfully constructed
        $this->assertNotNull($graph);

        $secondTrigger = new Condition();
        $secondTrigger->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);
        $graph->addNode($secondTrigger);

        // Mock the HttpClient to return a successful response, regardless of the request
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) {
            return new MockResponse("{}", [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        // Assert that the execution of the graph with multiple trigger nodes throws an HttpException
        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('The flow graph contains multiple trigger nodes.');

        // Try to execute the graph
        $this->graphExecutionService->executeGraphFlow($graph);
    }

    public function testGraphExecutionThrowsExceptionWhenArgumentFieldNotFoundInParentResponse(): void
    {
        // Construct a graph that has invalid arguments
        $graph = $this->getGraphWithInvalidArguments(true);

        // Assert that the graph was successfully constructed
        $this->assertNotNull($graph);

        $graphRepositoryMock = $this->createMock(GraphRepository::class);
        $graphRepositoryMock->method('save')->will($this->returnCallback(function ($graph) {
            // Don't do anything. We mock the repository so that we don't have to worry about entity relationship
            // errors from having some fields unset, since in these test graphs we only set the necessary fields.
        }));
        $this->graphExecutionService->setGraphRepository($graphRepositoryMock);

        // Mock the HttpClient to return a successful response, regardless of the request
        // This will throw an exception because the argument will be looking for a "userId" field, and that doesn't
        // exist here.
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) {
            return new MockResponse('{"userId": 42, "name": "John Doe"}', [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        // Assert that the execution of the graph throws an HttpException. This will be because the argument in the POST
        // node has is looking for the field 'userIdBAD' which doesn't exist in the response above.
        $this->expectException(HttpException::class);
        // This assertion checks that the exception message contains this string, so it's fine if we skip the exact ID,
        // since that's a random UUID
        $this->expectExceptionMessage('The field userIdBAD was not provided in the result with id ');

        // Try to execute the graph
        $this->graphExecutionService->executeGraphFlow($graph);
    }

    public function testGraphExecutionThrowsExceptionWhenArgumentAliasNotFound(): void
    {
        // Construct a graph that has invalid arguments
        $graph = $this->getGraphWithInvalidArguments(false);

        // Assert that the graph was successfully constructed
        $this->assertNotNull($graph);

        $graphRepositoryMock = $this->createMock(GraphRepository::class);
        $graphRepositoryMock->method('save')->will($this->returnCallback(function ($graph) {
            // Don't do anything. We mock the repository so that we don't have to worry about entity relationship
            // errors from having some fields unset, since in these test graphs we only set the necessary fields.
        }));
        $this->graphExecutionService->setGraphRepository($graphRepositoryMock);

        // Mock the HttpClient to return a successful response, regardless of the request
        // This will throw an exception because the argument will be looking for a "userId" field, and that doesn't
        // exist here.
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) {
            return new MockResponse('{"userId": 42, "name": "John Doe"}', [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        // Assert that the execution of the graph throws an HttpException. This will be because the argument in the POST
        // node provides a 'test' alias while the request body has a '<<testBAD>>' template.
        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('The argument with alias testBAD was not provided.');

        // Try to execute the graph
        $this->graphExecutionService->executeGraphFlow($graph);
    }

    public function testGraphExecutionHandlesXmlBodyInRequest(): void
    {
        // $flag value of 0, 1, 2 tests case with JSON, XML, and invalid request bodies respectively
        foreach ([0, 1, 2] as $flag) {
            $graph = $this->getGraphWithXmlOrJsonBodyPostRequest($flag);

            $this->assertNotNull($graph);

            $graphRepositoryMock = $this->createMock(GraphRepository::class);
            $graphRepositoryMock->method('save')->will($this->returnCallback(function ($graph) {
            }));
            $this->graphExecutionService->setGraphRepository($graphRepositoryMock);

            $requestCounter = 0;

            $mockHttpClient = new MockHttpClient(function ($method, $url, $options) use (&$requestCounter, $flag) {
                $requestCounter++;

                // Asserting that the header is set is annoying because HttpClient turns the headers into an array and
                // not a map, so we have to find e.g. [0] => 'Content-Type: application/xml' (or some index other than 0).
                $contentTypeHeader = array_filter($options['headers'], function ($header) {
                    return str_starts_with($header, 'Content-Type:');
                });

                if ($flag == 0) {
                    // There should be exactly one Content-Type header and it should be JSON
                    $this->assertCount(1, $contentTypeHeader);
                    $this->assertEquals('Content-Type: application/json', $contentTypeHeader[0]);
                } elseif ($flag == 1) {
                    // There should be exactly one Content-Type header and it should be XML
                    $this->assertCount(1, $contentTypeHeader);
                    $this->assertEquals('Content-Type: application/xml', $contentTypeHeader[0]);
                }

                return new MockResponse("{}", [
                    'http_code' => 200,
                ]);
            });

            // Expect exception due to invalid request body
            if ($flag == 2) {
                $this->expectException(HttpException::class);
                $this->expectExceptionMessage('Request body content type could not be determined.');
            }

            // Replace the HTTP client in the graph execution service with the mock client
            $this->graphExecutionService->setHttpClient($mockHttpClient);

            // Try to execute the graph
            $this->graphExecutionService->executeGraphFlow($graph);

            $this->assertEquals(1, $requestCounter);
        }
    }

    public function getGraphExecutionDoesntExecutePostRequestInSandboxExecution(): void
    {
        $graph = $this->getGraphWithPostAndGetNode();

        $this->assertNotNull($graph);

        $graphRepositoryMock = $this->createMock(GraphRepository::class);
        $graphRepositoryMock->method('save')->will($this->returnCallback(function ($graph) {
        }));
        $this->graphExecutionService->setGraphRepository($graphRepositoryMock);

        $requestCounter = 0;

        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) use (&$requestCounter) {
            $requestCounter++;

            return new MockResponse("{}", [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        // Try to execute the graph IN SANDBOX MODE
        $this->graphExecutionService->executeGraphFlow($graph, isSandboxMode: true);

        // The only request executed should be the GET.
        $this->assertEquals(1, $requestCounter);

        $results = $this->graphExecutionService->getResults();
        $this->assertEquals("testing", $results[AppFixtures::UUID_STRINGS[0]]);
        $this->assertEquals("{}", $results[AppFixtures::UUID_STRINGS[1]]);
    }

    public function testGraphExecutionHandlesIfNodeWithSecondValueFromAnotherNodeCorrectly(): void
    {
        // Graph with only Action nodes
        $graph = $this->getGraphWithConditionComparingValueFromSameNode();

        $this->assertNotNull($graph);

        $graphRepositoryMock = $this->createMock(GraphRepository::class);
        $graphRepositoryMock->method('save')->will($this->returnCallback(function ($graph) {
        }));
        $this->graphExecutionService->setGraphRepository($graphRepositoryMock);

        // Initialize request counter
        $requestCounter = 0;

        // Create a mock HTTP client that returns a predefined JSON object and counts requests
        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) use (&$requestCounter) {
            $requestCounter++;
            return new MockResponse(AppFixtures::TEST_GET_RESPONSE_JSON, [
                'http_code' => 200,
            ]);
        });

        // Replace the HTTP client in the graph execution service with the mock client
        $this->graphExecutionService->setHttpClient($mockHttpClient);

        $this->graphExecutionService->executeGraphFlow($graph);

        // Check that the correct number of requests were made
        $this->assertEquals(1, $requestCounter);

        // Assert that the IF node evaluated to true.
        $results = $this->graphExecutionService->getResults();
        $this->assertTrue($results[TestConstants::UUID_STRINGS[2]]);
    }

    private function getGraphWithCycle(): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Trigger node
        $nodes[0] = new Condition();
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // Three Action nodes
        $nodes[1] = new Action();
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[2] = new Action();
        $nodes[2]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[3] = new Action();
        $nodes[3]->setType(Action::ACTION_NODE_TYPE_GET);

        // Create the cycle
        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[1]->addNeighbour($nodes[2]);
        $nodes[2]->addNeighbour($nodes[3]);
        $nodes[3]->addNeighbour($nodes[1]);

        foreach ($nodes as $node) {
            $node->setId(new UuidV4());
        }

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }

    private function getGraphWithEdgeGoingIntoTrigger(): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Chain of nodes, GET -> TRIGGER -> GET
        $nodes[0] = new Action();
        $nodes[0]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[1] = new Trigger();
        $nodes[1]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);
        $nodes[2] = new Action();
        $nodes[2]->setType(Action::ACTION_NODE_TYPE_GET);

        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[1]->addNeighbour($nodes[2]);

        foreach ($nodes as $node) {
            $node->setId(new UuidV4());
        }

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }

    private function getGraphWithoutTrigger(): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Trigger node
        $nodes[0] = new Condition();
        $nodes[0]->setType(Condition::CONDITION_NODE_TYPE_IF);

        // Two Action nodes
        $nodes[1] = new Action();
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[2] = new Action();
        $nodes[2]->setType(Action::ACTION_NODE_TYPE_GET);

        foreach ($nodes as $node) {
            $node->setId(new UuidV4());
        }

        // Node 0 has nodes 1 and 2 as children
        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[0]->addNeighbour($nodes[2]);

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }

    public function testGraphExecutionCorrectlyHandlesArgumentsInAuth(): void
    {
        $graph = $this->getGraphWithAuthArguments();

        $this->assertNotNull($graph);

        $graphRepositoryMock = $this->createMock(GraphRepository::class);

        $graphRepositoryMock->method('save')->will($this->returnCallback(function ($graph) {
            // Don't do anything. We mock the repository so that we don't have to worry about entity relationship
            // errors from having some fields unset, since in these test graphs we only set the necessary fields.
        }));
        $this->graphExecutionService->setGraphRepository($graphRepositoryMock);

        $mockHttpClient = new MockHttpClient(function ($method, $url, $options) {
            if ($method == Request::METHOD_GET) {
                $this->assertEquals(AppFixtures::TEST_GET_URL, $url);
                // These should be GET requests with no auth, so these should be unset in $options.
                self::assertArrayNotHasKey('authorization', $options['normalized_headers']);
                return new MockResponse('{"token": "Bearer 1234"}', [
                    'http_code' => 200,
                ]);
            } elseif ($method == Request::METHOD_POST) {
                $this->assertEquals(AppFixtures::TEST_POST_URL, $url);
                $this->assertEquals("{}", $options['body']);
                // These should be POST requests with auth, so these should set in $options.
                $this->assertEquals(['Authorization: Bearer Bearer 1234'], $options['normalized_headers']['authorization']);
                return new MockResponse(AppFixtures::TEST_POST_RESPONSE_JSON, [
                    'http_code' => 200,
                ]);
            } else {
                $this->fail('Unexpected method: ' . $method);
            }
        });

        $this->graphExecutionService->setHttpClient($mockHttpClient);

        try {
            $this->graphExecutionService->executeGraphFlow($graph);
        } catch (HttpException $e) {
            $this->fail('Unexpected HttpException: ' . $e->getMessage());
        }
    }

    private function getGraphWithInvalidArguments(bool $flag): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Trigger node
        $nodes[0] = new Condition();
        $nodes[0]->setId(new UuidV4());
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // GET node
        $nodes[1] = new Action();
        $nodes[1]->setId(new UuidV4());
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);

        // POST node with arguments from the previous node
        $nodes[2] = new Action();
        $nodes[2]->setId(new UuidV4());
        $nodes[2]->setType(Action::ACTION_NODE_TYPE_GET);

        $argument = new Argument();
        $argument->setAlias('test');
        $argument->setParentId($nodes[1]->getId());
        $argument->setField($flag ? 'userIdBAD' : 'userId');
        $argument->setAction($nodes[2]);

        $request = new RequestEntity();
        $request->setUrl("2");
        $request->setMethod(Action::ACTION_NODE_TYPE_POST);
        $request->setBody($flag ? '{"test": <<test>>}' : '{"test": <<testBAD>>}');

        $secondRequest = new RequestEntity();
        $secondRequest->setUrl("1");
        $secondRequest->setMethod(Action::ACTION_NODE_TYPE_GET);
        $secondRequest->setBody('{}');

        $nodes[2]->setArguments(new ArrayCollection([$argument]));
        $nodes[2]->setRequest($request);
        $nodes[1]->setRequest($secondRequest);

        foreach ($nodes as $node) {
            $node->setGraph($graph);
        }

        // 0 -> 1 -> 2
        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[1]->addNeighbour($nodes[2]);

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }

    // if $flag is 0 then POST node body is JSON. if 1 then XML, if 2 then neither (invalid)
    private function getGraphWithXmlOrJsonBodyPostRequest(int $flag): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Trigger node
        $nodes[0] = new Condition();
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // POST node
        $nodes[1] = new Action();
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_POST);
        $request = new RequestEntity();
        $request->setUrl("");
        $request->setMethod(Action::ACTION_NODE_TYPE_POST);
        $body = match ($flag) {
            0 => TestConstants::EXAMPLE_JSON_BODY,
            1 => TestConstants::EXAMPLE_XML_BODY,
            2 => TestConstants::EXAMPLE_INVALID_BODY,
        };
        $request->setBody($body);
        $nodes[1]->setRequest($request);

        foreach ($nodes as $node) {
            $node->setId(new UuidV4());
            $node->setGraph($graph);
        }

        $nodes[0]->addNeighbour($nodes[1]);

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }

    private function getGraphWithAuthArguments(): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Trigger node
        $nodes[0] = new Condition();
        $nodes[0]->setId(new UuidV4());
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // GET node
        $nodes[1] = new Action();
        $nodes[1]->setId(new UuidV4());
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);

        // POST node with auth from the previous node
        $nodes[2] = new Action();
        $nodes[2]->setId(new UuidV4());
        $nodes[2]->setType(Action::ACTION_NODE_TYPE_GET);

        $requestOne = new RequestEntity();
        $requestOne->setUrl(AppFixtures::TEST_GET_URL);
        $requestOne->setMethod(Action::ACTION_NODE_TYPE_GET);
        $requestOne->setBody('{}');

        $auth = new Auth();
        $auth->setType(Auth::BEARER);
        $auth->setToken('<<test_token>>');

        $requestTwo = new RequestEntity();
        $requestTwo->setUrl(AppFixtures::TEST_POST_URL);
        $requestTwo->setMethod(Action::ACTION_NODE_TYPE_POST);
        $requestTwo->setBody('{}');
        $requestTwo->setAuth($auth);

        $argument = new Argument();
        $argument->setAlias('test_token');
        $argument->setParentId($nodes[1]->getId());
        $argument->setField('token');

        $nodes[2]->setArguments(new ArrayCollection([$argument]));
        $nodes[2]->setRequest($requestTwo);
        $nodes[1]->setRequest($requestOne);

        foreach ($nodes as $node) {
            $node->setGraph($graph);
        }

        // 0 -> 1 -> 2
        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[1]->addNeighbour($nodes[2]);

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }

    public function testRetrieveEntryWithKeyNotNullObject()
    {
        $expression = new MapExpression();
        $expression->setFieldName('field');
        $expression->setParentNodeId('parent');
        $expression->setMappedFieldName('mapped');

        $object = [
            'field' => 'value',
        ];

        $result = $this->graphExecutionService->retrieveEntryWithKey($expression, $object);

        $this->assertArrayHasKey('mapped', $result);
        $this->assertEquals('value', $result['mapped']);
    }

    public function testRetrieveEntryWithKeyNullObject()
    {
        $expression = new MapExpression();
        $expression->setFieldName('field');
        $expression->setParentNodeId('parent');
        $expression->setMappedFieldName('mapped');

        $object = null;

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Could not map values in the result with id parent because one of the objects was null.');

        $this->graphExecutionService->retrieveEntryWithKey($expression, $object);
    }

    public function testHandleMapNode()
    {
        $condition = new Condition();
        $expression = new MapExpression();
        $expression->setParentNodeId('parent');
        $expression->setFieldName('oldField');
        $expression->setMappedFieldName('newField');
        $condition->setMapExpression($expression);

        $results = [
            'parent' => [
                [
                    'oldField' => 'value1',
                    'otherField' => 'otherField1',
                ],
                [
                    'oldField' => 'value2',
                    'otherField' => 'otherField2',
                ],
            ],
        ];

        $result = $this->graphExecutionService->handleMapNode($condition, $results);

        $expectedResult = [[
            'newField' => 'value1',
        ], [
            'newField' => 'value2',
        ]];

        $this->assertEquals($result, $expectedResult);
    }

    public function testHandleMapNodeWithNullResult()
    {
        $condition = new Condition();
        $expression = new MapExpression();
        $expression->setParentNodeId('parent');
        $condition->setMapExpression($expression);

        $results = [];

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Could not map values in the result because the result with id parent was not provided.');

        $this->graphExecutionService->handleMapNode($condition, $results);
    }

    public function testCompareValuesWithNonNullLeftHandSideAndNonNullRightHandSide()
    {
        $condition = new Condition();
        $expression = new Expression();
        $expression->setFirstFieldNodeId('lhs');
        $expression->setFirstFieldValue('field');
        $expression->setComparisonType(Expression::EQUAL);
        $expression->setSecondFieldNodeId('rhs');
        $expression->setCompareTo(Expression::NODE_VALUE);
        $expression->setSecondFieldNodeValue('field');

        $leftHandSideObject = [
            'field' => 'value',
        ];
        $rightHandSideObject = [
            'field' => 'value',
        ];

        $results = [
            'rhs' => $rightHandSideObject,
        ];

        $condition->setExpression($expression);
        $condition->setGraph(new Graph());

        $result = $this->graphExecutionService->compareValues($leftHandSideObject, $condition, $results);

        $this->assertTrue($result);
    }

    public function testCompareValuesWithNonNullLeftHandSideAndNullRightHandSide()
    {
        $condition = new Condition();
        $expression = new Expression();
        $expression->setFirstFieldNodeId('lhs');
        $expression->setFirstFieldValue('field');
        $expression->setCompareTo(Expression::NODE_VALUE);
        $expression->setSecondFieldNodeId('rhs');

        $leftHandSideObject = [
            'field' => 'value',
        ];

        $results = [];

        $condition->setExpression($expression);
        $condition->setGraph($this->getGraphWithInvalidArguments(2));

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Could not compare values in the result because the right hand side result with id rhs was not provided.');

        $this->graphExecutionService->compareValues($leftHandSideObject, $condition, $results);
    }

    public function testCompareValuesWithNullLeftHandSide()
    {
        $condition = new Condition();
        $expression = new Expression();
        $expression->setFirstFieldNodeId('lhs');
        $expression->setSecondFieldNodeId('rhs');

        $leftHandSideObject = null;

        $results = [
            'rhs' => [
                'field' => 'value',
            ],
        ];

        $condition->setExpression($expression);

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Could not compare values because the left hand side result with id lhs was not provided.');

        $this->graphExecutionService->compareValues($leftHandSideObject, $condition, $results);
    }

    public function testHandleFilterNodeWithNullObjects()
    {
        $condition = new Condition();
        $expression = new Expression();
        $expression->setFirstFieldNodeId('field');

        $results = [];

        $condition->setExpression($expression);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Could not filter the result because the result with id field was not provided.');

        $this->graphExecutionService->handleFilterNode($condition, $results);
    }

    public function testExtractInvitesWithNullResponse()
    {
        $invite = new Invite();
        $invite->setEmail(new Argument());

        $results = [];

        $invite->getEmail()->setParentId('parent_id');

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Could not extract emails from the result because the result with id parent_id was not provided.');

        $this->graphExecutionService->extractInvites($invite, $results);
    }

    public function testExtractInvites()
    {
        // Create an instance of the Invite node
        $inviteNode = new Invite();

        // Set up the email argument
        $emailArgument = new Argument();
        $emailArgument->setAlias('email');
        $emailArgument->setField('email');
        $emailArgument->setParentId('parent_id');
        $inviteNode->setEmail($emailArgument);

        // Add extra metadata arguments
        $metadataArgument1 = new Argument();
        $metadataArgument1->setAlias('name');
        $metadataArgument1->setField('name');
        $metadataArgument1->setParentId('parent_id');
        $inviteNode->addArgument($metadataArgument1);

        $metadataArgument2 = new Argument();
        $metadataArgument2->setAlias('age');
        $metadataArgument2->setField('age');
        $metadataArgument2->setParentId('parent_id');
        $inviteNode->addArgument($metadataArgument2);

        // Create sample parent response data
        $response = [
            'parent_id' => [
                [
                    'email' => 'test@example.com',
                    'name' => 'John Doe',
                    'age' => 30,
                    'other' => 'other',
                ],
                [
                    'email' => 'example@example.com',
                    'name' => 'Jane Smith',
                    'age' => 25,
                    'other' => 'other',
                ],
            ],
        ];

        // Expected result
        $expectedInvites = [
            new InvitesData([
                'name' => 'John Doe',
                'age' => 30,
            ], 'test@example.com'),
            new InvitesData([
                'name' => 'Jane Smith',
                'age' => 25,
            ], 'example@example.com'),
        ];

        // Extract invites
        $invites = $this->graphExecutionService->extractInvites($inviteNode, $response);

        // Assert the result
        $this->assertEquals($expectedInvites, $invites);
    }

    public function testGetEmailFromDataWithInvalidEmail()
    {
        $emailArgument = new Argument();
        $emailArgument->setField('email');
        $emailArgument->setParentId('parent_id');

        $data = [
            'email' => 'invalid',
        ];

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Provided email is not valid.');

        $this->graphExecutionService->getEmailFromData($emailArgument, $data);
    }

    public function testGetValueToUseWithNullResult()
    {
        $results = [];

        $argument = new Argument();
        $argument->setParentId('parent_id');
        $this->expectException(HttpException::class);

        $this->graphExecutionService->getValueToUse($results, $argument);
    }

    public function testGetFieldValueFromObject()
    {
        // Prepare the test data
        $object = [
            'first' => [
                'second' => [
                    'third' => 'Value',
                ],
            ],
        ];
        $nestedFieldName = 'first.second.third';
        $nodeId = 'parent_id';
        $value = $this->graphExecutionService->getFieldValueFromObject($nestedFieldName, $object, $nodeId);
        $this->assertEquals('Value', $value);

        $object['first']['second'] = null;
        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('The field first.second was not provided in the result with id ' . $nodeId . '.');
        $this->graphExecutionService->getFieldValueFromObject($nestedFieldName, $object, $nodeId);
    }

    public function testGetArgumentToUseNoMatch()
    {
        // Prepare the test data
        $arguments = new ArrayCollection([
            new Argument(),
            new Argument(),
            new Argument(),
        ]);
        $arguments[0]->setAlias('alias1');
        $arguments[1]->setAlias('alias2');
        $arguments[2]->setAlias('alias3');
        $match = 'nonexistent';

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('The argument with alias ' . $match . ' was not provided.');
        $this->graphExecutionService->getArgumentToUse($arguments, $match);
    }

    public function testSetAuthenticationForRequestOAuth2()
    {
        $request = new RequestEntity();
        $auth = new Auth();
        $auth->setType(Auth::OAUTH2);
        $auth->setToken('oauth_token');
        $request->setAuth($auth);
        $options = [];

        $result = $this->graphExecutionService->setAuthenticationForRequest($request, $options);
        $expectedOptions = [
            'headers' => [
                'Authorization' => 'Bearer oauth_token',
            ],
        ];
        $this->assertEquals($expectedOptions, $result);
    }

    public function testSetAuthenticationForRequestApiKey()
    {
        // Prepare the test data
        $request = new RequestEntity();
        $auth = new Auth();
        $auth->setType(Auth::API_KEY);
        $auth->setToken('api_key_token');
        $request->setAuth($auth);
        $options = [];
        $result = $this->graphExecutionService->setAuthenticationForRequest($request, $options);

        // Assert the result
        $expectedOptions = [
            'headers' => [
                'X-Auth-Token' => 'api_key_token',
            ],
        ];
        $this->assertEquals($expectedOptions, $result);
    }

    public function testReplaceEmailData()
    {
        $invites = [
            new InvitesData([
                'name' => 'John Doe',
                'age' => 30,
            ], 'test@example.com'),
            new InvitesData([
                'name' => 'Jane Smith',
                'age' => 25,
            ], 'example@example.com'),
        ];
        $body = '{"email":<<email_data>>}';
        $expected = '{"email":[{"data":{"name":"John Doe","age":30},"email":"test@example.com"},{"data":{"name":"Jane Smith","age":25},"email":"example@example.com"}]}';

        $result = $this->graphExecutionService->replaceEmailData($invites, $body);
        $this->assertEquals($expected, $result);
    }

    private function getGraphWithNodesUnconnectedToTrigger(): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Trigger node
        $nodes[0] = new Trigger();
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // Request which the three GET nodes in this graph will share.
        $request = new RequestEntity();
        $request->setUrl("");
        $request->setMethod(Action::ACTION_NODE_TYPE_GET);
        $request->setBody("{}");

        // GET node connected to trigger.
        $nodes[1] = new Action();
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[1]->setRequest($request);

        // GET node unconnected to trigger
        $nodes[2] = new Action();
        $nodes[2]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[2]->setRequest($request);

        // GET node unconnected to trigger but connected to $nodes[2]
        $nodes[3] = new Action();
        $nodes[3]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[3]->setRequest($request);

        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[2]->addNeighbour($nodes[3]);

        for ($i = 0; $i < count($nodes); $i++) {
            $nodes[$i]->setId(UuidV4::fromString(TestConstants::UUID_STRINGS[$i]));
            $nodes[$i]->setGraph($graph);
        }

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }

    private function getGraphWithConditionComparingValueFromSameNode(): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Trigger node
        $nodes[0] = new Trigger();
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // Request which the three GET nodes in this graph will share.
        $request = new RequestEntity();
        $request->setUrl("https://jsonplaceholder.typicode.com/posts/1");
        $request->setMethod(Action::ACTION_NODE_TYPE_GET);
        $request->setBody("{}");

        // GET node connected to trigger.
        $nodes[1] = new Action();
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[1]->setRequest($request);

        // IF condition node which will compare a value from the GET to itself, i.e. should always evaluate to true
        $nodes[2] = new Condition();
        $nodes[2]->setType(Condition::CONDITION_NODE_TYPE_IF);

        // An expression which has the second field user value set to "", meaning it takes the second value from another
        // node. Note that it has the same node ID and field name in both the left hand side and right, so it should
        // always evaluate to true.
        $expression = new Expression();
        $expression->setType(Expression::EQUAL);
        $expression->setFirstFieldNodeId(TestConstants::UUID_STRINGS[1]);
        $expression->setFirstFieldValue("userId");
        $expression->setSecondFieldUserValue("");
        $expression->setCompareTo(Expression::NODE_VALUE);
        $expression->setSecondFieldNodeId(TestConstants::UUID_STRINGS[1]);
        $expression->setSecondFieldNodeValue("userId");
        $nodes[2]->setExpression($expression);

        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[1]->addNeighbour($nodes[2]);

        for ($i = 0; $i < count($nodes); $i++) {
            $nodes[$i]->setId(UuidV4::fromString(TestConstants::UUID_STRINGS[$i]));
            $nodes[$i]->setGraph($graph);
        }

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }

    // This is to test the sandbox execution
    private function getGraphWithPostAndGetNode(): Graph
    {
        $graph = new Graph();

        $nodes = [];

        // Trigger node
        $nodes[0] = new Trigger();
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // POST node
        $nodes[1] = new Action();
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_POST);
        $request = new RequestEntity();
        $request->setUrl("");
        $request->setMethod(Action::ACTION_NODE_TYPE_POST);
        $request->setBody("{}");
        $nodes[1]->setRequest($request);

        // GET node
        $nodes[2] = new Action();
        $nodes[2]->setType(Action::ACTION_NODE_TYPE_GET);
        $request = new RequestEntity();
        $request->setUrl("");
        $request->setMethod(Action::ACTION_NODE_TYPE_GET);
        $request->setBody("{}");
        $nodes[2]->setRequest($request);

        for ($i = 0; $i < count($nodes); $i++) {
            $nodes[$i]->setId(UuidV4::fromString(AppFixtures::UUID_STRINGS[$i]));
            $nodes[$i]->setGraph($graph);
        }

        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[1]->addNeighbour($nodes[2]);

        $graph->setNodes(new ArrayCollection($nodes));

        return $graph;
    }
}
