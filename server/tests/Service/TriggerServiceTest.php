<?php

namespace App\Tests\Service;

use App\Entity\Node\Trigger;
use App\Repository\Node\TriggerRepository;
use App\Service\TaskService;
use App\Service\TriggerService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\UuidV4;

class TriggerServiceTest extends TestCase
{
    private SerializerInterface $serializerMock;

    private TriggerRepository $repositoryMock;

    private TaskService $taskServiceMock;

    private TriggerService $triggerService;

    protected function setUp(): void
    {
        $this->serializerMock = $this->createMock(SerializerInterface::class);
        $this->repositoryMock = $this->createMock(TriggerRepository::class);
        $this->taskServiceMock = $this->createMock(TaskService::class);

        $this->triggerService = new TriggerService(
            $this->serializerMock,
            $this->repositoryMock,
            $this->taskServiceMock
        );
    }

    public function testCreateTrigger(): void
    {
        $nodeId = UuidV4::v4();
        $trigger = new Trigger();
        $trigger->setId($nodeId);

        $this->repositoryMock->expects($this->once())
            ->method('find')
            ->with($nodeId)
            ->willReturn($trigger);

        $this->repositoryMock->expects($this->once())
            ->method('save')
            ->with($trigger);

        $result = $this->triggerService->createTrigger($nodeId);

        $this->assertSame($trigger, $result);
    }

    public function testCreateNotFoundTrigger(): void
    {
        $nodeId = UuidV4::v4();
        $this->repositoryMock->expects($this->once())
            ->method('find')
            ->with($nodeId)
            ->willReturn(null);
        $this->repositoryMock->expects($this->once())
            ->method('save');

        $trigger = $this->triggerService->createTrigger($nodeId);

        $this->assertInstanceOf(Trigger::class, $trigger);
        $this->assertTrue($nodeId->equals($trigger->getId()));
    }

    public function testUpdateTrigger(): void
    {
        $content = '{"name": "Test Trigger"}';
        $userId = 123;
        $triggerId = UuidV4::v4();
        $trigger = new Trigger();
        $trigger->setId($triggerId);

        $this->repositoryMock->expects($this->once())
            ->method('find')
            ->with($triggerId)
            ->willReturn($trigger);

        $this->serializerMock->expects($this->once())
            ->method('deserialize')
            ->with(
                $content,
                Trigger::class,
                'json',
                [
                    'groups' => ['graph'],
                    'object_to_populate' => $trigger,
                ]
            )
            ->willReturn($trigger);

        $this->repositoryMock->expects($this->once())
            ->method('save')
            ->with($trigger);

        $this->taskServiceMock->expects($this->once())
            ->method('updateTaskFromTriggerNode')
            ->with($trigger);

        $result = $this->triggerService->updateTrigger($content, $userId, $triggerId);

        $this->assertSame($trigger, $result);
        $this->assertSame($userId, $trigger->getUserId());
    }

    public function testGetSerializer(): void
    {
        $serializer = $this->triggerService->getSerializer();
        $this->assertInstanceOf(SerializerInterface::class, $serializer);
    }

    public function testSetSerializer(): void
    {
        $serializerMock = $this->createMock(SerializerInterface::class);

        $this->triggerService->setSerializer($serializerMock);

        $serializer = $this->triggerService->getSerializer();
        $this->assertInstanceOf(SerializerInterface::class, $serializer);
        $this->assertSame($serializerMock, $serializer);
    }

    public function testGetRepository(): void
    {
        $triggerRepository = $this->triggerService->getRepository();
        $this->assertInstanceOf(TriggerRepository::class, $triggerRepository);
    }

    public function testSetRepository(): void
    {
        $triggerRepositoryMock = $this->createMock(TriggerRepository::class);

        $this->triggerService->setRepository($triggerRepositoryMock);

        $triggerRepository = $this->triggerService->getRepository();
        $this->assertInstanceOf(TriggerRepository::class, $triggerRepository);
        $this->assertSame($triggerRepositoryMock, $triggerRepository);
    }

    public function testGetTaskService(): void
    {
        $taskService = $this->triggerService->getTaskService();
        $this->assertInstanceOf(TaskService::class, $taskService);
    }

    public function testSetTaskService(): void
    {
        $taskServiceMock = $this->createMock(TaskService::class);

        $this->triggerService->setTaskService($taskServiceMock);

        $taskService = $this->triggerService->getTaskService();
        $this->assertInstanceOf(TaskService::class, $taskService);
        $this->assertSame($taskServiceMock, $taskService);
    }
}
