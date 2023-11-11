<?php

namespace App\Service;

use App\Entity\Task;
use Cron\CronExpression;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;

class ScheduledGraphExecutionService
{
    private EntityManagerInterface $entityManager;

    private GraphExecutionService $executionService;

    /**
     * ScheduledGraphExecutionService constructor.
     *
     * @param EntityManagerInterface $entityManager   The entity manager interface.
     * @param GraphExecutionService  $executionService The graph execution service.
     */
    public function __construct(EntityManagerInterface $entityManager, GraphExecutionService $executionService)
    {
        $this->entityManager = $entityManager;
        $this->executionService = $executionService;
    }

    /**
     * Executes the due tasks.
     *
     * This method retrieves all tasks from the entity repository, checks if each task's cron expression is due at the
     * current datetime, and if the associated graph is active. If both conditions are met, the graph execution service
     * is used to execute the graph flow, and the task is saved.
     */
    public function getTasksThatHaveToBeExecuted(): array
    {
        $tasks = $this->entityManager->getRepository(Task::class)->findAll();
        $tasksThatNeedToBeExecuted = [];
        $datetime = new DateTime();
        foreach ($tasks as $task) {
            $cronExpression = $task->getCron();
            if ($this->isCronDue($cronExpression, $datetime) && $task->getGraph()->isIsActive()) {
                $tasksThatNeedToBeExecuted[] = $task;
            }
        }
        return $tasksThatNeedToBeExecuted;
    }

    /**
     * Checks if the given cron expression is due at the specified dateTime.
     *
     * This method implements the logic to check if the cron expression is due at the given dateTime. It uses the
     * cron-expression library internally.
     *
     * @param string   $cronExpression The cron expression to check.
     * @param DateTime $dateTime       The DateTime object representing the date and time to check against.
     *
     * @return bool True if the cron expression is due at the given dateTime, false otherwise.
     */
    public function isCronDue(string $cronExpression, DateTime $dateTime): bool
    {
        $cron = new CronExpression($cronExpression);
        return $cron->isDue($dateTime);
    }

    public function getExecutionService(): GraphExecutionService
    {
        return $this->executionService;
    }

    public function setExecutionService(GraphExecutionService $executionService): void
    {
        $this->executionService = $executionService;
    }
}
