<?php

namespace App\Tests\Service;

use App\Entity\Graph;
use App\Entity\Node\Node;
use App\Entity\User;
use App\Repository\GraphRepository;
use App\Repository\UserRepository;
use App\Service\GraphService;
use App\Service\NodeService;
use App\Tests\TestConstants;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class GraphServiceTest extends TestCase
{
    private GraphRepository $graphRepository;

    private UserRepository $userRepository;

    private LoggerInterface $logger;

    private SerializerInterface $serializer;

    private NodeService $nodeService;

    private GraphService $graphService;

    public function setUp(): void
    {
        $this->graphRepository = $this->createMock(GraphRepository::class);
        $this->userRepository = $this->createMock(UserRepository::class);
        $this->logger = $this->createMock(LoggerInterface::class);
        $this->serializer = $this->createMock(SerializerInterface::class);
        $this->nodeService = $this->createMock(NodeService::class);

        $this->graphService = new GraphService($this->graphRepository, $this->userRepository, $this->logger, $this->serializer, $this->nodeService);
    }

    public function testCreateGraph()
    {
        $userId = 1;
        $content = TestConstants::GRAPH_CREATION_CONTENT_JSON;
        $user = new User();
        $graph = new Graph();

        $this->userRepository->expects($this->once())->method('find')->with($userId)->willReturn($user);
        $this->serializer->expects($this->once())->method('deserialize')->willReturn($graph);

        $nodeData = json_decode($content, true)['nodes'];

        $this->nodeService->expects($this->exactly(count($nodeData)))
            ->method('createNode')
            ->willReturn(new Node());
        $this->nodeService->expects($this->exactly(count($nodeData)))
            ->method('updateNode')
            ->willReturn(new Node());

        $this->graphRepository->expects($this->once())->method('save')->with($graph);

        $createdGraph = $this->graphService->createGraph($userId, $content);

        $this->assertInstanceOf(Graph::class, $createdGraph);
    }

    public function testDeleteGraph()
    {
        $userId = 1;
        $graphId = 1;
        $user = new User();
        $graph = new Graph();

        $this->userRepository->expects($this->once())->method('find')->with($userId)->willReturn($user);
        $this->graphRepository->expects($this->once())->method('findOneBy')->willReturn($graph);
        $this->graphRepository->expects($this->once())->method('remove')->with($graph);

        $this->graphService->deleteGraph($userId, $graphId);
    }

    public function testGetGraph()
    {
        $userId = 1;
        $graphId = 1;
        $user = new User();
        $graph = new Graph();

        $this->userRepository->expects($this->once())->method('find')->with($userId)->willReturn($user);
        $this->graphRepository->expects($this->once())->method('findOneBy')->willReturn($graph);

        $fetchedGraph = $this->graphService->getGraph($userId, $graphId);

        $this->assertInstanceOf(Graph::class, $fetchedGraph);
    }

    public function testGetGraphs()
    {
        $userId = 1;
        $user = new User();
        $graph1 = new Graph();
        $graph2 = new Graph();

        $this->userRepository->expects($this->once())->method('find')->with($userId)->willReturn($user);
        $this->graphRepository->expects($this->once())->method('findBy')->with([
            "user" => $user,
        ])->willReturn([$graph1, $graph2]);
        $this->logger->expects($this->exactly(2))
            ->method('info')
            ->willReturnOnConsecutiveCalls(
                $this->returnValueMap([
                    [$this->equalTo('GraphService.checkIfUserExists: Check if user 1 exists')],
                    [$this->equalTo('GraphService.getGraphs: Get list of graphs for user 1')],
                ])
            );
        $graphs = $this->graphService->getGraphs($userId);

        $this->assertCount(2, $graphs);
        $this->assertInstanceOf(Graph::class, $graphs[0]);
        $this->assertInstanceOf(Graph::class, $graphs[1]);
    }

    public function testUpdateGraph()
    {
        $userId = 1;
        $graphId = 1;
        $content = '{
        "id": 1,
        "name": "updated_graph",
        "user": {
            "id": 1
        },
        "nodes": [],
        "isActive": true,
        "isDraft": false
    }';
        $user = new User();
        $graph = new Graph();
        $updatedGraph = new Graph();
        $updatedGraph->setName('updated_graph');

        $this->userRepository->expects($this->once())->method('find')->with($userId)->willReturn($user);
        $this->graphRepository->expects($this->once())->method('findOneBy')->with([
            "id" => $graphId,
            "userId" => 1,
        ])->willReturn($graph);
        $this->serializer->expects($this->once())->method('deserialize')->willReturn($updatedGraph);
        $this->graphRepository->expects($this->once())->method('save')->with($updatedGraph);
        $this->logger->expects($this->exactly(4))->method('info');

        $graph = $this->graphService->updateGraph($userId, $graphId, $content);

        $this->assertInstanceOf(Graph::class, $graph);
        $this->assertEquals('updated_graph', $graph->getName());
    }

    public function testGetters(): void
    {
        $this->assertInstanceOf(GraphRepository::class, $this->graphService->getGraphRepository());
        $this->assertInstanceOf(UserRepository::class, $this->graphService->getUserRepository());
        $this->assertInstanceOf(LoggerInterface::class, $this->graphService->getLogger());
        $this->assertInstanceOf(SerializerInterface::class, $this->graphService->getSerializer());
        $this->assertInstanceOf(NodeService::class, $this->graphService->getNodeService());
    }

    public function testSetters(): void
    {
        $graphRepository = $this->createMock(GraphRepository::class);
        $userRepository = $this->createMock(UserRepository::class);
        $logger = $this->createMock(LoggerInterface::class);
        $serializer = $this->createMock(SerializerInterface::class);
        $nodeService = $this->createMock(NodeService::class);

        $this->graphService->setGraphRepository($graphRepository);
        $this->graphService->setUserRepository($userRepository);
        $this->graphService->setLogger($logger);
        $this->graphService->setSerializer($serializer);
        $this->graphService->setNodeService($nodeService);

        $this->assertSame($graphRepository, $this->graphService->getGraphRepository());
        $this->assertSame($userRepository, $this->graphService->getUserRepository());
        $this->assertSame($logger, $this->graphService->getLogger());
        $this->assertSame($serializer, $this->graphService->getSerializer());
        $this->assertSame($nodeService, $this->graphService->getNodeService());
    }
}
