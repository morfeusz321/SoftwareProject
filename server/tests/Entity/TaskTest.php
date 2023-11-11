<?php

namespace App\Tests\Entity;

namespace App\Tests\Entity;

use App\Entity\Graph;
use App\Entity\Task;
use PHPUnit\Framework\TestCase;

class TaskTest extends TestCase
{
    public function testGetAndSetGraph()
    {
        $task = new Task();
        $graph = new Graph();

        $task->setGraph($graph);

        $this->assertSame($graph, $task->getGraph());
    }

    public function testGetAndSetCron()
    {
        $task = new Task();
        $cron = '* * * * *';

        $task->setCron($cron);

        $this->assertSame($cron, $task->getCron());
    }

    public function testGetAndSetGraphId()
    {
        $task = new Task();
        $graphId = 1;

        $task->setGraphId($graphId);

        $this->assertSame($graphId, $task->getGraphId());
    }
}
