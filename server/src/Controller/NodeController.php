<?php

namespace App\Controller;

use App\Entity\Graph;
use App\Service\GraphExecutionService;
use App\Service\NodeService;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('api/')]
class NodeController extends AbstractController
{
    private NodeService $nodeService;

    private GraphExecutionService $graphExecutionService;

    public function __construct(NodeService $nodeService, GraphExecutionService $graphExecutionService)
    {
        $this->nodeService = $nodeService;
        $this->graphExecutionService = $graphExecutionService;
    }

    /**
     * Executes a node provided in the body.
     */
    #[Route('user/{userId}/nodes/execute', name: 'executeNode', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Executes the node provided in the body',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'Id of user for whom we are executing the node',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Nodes')]
    public function executeNode(int $userId, Request $request): Response
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $node = $this->getNodeService()->createNodeForExecution($data, $userId);
        $logGraph = new Graph();
        $logGraph->setLogs([]);
        $node->setGraph($logGraph);
        $results = [];
        $this->getGraphExecutionService()->executeNode($node, $results, false, false);
        return $this->json($results[$node->getIdString()], Response::HTTP_CREATED);
    }

    public function getNodeService(): NodeService
    {
        return $this->nodeService;
    }

    public function setNodeService(NodeService $nodeService): void
    {
        $this->nodeService = $nodeService;
    }

    public function getGraphExecutionService(): GraphExecutionService
    {
        return $this->graphExecutionService;
    }

    public function setGraphExecutionService(GraphExecutionService $graphExecutionService): void
    {
        $this->graphExecutionService = $graphExecutionService;
    }
}
