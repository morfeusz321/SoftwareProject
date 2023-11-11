<?php

namespace App\Service;

use App\Entity\Graph;
use App\Entity\User;
use App\Repository\GraphRepository;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class GraphService
{
    private GraphRepository $graphRepository;

    private UserRepository $userRepository;

    private LoggerInterface $logger;

    private SerializerInterface $serializer;

    private NodeService $nodeService;

    public function __construct(GraphRepository $graphRepository, UserRepository $userRepository, LoggerInterface $logger, SerializerInterface $serializer, NodeService $nodeService)
    {
        $this->graphRepository = $graphRepository;
        $this->userRepository = $userRepository;
        $this->logger = $logger;
        $this->serializer = $serializer;
        $this->nodeService = $nodeService;
    }

    /**
     * Get the list of graphs for a user.
     *
     * @param int $userId The user ID.
     * @return array An array of Graph objects.
     */
    public function getGraphs(int $userId): array
    {
        $user = $this->checkIfUserExists($userId);

        $this->getLogger()->info("GraphService.getGraphs: Get list of graphs for user {$userId}");
        return $this->graphRepository->findBy([
            "user" => $user,
        ]);
    }

    /**
     * Get a specific graph for a user.
     *
     * @param int $userId The user ID.
     * @param int $graphId The graph ID.
     * @return Graph The Graph object.
     * @throws NotFoundHttpException if the graph is not found.
     */
    public function getGraph(int $userId, int $graphId): Graph
    {
        $user = $this->checkIfUserExists($userId);

        $this->getLogger()->info("GraphService.getGraph: Get graph $graphId for user $userId");
        $graph = $this->graphRepository->findOneBy([
            "user" => $user,
            'id' => $graphId,
        ]);

        if ($graph === null) {
            throw new NotFoundHttpException("Graph {$graphId} does not exist");
        }

        return $graph;
    }

    /**
     * Delete a specific graph for a user.
     *
     * @param int $userId The user ID.
     * @param int $graphId The graph ID.
     * @throws NotFoundHttpException if the graph is not found.
     */
    public function deleteGraph(int $userId, int $graphId): void
    {
        $user = $this->checkIfUserExists($userId);

        $this->getLogger()->info("GraphService.deleteGraph: Get graph {$graphId} for user {$userId}");
        $graph = $this->graphRepository->findOneBy([
            "user" => $user,
            'id' => $graphId,
        ]);

        if ($graph === null) {
            throw new NotFoundHttpException("Graph {$graphId} does not exist");
        }

        $this->getLogger()->warning("GraphService.deleteGraph: About to delete graph {$graphId} for user {$userId}");
        $this->getGraphRepository()->remove($graph, flush: true);
        $this->getLogger()->info("GraphService.deleteGraph: Successfully deleted graph {$graphId} for user {$userId}");
    }

    /**
     * Create a new graph for a user.
     *
     * @param int $userId The user ID.
     * @param string $content The content of the graph.
     * @return Graph The created Graph object.
     */
    public function createGraph(int $userId, string $content): Graph
    {
        $this->getLogger()->info("GraphService.createGraph: About to create a graph for user {$userId}");
        $user = $this->checkIfUserExists($userId);

        $this->getLogger()->info("GraphService.createGraph: Deserializing the graph");
        $graph = $this->getSerializer()->deserialize($content, Graph::class, 'json');
        $nodesFromRequest = $this->getNodesFromRequest($content, $userId, $graph);
        $graph->setNodes($nodesFromRequest);
        $graph->setUser($user);

        $this->getLogger()->info("GraphService.createGraph: About to save the graph {$graph->getId()} for user {$userId}");
        $this->getGraphRepository()->save($graph, flush: true);

        return $graph;
    }

    /**
     * Update an existing graph for a user.
     *
     * @param int $userId The user ID.
     * @param int $graphId The graph ID.
     * @param string $content The updated content of the graph.
     * @return Graph The updated Graph object.
     */
    public function updateGraph(int $userId, int $graphId, string $content)
    {
        $this->getLogger()->info("GraphService.updateGraph: About to update a graph for user {$userId}");
        $user = $this->checkIfUserExists($userId);

        $this->getLogger()->info("GraphService.updateGraph: Deserializing the graph");
        $graph = $this->graphRepository->findOneBy([
            'id' => $graphId,
            'userId' => $userId,
        ]);
        $graph = $this->getSerializer()->deserialize(
            $content,
            Graph::class,
            'json',
            [
                AbstractNormalizer::OBJECT_TO_POPULATE => $graph,
                AbstractNormalizer::GROUPS => ['graph'],
            ]
        );
        $nodesFromRequest = $this->getNodesFromRequest($content, $userId, $graph);
        if (! $nodesFromRequest->isEmpty()) {
            $graph->setNodes($nodesFromRequest);
        }
        $graph->setUser($user);
        $this->getLogger()->info("GraphService.updateGraph: About to save the graph {$graphId} for user {$userId}");
        $this->getGraphRepository()->save($graph, flush: true);
        return $graph;
    }

    /**
     * Check if a user exists and return the User object.
     *
     * @param int $userId The user ID.
     * @return User The User object.
     * @throws NotFoundHttpException if the user is not found.
     */
    private function checkIfUserExists(int $userId): User
    {
        $this->getLogger()->info("GraphService.checkIfUserExists: Check if user {$userId} exists");
        $user = $this->getUserRepository()->find($userId);
        if ($user === null) {
            throw new NotFoundHttpException("Provided user id does not exist");
        }
        return $user;
    }

    /**
     * Get ArrayCollection of nodes from the request content.
     *
     * @param string $content The request content.
     * @param int $userId The user ID.
     * @param mixed $graph The graph object.
     * @return ArrayCollection The ArrayCollection of nodes.
     */
    private function getNodesFromRequest(string $content, int $userId, mixed $graph): ArrayCollection
    {
        $data = json_decode($content, true);
        if (! key_exists('nodes', $data)) {
            return new ArrayCollection();
        }
        $nodes = $data['nodes'];
        $nodesFromRequest = new ArrayCollection();
        foreach ($nodes as $node) {
            $node = $this->getNodeService()->createNode($node);
            $node->setGraph($graph);
        }
        foreach ($nodes as $node) {
            $node = $this->getNodeService()->updateNode($node, $userId);
            $node->setGraph($graph);
            $nodesFromRequest->add($node);
        }
        return $nodesFromRequest;
    }

    public function getAllGraphs()
    {
        return $this->getGraphRepository()->findAll();
    }

    public function getGraphRepository(): GraphRepository
    {
        return $this->graphRepository;
    }

    public function setGraphRepository(GraphRepository $graphRepository): void
    {
        $this->graphRepository = $graphRepository;
    }

    public function getUserRepository(): UserRepository
    {
        return $this->userRepository;
    }

    public function setUserRepository(UserRepository $userRepository): void
    {
        $this->userRepository = $userRepository;
    }

    public function getLogger(): LoggerInterface
    {
        return $this->logger;
    }

    public function setLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }

    public function getSerializer(): SerializerInterface
    {
        return $this->serializer;
    }

    public function setSerializer(SerializerInterface $serializer): void
    {
        $this->serializer = $serializer;
    }

    public function getNodeService(): NodeService
    {
        return $this->nodeService;
    }

    public function setNodeService(NodeService $nodeService): void
    {
        $this->nodeService = $nodeService;
    }
}
