<?php

namespace App\Controller;

use App\Service\GraphExecutionService;
use App\Service\GraphService;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('api/')]
class GraphController extends AbstractController
{
    private GraphService $graphService;

    private GraphExecutionService $graphExecutionService;

    public function __construct(GraphService $graphService, GraphExecutionService $graphExecutionService)
    {
        $this->graphService = $graphService;
        $this->graphExecutionService = $graphExecutionService;
    }

    /**
     * Retrieves all graphs for a specific user.
     */
    #[Route('user/{userId}/graphs', name: 'listGraphs', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of all graphs for the specified user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'The ID of the user for whom to retrieve the graphs',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Graphs')]
    public function getGraphs(int $userId): Response
    {
        $graphs = $this->getGraphService()->getGraphs($userId);
        return $this->json($graphs, context: [
            AbstractNormalizer::GROUPS => ['graphInfo', 'neighbours'],
        ]);
    }

    /**
     * Retrieves the graph with specified id.
     */
    #[Route('user/{userId}/graphs/{graphId}', name: 'getGraph', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Get the graph with specified id for a user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'Id of user for whom we are getting graphs',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'graphId',
        description: 'Id of the graph we want to get',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Graphs')]
    public function getGraph(int $userId, int $graphId): Response
    {
        $graph = $this->getGraphService()->getGraph($userId, $graphId);
        return $this->json($graph, context: [
            AbstractNormalizer::GROUPS => ['graphInfo', 'neighbours'],
        ]);
    }

    /**
     * Executes the flow in the given graph.
     */
    #[Route('user/{userId}/graphs/{graphId}/execute', name: 'executeGraph', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Execute the graph with specified id for a user'
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'Id of user for whom we are executing the flow graph',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'graphId',
        description: 'Id of the graph we want to execute',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Graphs')]
    public function executeGraph(int $userId, int $graphId): Response
    {
        $graph = $this->getGraphService()->getGraph($userId, $graphId);
        $graph = $this->getGraphExecutionService()->executeGraphFlow($graph);
        return $this->json($graph, context: [
            AbstractNormalizer::GROUPS => ['logs'],
        ]);
    }

    /**
     * Executes the flow in the given graph in sandbox mode, so that only GET requests will be executed and any emails
     * will not be sent.
     */
    #[Route('user/{userId}/graphs/{graphId}/executeSandbox', name: 'executeGraphSandbox', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Execute the graph with specified id for a user'
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'Id of user for whom we are executing the flow graph',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'graphId',
        description: 'Id of the graph we want to execute',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Graphs')]
    public function executeGraphSandbox(int $userId, int $graphId): Response
    {
        $graph = $this->getGraphService()->getGraph($userId, $graphId);
        $graph = $this->getGraphExecutionService()->executeGraphFlow($graph, isSandboxMode: true);
        return $this->json($graph, context: [
            AbstractNormalizer::GROUPS => ['logs'],
        ]);
    }

    /**
     * Retrieves the logs of the graph with specified id.
     */
    #[Route('user/{userId}/graphs/{graphId}/logs', name: 'getGraphLogs', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Get the graphs logs with specified id for a user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'Id of user for whom we are getting graphs logs',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'graphId',
        description: 'Id of the graph we want to get logs for',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Graphs')]
    public function getLogsForGraph(int $userId, int $graphId): Response
    {
        $graph = $this->getGraphService()->getGraph($userId, $graphId);
        return $this->json($graph, context: [
            AbstractNormalizer::GROUPS => ['logs'],
        ]);
    }

    /**
     * Deletes specified graph.
     */
    #[Route('user/{userId}/graphs/{graphId}', name: 'deleteGraph', methods: ['DELETE'])]
    #[OA\Response(
        response: 204,
        description: 'Delete the graph with specified id for a user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'Id of user for whom we are deleting graphs',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'graphId',
        description: 'Id of the graph we want to delete',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Graphs')]
    public function deleteGraph(int $userId, int $graphId): Response
    {
        $this->getGraphService()->deleteGraph($userId, $graphId);
        return new Response(status: Response::HTTP_NO_CONTENT);
    }

    /**
     * Creates new graph with properties given in the request body.
     */
    #[Route('user/{userId}/graphs', name: 'createGraph', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Creates a graph for a user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'Id of user for whom we are deleting graphs',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Graphs')]
    public function createGraph(int $userId, Request $request): Response
    {
        $content = $request->getContent();
        $graph = $this->getGraphService()->createGraph($userId, $content);
        return $this->json($graph, Response::HTTP_CREATED, context: [
            AbstractNormalizer::GROUPS => ['graphInfo', 'neighbours'],
        ]);
    }

    /**
     * Updates the graph if it is present in the database, if not creates new one with properties from request body.
     */
    #[Route('user/{userId}/graphs/{graphId}', name: 'updateGraph', methods: ['PUT'])]
    #[OA\Response(
        response: 201,
        description: 'Updates a graph for a user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'Id of user for whom we are updating the graph',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'Graphs')]
    public function updateGraph(int $userId, int $graphId, Request $request): Response
    {
        $content = $request->getContent();

        $graph = $this->getGraphService()->updateGraph($userId, $graphId, $content);
        return $this->json($graph, Response::HTTP_CREATED, context: [
            AbstractNormalizer::GROUPS => ['graphInfo', 'neighbours'],
        ]);
    }

    public function getGraphService(): GraphService
    {
        return $this->graphService;
    }

    public function setGraphService(GraphService $graphService): void
    {
        $this->graphService = $graphService;
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
