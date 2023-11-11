<?php

namespace App\Controller;

use App\Service\CustomNodeService;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('api/')]
class CustomNodeController extends AbstractController
{
    private CustomNodeService $customNodeService;

    public function __construct(CustomNodeService $customNodeService)
    {
        $this->customNodeService = $customNodeService;
    }

    /**
     * Retrieves all custom nodes for a specific user.
     */
    #[Route('user/{userId}/custom-nodes', name: 'listCustomNodes', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of all custom nodes for the specified user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'The ID of the user for whom to retrieve the custom nodes',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'CustomNodes')]
    public function getCustomNodes(int $userId): Response
    {
        $nodes = $this->getCustomNodesService()->getCustomNodes($userId);
        return $this->json($nodes, context: [
            AbstractNormalizer::GROUPS => ['customNodeInfo', 'graphInfo'],
        ]);
    }

    /**
     * Retrieves a custom nodes for a specific user with given id.
     */
    #[Route('user/{userId}/custom-nodes/{nodeId}', name: 'geCustomNode', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a custom node for the specified user with given id',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'The ID of the user for whom to retrieve the custom nodes',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'nodeId',
        description: 'The ID of the custom node to retrieve',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'CustomNodes')]
    public function getCustomNode(int $userId, int $nodeId): Response
    {
        $node = $this->getCustomNodesService()->getCustomNode($userId, $nodeId);
        if (! $node) {
            return $this->json([
                'error' => 'Node with this id does not exist',
            ], 404);
        }
        return $this->json($node, context: [
            AbstractNormalizer::GROUPS => ['customNodeInfo', 'graphInfo'],
        ]);
    }

    /**
     * Creates a new custom node for a specific user.
     */
    #[Route('user/{userId}/custom-nodes', name: 'createCustomNode', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Creates a new custom node for the specified user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'The ID of the user for whom to create the custom node',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'CustomNodes')]
    public function createCustomNode(Request $request, int $userId): Response
    {
        $data = $request->getContent();
        $node = $this->getCustomNodesService()->createCustomNode($userId, $data);
        return $this->json($node, Response::HTTP_CREATED, context: [
            AbstractNormalizer::GROUPS => ['customNodeInfo', 'graphInfo'],
        ]);
    }

    /**
     * Updates a custom node for a specific user with data provided.
     */
    #[Route('user/{userId}/custom-nodes/{nodeId}', name: 'updateCustomNode', methods: ['PUT'])]
    #[OA\Response(
        response: 201,
        description: 'Updates a custom node for the specified user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'The ID of the user for whom to update the custom node',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'nodeId',
        description: 'The ID of the custom node to update',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'CustomNodes')]
    public function updateCustomNode(Request $request, int $userId, int $nodeId): Response
    {
        $data = $request->getContent();
        $node = $this->getCustomNodesService()->updateCustomNode($data, $userId, $nodeId);
        return $this->json($node, Response::HTTP_CREATED, context: [
            AbstractNormalizer::GROUPS => ['customNodeInfo', 'graphInfo'],
        ]);
    }

    /**
     * Deletes a custom node for a specific user.
     */
    #[Route('user/{userId}/custom-nodes/{nodeId}', name: 'deleteCustomNode', methods: ['DELETE'])]
    #[OA\Response(
        response: 204,
        description: 'Deletes a custom node for the specified user',
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'The ID of the user for whom to delete the custom node',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'nodeId',
        description: 'The ID of the custom node to delete',
        in: 'path',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Tag(name: 'CustomNodes')]
    public function deleteCustomNode(int $userId, int $nodeId): Response
    {
        $this->getCustomNodesService()->deleteCustomNode($userId, $nodeId);
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    public function getCustomNodesService(): CustomNodeService
    {
        return $this->customNodeService;
    }

    public function setCustomNodesService(CustomNodeService $nodeService)
    {
        $this->customNodeService = $nodeService;
    }
}
