<?php

namespace App\Tests\Controller;

use App\Controller\NodeController;
use App\Service\GraphExecutionService;
use App\Service\NodeService;
use PHPUnit\Framework\TestCase;

class NodeControllerTest extends TestCase
{
    public function testNodeServiceGetterAndSetter()
    {
        $nodeServiceMock = $this->createMock(NodeService::class);
        $graphExecutionServiceMock = $this->createMock(GraphExecutionService::class);
        $controller = new NodeController($nodeServiceMock, $graphExecutionServiceMock);

        // Test the getter
        $this->assertSame($nodeServiceMock, $controller->getNodeService());

        // Create a new mock object
        $newNodeServiceMock = $this->createMock(NodeService::class);

        // Test the setter
        $controller->setNodeService($newNodeServiceMock);
        $this->assertSame($newNodeServiceMock, $controller->getNodeService());
    }

    public function testGraphExecutionServiceGetterAndSetter()
    {
        $nodeServiceMock = $this->createMock(NodeService::class);
        $graphExecutionServiceMock = $this->createMock(GraphExecutionService::class);
        $controller = new NodeController($nodeServiceMock, $graphExecutionServiceMock);

        // Test the getter
        $this->assertSame($graphExecutionServiceMock, $controller->getGraphExecutionService());

        // Create a new mock object
        $newGraphExecutionServiceMock = $this->createMock(GraphExecutionService::class);

        // Test the setter
        $controller->setGraphExecutionService($newGraphExecutionServiceMock);
        $this->assertSame($newGraphExecutionServiceMock, $controller->getGraphExecutionService());
    }
}
