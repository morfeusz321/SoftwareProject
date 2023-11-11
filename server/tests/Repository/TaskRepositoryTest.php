<?php

namespace App\Tests\Repository;

use App\Entity\Graph;
use App\Entity\Task;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TaskRepositoryTest extends KernelTestCase
{
    private EntityManager $entityManager;

    protected function setUp(): void
    {
        self::bootKernel();

        // Get the EntityManager from the container
        $kernel = self::bootKernel();

        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
    }

    public function testSave(): void
    {
        $task = $this->getTask();
        // Call the save method of the repository
        $this->entityManager->getRepository(Task::class)->save($task, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($task, $this->entityManager->getRepository(Task::class)->findAll());
        $this->assertNotNull($task->getId());
    }

    public function testRemove(): void
    {
        $task = $this->getTask();

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Task::class)->save($task, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Task::class)->remove($task, true);

        // Assert that the entity has been removed
        $this->assertNotContains($task, $this->entityManager->getRepository(Task::class)->findAll());
    }

    private function getTask(): Task
    {
        $task = new Task();
        $task->setGraphId(1);
        $task->setCron('cron');
        $graph = $this->getGraph();
        $this->entityManager->getRepository(Graph::class)->save($graph, flush: true);
        $task->setGraph($graph);
        return $task;
    }

    private function getGraph(): Graph
    {
        $graph = new Graph();
        $graph->setName("name");
        $graph->setIsActive(true);
        $graph->setIsDraft(false);
        return $graph;
    }
}
