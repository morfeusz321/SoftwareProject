<?php

namespace App\Service;

use App\Entity\Argument;
use App\Entity\Node\Action;
use App\Entity\Node\Invite;
use App\Repository\Node\ActionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\UuidV4;

class ActionService
{
    private ActionRepository $actionRepository;

    private ArgumentService $argumentService;

    private SerializerInterface $serializer;

    private LoggerInterface $logger;

    /**
     * ActionService constructor.
     *
     * @param ActionRepository $actionRepository The action repository.
     * @param SerializerInterface $serializer The serializer.
     * @param ArgumentService $argumentService The argument service.
     */
    public function __construct(ActionRepository $actionRepository, SerializerInterface $serializer, ArgumentService $argumentService, LoggerInterface $logger)
    {
        $this->actionRepository = $actionRepository;
        $this->serializer = $serializer;
        $this->argumentService = $argumentService;
        $this->logger = $logger;
    }

    /**
     * Update or create an Action entity based on the provided content.
     *
     * @param string $content - The content to deserialize and update the Action.
     * @param int $userId - The ID of the user associated with the Action.
     * @param string $actionId  - The ID of the Action to update or create.
     * @return Action - The updated or created Action entity.
     */
    public function updateAction(string $content, int $userId, string $actionId)
    {
        $actionNode = $this->getActionRepository()->find($actionId);
        if ($actionNode === null) {
            $actionNode = new Action();
        }
        $actionNode = $this->deserializeActionNode($content, $actionNode, $userId);
        $this->getActionRepository()->save($actionNode);
        return $actionNode;
    }

    /**
     * Get the ArrayCollection of Arguments from the request content.
     *
     * @param string $content - The request content.
     * @param Action|null $actionNode - The Action entity (can be null if it's a new Action).
     * @return ArrayCollection - The ArrayCollection of Arguments.
     */
    private function getArgumentsFromRequest(string $content, ?Action $actionNode): ArrayCollection
    {
        $argumentsFromRequest = new ArrayCollection();
        $data = json_decode($content, true);
        if (! key_exists('arguments', $data)) {
            return $argumentsFromRequest;
        }
        $arguments = $data['arguments'];

        foreach ($arguments as $argument) {
            $argument = $this->updateArgument($argument);
            $argumentsFromRequest->add($argument);
            $argument->setAction($actionNode);
        }
        return $argumentsFromRequest;
    }

    /**
     * Update or create an Argument entity based on the provided argument data.
     *
     * @param mixed $argument - The argument data.
     * @return Argument - The updated or created Argument entity.
     */
    public function updateArgument(mixed $argument): mixed
    {
        $argumentId = -1;
        $argument = json_encode($argument);
        $argument = $this->getArgumentService()->updateArgument($argumentId, $argument);
        return $argument;
    }

    public function getActionRepository(): ActionRepository
    {
        return $this->actionRepository;
    }

    public function setActionRepository(ActionRepository $actionRepository): void
    {
        $this->actionRepository = $actionRepository;
    }

    public function getSerializer(): SerializerInterface
    {
        return $this->serializer;
    }

    public function setSerializer(SerializerInterface $serializer): void
    {
        $this->serializer = $serializer;
    }

    public function getArgumentService(): ArgumentService
    {
        return $this->argumentService;
    }

    public function setArgumentService(ArgumentService $argumentService): void
    {
        $this->argumentService = $argumentService;
    }

    /**
     * Create an Action entity.
     * @param mixed $nodeId - The ID of the Action entity.
     * @return Action - The created Action entity.
     */
    public function createAction(mixed $nodeId)
    {
        $actionNode = $this->getActionRepository()->find($nodeId);
        if ($actionNode === null) {
            $actionNode = new Action();
        }
        $actionNode->setId(UuidV4::fromString($nodeId));
        $this->actionRepository->save($actionNode);
        return $actionNode;
    }

    /**
     * Create an Action entity for execution.
     * @param string $content - The content to deserialize and update the Action.
     * @param int $userId - The ID of the user associated with the Action.
     * @return Action - The created Action entity.
     */
    public function createActionForExecution(string $content, int $userId)
    {
        $actionNode = new Action();
        $this->getSerializer()->deserialize($content, Action::class, 'json', [
            AbstractNormalizer::OBJECT_TO_POPULATE => $actionNode,
            AbstractNormalizer::IGNORED_ATTRIBUTES => ['arguments'],
        ]);
        $argumentsFromRequest = $this->getArgumentsFromRequest($content, $actionNode);
        $actionNode->setArguments($argumentsFromRequest);
        $actionNode->setUserId($userId);
        return $actionNode;
    }

    /**
     * Deserialize the Action entity from the request content.
     * @param string $content - The content to deserialize and update the Action.
     * @param Action|null $actionNode - The Action entity (can be null if it's a new Action).
     * @param int $userId - The ID of the user associated with the Action.
     * @return Action|Invite - The updated or created Action entity.
     */
    public function deserializeActionNode(string $content, ?Action $actionNode, int $userId): Action|Invite
    {
        $actionNode = $this->getSerializer()->deserialize($content, Action::class, 'json', [
            AbstractNormalizer::OBJECT_TO_POPULATE => $actionNode,
            AbstractNormalizer::IGNORED_ATTRIBUTES => ['arguments'],
        ]);
        $argumentsFromRequest = $this->getArgumentsFromRequest($content, $actionNode);
        $actionNode = $this->setArguments($actionNode, $argumentsFromRequest);
        $actionNode->setUserId($userId);
        return $actionNode;
    }

    /**
     * Set the Arguments of the Action entity.
     * @param Action $actionNode - The Action entity.
     * @param ArrayCollection $argumentsFromRequest - The ArrayCollection of Arguments.
     * @return Action - The updated Action entity.
     */
    private function setArguments(Action $actionNode, ArrayCollection $argumentsFromRequest): Action
    {
        $actionNode->getArguments()->clear();
        $actionNode->setArguments($argumentsFromRequest);
        return $actionNode;
    }


    public function getLogger(): LoggerInterface
    {
        return $this->logger;
    }


    public function setLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }
}
