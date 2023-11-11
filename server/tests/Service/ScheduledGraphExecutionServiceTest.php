<?php

namespace App\Tests\Service;

use App\Entity\Graph;
use App\Entity\Task;
use App\Repository\TaskRepository;
use App\Service\GraphExecutionService;
use App\Service\ScheduledGraphExecutionService;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class ScheduledGraphExecutionServiceTest extends TestCase
{
    private $entityManager;

    private $executionService;

    private $taskRepository;

    private $scheduledExecutionService;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->executionService = $this->createMock(GraphExecutionService::class);
        $this->taskRepository = $this->createMock(TaskRepository::class);
        $this->scheduledExecutionService = new ScheduledGraphExecutionService(
            $this->entityManager,
            $this->executionService,
            $this->taskRepository
        );
    }

    public function testGetTasksThatHaveToBeExecuted()
    {
        // Create a mock EntityManagerInterface
        $entityManagerMock = $this->createMock(EntityManagerInterface::class);

        // Create a mock TaskRepository and configure it to return test data
        $taskRepositoryMock = $this->createMock(TaskRepository::class);
        $entityManagerMock->method('getRepository')
            ->willReturn($taskRepositoryMock);
        $taskRepositoryMock->method('findAll')
            ->willReturn($this->createTestTasks());

        // Create a mock GraphExecutionService
        $graphExecutionServiceMock = $this->createMock(GraphExecutionService::class);

        // Create an instance of ScheduledGraphExecutionService with the mock dependencies
        $scheduledGraphExecutionService = new ScheduledGraphExecutionService($entityManagerMock, $graphExecutionServiceMock);

        // Call the method to be tested
        $tasks = $scheduledGraphExecutionService->getTasksThatHaveToBeExecuted();

        // Assertions
        $this->assertCount(1, $tasks);
        $this->assertInstanceOf(Task::class, $tasks[0]);
    }

    private function createTestTasks(): array
    {
        // Create a test Task object that is due
        $dueTask = new Task();
        $dueTask->setCron('* * * * *'); // Run every minute
        $dueTask->setGraph(new Graph());
        $dueTask->getGraph()->setIsActive(true);

        // Create a test Task object that is not due
        $notDueTask = new Task();
        $notDueTask->setCron('0 0 * * *'); // Run once a day
        $notDueTask->setGraph(new Graph());
        $notDueTask->getGraph()->setIsActive(true);

        return [$dueTask, $notDueTask];
    }

    public function testIsCronDue()
    {
        $cronExpression = '20 * * * *'; // Run at the 20th minute of every hour
        $dateTimeDue = new DateTime('2023-05-30 01:20:00'); // Matches the cron expression
        $dateTimeNotDue = new DateTime('2023-05-30 01:30:00'); // Does not match the cron expression

        $this->assertTrue($this->scheduledExecutionService->isCronDue($cronExpression, $dateTimeDue));
        $this->assertFalse($this->scheduledExecutionService->isCronDue($cronExpression, $dateTimeNotDue));
    }

    public function testGetExecutionService()
    {
        $executionService = $this->scheduledExecutionService->getExecutionService();
        $this->assertInstanceOf(GraphExecutionService::class, $executionService);
    }

    public function testSetExecutionService()
    {
        $executionService = $this->createMock(GraphExecutionService::class);
        $this->scheduledExecutionService->setExecutionService($executionService);

        $newExecutionService = $this->scheduledExecutionService->getExecutionService();
        $this->assertSame($executionService, $newExecutionService);
    }
}
