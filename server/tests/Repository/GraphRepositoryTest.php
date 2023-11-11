<?php

namespace App\Tests\Repository;

use App\Entity\Graph;
use App\Entity\Task;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class GraphRepositoryTest extends KernelTestCase
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
        $graph = $this->getGraph();
        // Call the save method of the repository
        $this->entityManager->getRepository(Graph::class)->save($graph, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($graph, $this->entityManager->getRepository(Graph::class)->findAll());
    }

    public function testRemove(): void
    {
        $graph = $this->getGraph();
        $task = $this->getTask($graph);

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Graph::class)->save($graph, true);
        $this->entityManager->getRepository(Task::class)->save($task, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Graph::class)->remove($graph, true);

        // Assert that the entity has been removed
        $this->assertNotContains($graph, $this->entityManager->getRepository(graph::class)->findAll());
        $this->assertNotContains($task, $this->entityManager->getRepository(Task::class)->findAll());
    }

    private function getGraph(): Graph
    {
        $graph = new Graph();
        $graph->setName("name");
        $graph->setIsActive(true);
        $graph->setIsDraft(false);
        return $graph;
    }

    private function getTask(Graph $graph): Task
    {
        $task = new Task();
        $task->setGraphId(1);
        $task->setCron('cron');
        $task->setGraph($graph);
        return $task;
    }
}
