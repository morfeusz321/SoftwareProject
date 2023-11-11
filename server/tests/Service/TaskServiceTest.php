<?php

namespace App\Tests\Service;

use App\Entity\Graph;
use App\Entity\Node\Trigger;
use App\Entity\Task;
use App\Repository\TaskRepository;
use App\Service\TaskService;
use PHPUnit\Framework\TestCase;

class TaskServiceTest extends TestCase
{
    private TaskService $taskService;

    private TaskRepository $taskRepositoryMock;

    protected function setUp(): void
    {
        $this->taskRepositoryMock = $this->createMock(TaskRepository::class);
        $this->taskService = new TaskService($this->taskRepositoryMock);
    }

    public function testCreateTaskFromTriggerNode(): void
    {
        $trigger = new Trigger();
        $trigger->setGraph(new Graph());
        $trigger->setSchedule('0 * * * *');

        // Mock TaskRepository
        $this->taskRepositoryMock->expects($this->once())
            ->method('save')
            ->willReturnCallback(function ($task) use ($trigger) {
                $this->assertInstanceOf(Task::class, $task);
                $this->assertEquals($trigger->getGraph(), $task->getGraph());
                $this->assertEquals($trigger->getSchedule(), $task->getCron());
            });

        $task = $this->taskService->createTaskFromTriggerNode($trigger);

        $this->assertInstanceOf(Task::class, $task);
    }

    public function testUpdateTaskFromTriggerNodeExistingTask(): void
    {
        $trigger = new Trigger();
        $trigger->setGraph(new Graph());
        $trigger->setSchedule('0 * * * *');

        $existingTask = new Task();
        $existingTask->setGraph(new Graph());
        $existingTask->setCron('old_schedule');

        // Mock TaskRepository
        $this->taskRepositoryMock->expects($this->once())
            ->method('findOneBy')
            ->with([
                'graph' => $trigger->getGraph(),
            ])
            ->willReturn($existingTask);

        $this->taskRepositoryMock->expects($this->once())
            ->method('save')
            ->willReturnCallback(function ($task) use ($trigger) {
                $this->assertInstanceOf(Task::class, $task);
                $this->assertEquals($trigger->getGraph(), $task->getGraph());
                $this->assertEquals($trigger->getSchedule(), $task->getCron());
            });

        $task = $this->taskService->updateTaskFromTriggerNode($trigger);

        $this->assertInstanceOf(Task::class, $task);
    }

    public function testUpdateTaskFromTriggerNodeNewTask(): void
    {
        $trigger = new Trigger();
        $trigger->setGraph(new Graph());
        $trigger->setSchedule('0 * * * *');

        // Mock TaskRepository
        $this->taskRepositoryMock->expects($this->once())
            ->method('findOneBy')
            ->with([
                'graph' => $trigger->getGraph(),
            ])
            ->willReturn(null);

        $this->taskRepositoryMock->expects($this->once())
            ->method('save')
            ->willReturnCallback(function ($task) use ($trigger) {
                $this->assertInstanceOf(Task::class, $task);
                $this->assertEquals($trigger->getGraph(), $task->getGraph());
                $this->assertEquals($trigger->getSchedule(), $task->getCron());
            });

        $task = $this->taskService->updateTaskFromTriggerNode($trigger);

        $this->assertInstanceOf(Task::class, $task);
    }

    public function testSetTaskRepository(): void
    {
        $taskRepositoryMock = $this->createMock(TaskRepository::class);

        $this->taskService->setTaskRepository($taskRepositoryMock);

        $taskRepository = $this->taskService->getTaskRepository();
        $this->assertInstanceOf(TaskRepository::class, $taskRepository);
        $this->assertSame($taskRepositoryMock, $taskRepository);
    }

    public function testGetTaskRepository(): void
    {
        $taskRepository = $this->taskService->getTaskRepository();
        $this->assertInstanceOf(TaskRepository::class, $taskRepository);
    }
}
