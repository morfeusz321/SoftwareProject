<?php

namespace App\Service;

use App\Entity\Node\Custom;
use App\Entity\User;
use App\Repository\Node\CustomNodeRepository;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class CustomNodeService
{
    private CustomNodeRepository $customNodeRepository;

    private ActionService $actionService;

    private SerializerInterface $serializer;

    private UserRepository $userRepository;

    private LoggerInterface $logger;

    /**
     * @param CustomNodeRepository $customNodeRepository the custom node repository
     * @param ActionService $actionService the service to handle actions
     * @param SerializerInterface $serializer the serializer
     * @param UserRepository $userRepository the user repository
     * @param LoggerInterface $logger the logger
     */
    public function __construct(CustomNodeRepository $customNodeRepository, ActionService $actionService, SerializerInterface $serializer, UserRepository $userRepository, LoggerInterface $logger)
    {
        $this->customNodeRepository = $customNodeRepository;
        $this->actionService = $actionService;
        $this->serializer = $serializer;
        $this->userRepository = $userRepository;
        $this->logger = $logger;
    }

    /**
     * The function to update CustomNode
     */
    public function updateCustomNode(string $content, int $userId, int $customNodeId): ?Custom
    {
        $customNode = $this->getCustomNode($userId, $customNodeId);
        if ($customNode === null) {
            $customNode = new Custom();
        }
        $customNode = $this->handleNodeCreation($content, $customNode, $userId);
        $this->getCustomNodeRepository()->save($customNode, flush: true);
        return $customNode;
    }

    /**
     * The function to create a new custom node
     * @return Custom
     */
    public function createCustomNode(int $userId, string $content)
    {
        $customNode = new Custom();
        $user = $this->checkIfUserExists($userId);
        $customNode->setUser($user);
        $customNode = $this->handleNodeCreation($content, $customNode, $userId);
        $this->getCustomNodeRepository()->save($customNode, flush: true);
        return $customNode;
    }

    /**
     * The function to retrieve all custom nodes of a user
     * @return Custom[]
     */
    public function getCustomNodes(int $userId)
    {
        $this->checkIfUserExists($userId);
        return $this->getCustomNodeRepository()->findBy([
            'user' => $userId,
        ]);
    }

    /**
     * The fucntion to get a custom Node by its id and user id
     * @return Custom|null
     */
    public function getCustomNode(int $userId, int $customNodeId)
    {
        $this->checkIfUserExists($userId);
        return $this->getCustomNodeRepository()->findOneBy([
            'user' => $userId,
            'id' => $customNodeId,
        ]);
    }

    public function getCustomNodeRepository(): CustomNodeRepository
    {
        return $this->customNodeRepository;
    }

    public function getSerializer(): SerializerInterface
    {
        return $this->serializer;
    }

    public function getActionService(): ActionService
    {
        return $this->actionService;
    }

    private function getUserRepository(): UserRepository
    {
        return $this->userRepository;
    }

    private function getLogger(): LoggerInterface
    {
        return $this->logger;
    }

    /**
     * Check if a user exists and return the User object.
     *
     * @param int $userId - The user ID.
     * @return User - The User object.
     * @throws NotFoundHttpException - if the user is not found.
     */
    private function checkIfUserExists(int $userId): User
    {
        $this->getLogger()->info("CustomNodeService.checkIfUserExists: Check if  user {$userId} exists");
        $user = $this->getUserRepository()->find($userId);
        if ($user === null) {
            throw new NotFoundHttpException("Provided user id does not exist");
        }
        return $user;
    }

    /**
     * The function to handle the creation of a custom node
     * @param string $content - the content of the request
     * @param Custom $customNode - the custom node to populate
     * @param int $userId - the user id
     * @return Custom - the custom node
     */
    private function handleNodeCreation(string $content, Custom $customNode, int $userId): Custom
    {
        $this->checkIfUserExists($userId);
        $customNode = $this->getSerializer()->deserialize($content, Custom::class, 'json', [
            AbstractNormalizer::OBJECT_TO_POPULATE => $customNode,
            AbstractNormalizer::IGNORED_ATTRIBUTES => ['action'],
        ]);

        $decodedAction = json_decode($content, true)['action'];
        $actionContent = json_encode($decodedAction);
        $actionFromRequest = $this->getActionService()->updateAction($actionContent, $userId, $decodedAction['id']);
        $customNode->setAction($actionFromRequest);
        return $customNode;
    }

    /**
     * The function to delete a custom node
     * @param int $userId - the user id
     * @param int $customNodeId - the custom node id
     * @throws NotFoundHttpException - if the custom node is not found
     */
    public function deleteCustomNode(int $userId, int $customNodeId)
    {
        $customNode = $this->getCustomNode($userId, $customNodeId);
        if ($customNode === null) {
            throw new NotFoundHttpException("Provided custom node id does not exist");
        }
        $this->getCustomNodeRepository()->remove($customNode, flush: true);
    }
}
