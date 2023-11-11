<?php

namespace App\Tests\Controller;

use App\Controller\GraphController;
use App\Service\GraphExecutionService;
use App\Service\GraphService;
use PHPUnit\Framework\TestCase;

class GraphControllerTest extends TestCase
{
    public function testGetGraphService()
    {
        $graphService = $this->createMock(GraphService::class);
        $graphExecutionService = $this->createMock(GraphExecutionService::class);

        $controller = new GraphController($graphService, $graphExecutionService);
        $result = $controller->getGraphService();

        $this->assertSame($graphService, $result);
    }

    public function testSetGraphService()
    {
        $graphService = $this->createMock(GraphService::class);
        $graphExecutionService = $this->createMock(GraphExecutionService::class);

        $controller = new GraphController($graphService, $graphExecutionService);
        $newGraphService = $this->createMock(GraphService::class);
        $controller->setGraphService($newGraphService);

        $result = $controller->getGraphService();
        $this->assertSame($newGraphService, $result);
    }

    public function testGetGraphExecutionService()
    {
        $graphService = $this->createMock(GraphService::class);
        $graphExecutionService = $this->createMock(GraphExecutionService::class);

        $controller = new GraphController($graphService, $graphExecutionService);
        $result = $controller->getGraphExecutionService();

        $this->assertSame($graphExecutionService, $result);
    }

    public function testSetGraphExecutionService()
    {
        $graphService = $this->createMock(GraphService::class);
        $graphExecutionService = $this->createMock(GraphExecutionService::class);

        $controller = new GraphController($graphService, $graphExecutionService);
        $newGraphExecutionService = $this->createMock(GraphExecutionService::class);
        $controller->setGraphExecutionService($newGraphExecutionService);

        $result = $controller->getGraphExecutionService();
        $this->assertSame($newGraphExecutionService, $result);
    }
}
