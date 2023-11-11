<?php

namespace App\Tests\Service;

use App\Entity\Node\Action;
use App\Entity\Node\Condition;
use App\Entity\Node\Invite;
use App\Entity\Node\Trigger;
use App\Repository\ConditionRepository;
use App\Service\ActionService;
use App\Service\ConditionService;
use App\Service\InviteService;
use App\Service\NodeService;
use App\Service\TriggerService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use function PHPUnit\Framework\assertContains;

class NodeServiceTest extends TestCase
{
    private NodeService $nodeService;

    private ActionService $actionService;

    private ConditionService $conditionService;

    private TriggerService $triggerService;

    private InviteService $inviteService;

    private EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        $this->actionService = $this->createMock(ActionService::class);
        $this->conditionService = $this->createMock(ConditionService::class);
        $this->triggerService = $this->createMock(TriggerService::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->inviteService = $this->createMock(InviteService::class);
        $this->nodeService = new NodeService($this->actionService, $this->conditionService, $this->entityManager, $this->triggerService, $this->inviteService);
    }

    public function testCreateNodeCondition()
    {
        $node = $this->createMock(Condition::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Condition::CONDITION_NODE_TYPE_IF,
        ];
        $this->conditionService->expects($this->exactly(1))
            ->method('createCondition')
            ->with($nodeData['id'])
            ->willReturn($node);
        $nodeCreateWithMethod = $this->nodeService->createNode($nodeData);
        self::assertInstanceOf(Condition::class, $nodeCreateWithMethod);
    }

    public function testCreateNodeTrigger()
    {
        $node = $this->createMock(Trigger::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Trigger::TRIGGER_NODE_TYPE_TRIGGER,
        ];
        $this->triggerService->expects($this->exactly(1))
            ->method('createTrigger')
            ->with($nodeData['id'])
            ->willReturn($node);
        $nodeCreateWithMethod = $this->nodeService->createNode($nodeData);
        self::assertInstanceOf(Trigger::class, $nodeCreateWithMethod);
    }

    public function testCreateNodeInvite()
    {
        $node = $this->createMock(Invite::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Action::ACTION_NODE_TYPE_INVITE,
        ];
        $this->inviteService->expects($this->exactly(1))
            ->method('createInvite')
            ->with($nodeData['id'])
            ->willReturn($node);
        $nodeCreateWithMethod = $this->nodeService->createNode($nodeData);
        self::assertInstanceOf(Invite::class, $nodeCreateWithMethod);
    }

    public function testCreateNodeAction()
    {
        $node = $this->createMock(Action::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Action::ACTION_NODE_TYPE_GET,
        ];
        $this->actionService->expects($this->exactly(1))
            ->method('createAction')
            ->with($nodeData['id'])
            ->willReturn($node);
        $nodeCreateWithMethod = $this->nodeService->createNode($nodeData);
        self::assertInstanceOf(Action::class, $nodeCreateWithMethod);
    }

    public function testUpdateNodeAction()
    {
        $node = $this->createMock(Action::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Action::ACTION_NODE_TYPE_GET,
        ];
        $this->actionService->expects($this->exactly(1))
            ->method('updateAction')
            ->willReturn($node);
        $nodeCreateWithMethod = $this->nodeService->updateNode($nodeData, $userId);
        self::assertInstanceOf(Action::class, $nodeCreateWithMethod);
    }

    public function testUpdateNodeInvite()
    {
        $node = $this->createMock(Invite::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Action::ACTION_NODE_TYPE_INVITE,
        ];
        $this->inviteService->expects($this->exactly(1))
            ->method('updateInvite')
            ->willReturn($node);
        $nodeCreateWithMethod = $this->nodeService->updateNode($nodeData, $userId);
        self::assertInstanceOf(Invite::class, $nodeCreateWithMethod);
    }

    public function testUpdateNodeTrigger()
    {
        $node = $this->createMock(Trigger::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Trigger::TRIGGER_NODE_TYPE_TRIGGER,
        ];
        $this->triggerService->expects($this->exactly(1))
            ->method('updateTrigger')
            ->willReturn($node);
        $nodeCreateWithMethod = $this->nodeService->updateNode($nodeData, $userId);
        self::assertInstanceOf(Trigger::class, $nodeCreateWithMethod);
    }

    public function testUpdateNodeCondition()
    {
        $node = $this->createMock(Condition::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Condition::CONDITION_NODE_TYPE_IF,
        ];
        $this->conditionService->expects($this->exactly(1))
            ->method('updateCondition')
            ->willReturn($node);
        $nodeCreateWithMethod = $this->nodeService->updateNode($nodeData, $userId);
        self::assertInstanceOf(Condition::class, $nodeCreateWithMethod);
    }

    public function testUpdateWithNeighbours()
    {
        $node = new Condition();
        $neighbour = new Action();
        $mockConditionRepository = $this->createMock(ConditionRepository::class);
        $userId = 1;
        $nodeData = [
            'id' => 'someId',
            'type' => Condition::CONDITION_NODE_TYPE_IF,
            'neighbours' => ['neighbourId'],
        ];
        $this->conditionService->expects($this->exactly(1))
            ->method('updateCondition')
            ->willReturn($node);
        $this->entityManager->expects($this->exactly(1))
            ->method('getRepository')
            ->willReturn($mockConditionRepository);
        $mockConditionRepository->expects($this->exactly(1))
            ->method('find')
            ->willReturn($neighbour);
        $nodeCreateWithMethod = $this->nodeService->updateNode($nodeData, $userId);
        self::assertInstanceOf(Condition::class, $nodeCreateWithMethod);
        assertContains($neighbour, $nodeCreateWithMethod->getNeighbours());
    }

    public function testGetActionService()
    {
        $actionService = $this->nodeService->getActionService();
        self::assertInstanceOf(ActionService::class, $actionService);
    }

    public function testSetActionService()
    {
        $actionService = $this->createMock(ActionService::class);
        $this->nodeService->setActionService($actionService);
        $actionServiceResult = $this->nodeService->getActionService();
        self::assertSame($actionService, $actionServiceResult);
    }

    public function testGetConditionService()
    {
        $conditionService = $this->nodeService->getConditionService();
        self::assertInstanceOf(ConditionService::class, $conditionService);
    }

    public function testSetConditionService()
    {
        $conditionService = $this->createMock(ConditionService::class);
        $this->nodeService->setConditionService($conditionService);
        $conditionServiceResult = $this->nodeService->getConditionService();
        self::assertSame($conditionService, $conditionServiceResult);
    }

    public function testGetEntityManager()
    {
        $entityManager = $this->nodeService->getEntityManager();
        self::assertInstanceOf(EntityManagerInterface::class, $entityManager);
    }

    public function testSetEntityManager()
    {
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $this->nodeService->setEntityManager($entityManager);
        $entityManagerResult = $this->nodeService->getEntityManager();
        self::assertSame($entityManager, $entityManagerResult);
    }

    public function testGetTriggerService()
    {
        $triggerService = $this->nodeService->getTriggerService();
        self::assertInstanceOf(TriggerService::class, $triggerService);
    }

    public function testSetTriggerService()
    {
        $triggerService = $this->createMock(TriggerService::class);
        $this->nodeService->setTriggerService($triggerService);
        $triggerServiceResult = $this->nodeService->getTriggerService();
        self::assertSame($triggerService, $triggerServiceResult);
    }
}
