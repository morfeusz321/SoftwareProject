<?php

namespace App\Service;

use App\Entity\Node\Action;
use App\Entity\Node\Condition;
use App\Entity\Node\Node;
use App\Entity\Node\Trigger;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class NodeService
{
    private ActionService $actionService;

    private ConditionService $conditionService;

    private InviteService $inviteService;

    private TriggerService $triggerService;

    private EntityManagerInterface $entityManager;

    public function __construct(ActionService $actionService, ConditionService $conditionService, EntityManagerInterface $entityManager, TriggerService $triggerService, InviteService $inviteService)
    {
        $this->actionService = $actionService;
        $this->conditionService = $conditionService;
        $this->entityManager = $entityManager;
        $this->inviteService = $inviteService;
        $this->triggerService = $triggerService;
    }

    /**
     * Update a node (Action or Condition) based on the provided data.
     *
     * @param mixed $nodeData The node data.
     * @param int $userId The user ID.
     * @return Action|Condition|mixed|object|null The updated node object.
     */
    public function updateNode(mixed $nodeData, int $userId): mixed
    {
        $nodeId = $nodeData['id'];
        $contentForNode = json_encode($nodeData);
        if (in_array($nodeData['type'], Condition::CONDITION_NODE_TYPE)) {
            $node = $this->getConditionService()->updateCondition($contentForNode, $userId, $nodeId);
        } elseif (in_array($nodeData['type'], [Action::ACTION_NODE_TYPE_INVITE])) {
            $node = $this->inviteService->updateInvite($contentForNode, $userId, $nodeId);
        } elseif ($nodeData['type'] === Trigger::TRIGGER_NODE_TYPE_TRIGGER) {
            $node = $this->getTriggerService()->updateTrigger($contentForNode, $userId, $nodeId);
        } else {
            $node = $this->getActionService()->updateAction($contentForNode, $userId, $nodeId);
        }
        $neighboursFromDatabase = new ArrayCollection();
        if (key_exists('neighbours', $nodeData)) {
            foreach ($nodeData['neighbours'] as $neighbour) {
                $neighbourInDatabase = $this->entityManager->getRepository(Node::class)->find($neighbour);
                $neighboursFromDatabase->add($neighbourInDatabase);
            }
            $node->setNeighbours($neighboursFromDatabase);
        }
        return $node;
    }

    /**
     * Create a node (Action or Condition) based on the provided data.
     *
     * @param mixed $node The node data.
     * @return Action|Condition|mixed|object|null The created node object.
     */
    public function createNode(mixed $node): mixed
    {
        $nodeId = $node['id'];
        if (in_array($node['type'], Condition::CONDITION_NODE_TYPE)) {
            $node = $this->getConditionService()->createCondition($nodeId);
        } elseif (in_array($node['type'], [Action::ACTION_NODE_TYPE_INVITE])) {
            $node = $this->inviteService->createInvite($nodeId);
        } elseif ($node['type'] === Trigger::TRIGGER_NODE_TYPE_TRIGGER) {
            $node = $this->getTriggerService()->createTrigger($nodeId);
        } else {
            $node = $this->getActionService()->createAction($nodeId);
        }
        return $node;
    }

    /**
     * Create a an Action without saving for execution
     *
     * @param mixed $nodeData The node data.
     * @param int $userId The user ID.
     * @return Action|null The created Action node.
     */
    public function createNodeForExecution(mixed $nodeData, int $userId): mixed
    {
        $contentForNode = json_encode($nodeData);
        if ($nodeData['type'] === ACTION::ACTION_NODE_TYPE_GET) {
            $node = $this->getActionService()->createActionForExecution($contentForNode, $userId);
        } else {
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, message: "Unsupported node execution type");
        }
        return $node;
    }

    public function getActionService(): ActionService
    {
        return $this->actionService;
    }

    public function setActionService(ActionService $actionService): void
    {
        $this->actionService = $actionService;
    }

    public function getConditionService(): ConditionService
    {
        return $this->conditionService;
    }

    public function setConditionService(ConditionService $conditionService): void
    {
        $this->conditionService = $conditionService;
    }

    public function getEntityManager(): EntityManagerInterface
    {
        return $this->entityManager;
    }

    public function setEntityManager(EntityManagerInterface $entityManager): void
    {
        $this->entityManager = $entityManager;
    }

    public function getTriggerService(): TriggerService
    {
        return $this->triggerService;
    }

    public function setTriggerService(TriggerService $triggerService): void
    {
        $this->triggerService = $triggerService;
    }
}
