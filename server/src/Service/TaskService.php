<?php

namespace App\Service;

use App\Entity\Node\Trigger;
use App\Entity\Task;
use App\Repository\TaskRepository;

class TaskService
{
    private TaskRepository $taskRepository;

    public function __construct(TaskRepository $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    /**
     * Create a Task entity from a Trigger node.
     *
     * @param Trigger $trigger The Trigger node to create a Task from.
     * @return Task The created Task entity.
     */
    public function createTaskFromTriggerNode(Trigger $trigger): Task
    {
        $task = new Task();
        $task->setGraph($trigger->getGraph());
        $task->setCron($trigger->getSchedule());
        $this->getTaskRepository()->save($task);
        return $task;
    }

    /**
     * Update a Task entity from a Trigger node.
     *
     * @param Trigger $trigger The Trigger node to update a Task from.
     * @return Task The updated Task entity.
     */
    public function updateTaskFromTriggerNode(Trigger $trigger): Task
    {
        $graph = $trigger->getGraph();
        $task = $this->getTaskRepository()->findOneBy([
            'graph' => $graph,
        ]);
        if ($task === null) {
            return $this->createTaskFromTriggerNode($trigger);
        }
        $task->setCron($trigger->getSchedule());
        $this->getTaskRepository()->save($task);
        return $task;
    }

    public function getTaskRepository(): TaskRepository
    {
        return $this->taskRepository;
    }

    public function setTaskRepository(TaskRepository $taskRepository): void
    {
        $this->taskRepository = $taskRepository;
    }
}
