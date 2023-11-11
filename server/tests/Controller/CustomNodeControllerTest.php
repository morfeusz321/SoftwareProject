<?php

namespace App\Tests\Controller;

use App\Controller\CustomNodeController;
use App\Service\CustomNodeService;
use PHPUnit\Framework\TestCase;

class CustomNodeControllerTest extends TestCase
{
    public function testCustomNodeServiceGetterAndSetter()
    {
        $customNodeServiceMock = $this->createMock(CustomNodeService::class);
        $controller = new CustomNodeController($customNodeServiceMock);

        // Test the getter
        $this->assertSame($customNodeServiceMock, $controller->getCustomNodesService());

        // Create a new mock object
        $newCustomNodeServiceMock = $this->createMock(CustomNodeService::class);

        // Test the setter
        $controller->setCustomNodesService($newCustomNodeServiceMock);
        $this->assertSame($newCustomNodeServiceMock, $controller->getCustomNodesService());
    }
}
