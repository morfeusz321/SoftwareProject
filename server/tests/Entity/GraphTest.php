<?php

namespace App\Tests\Entity;

namespace App\Tests\Entity;

use App\Entity\Graph;
use App\Entity\Node\Node;
use App\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;

class GraphTest extends TestCase
{
    public function testSetId()
    {
        $graph = new Graph();
        $id = 1;

        $graph->setId($id);

        $this->assertEquals($id, $graph->getId());
    }

    public function testSetName()
    {
        $graph = new Graph();
        $name = 'Test Graph';

        $graph->setName($name);

        $this->assertEquals($name, $graph->getName());
    }

    public function testSetUser()
    {
        $graph = new Graph();
        $user = new User();

        $graph->setUser($user);

        $this->assertEquals($user, $graph->getUser());
    }

    public function testSetUserId()
    {
        $graph = new Graph();
        $userId = 1;

        $graph->setUserId($userId);

        $this->assertEquals($userId, $graph->getUserId());
    }

    public function testGetNodes()
    {
        $graph = new Graph();
        $node1 = new Node();
        $node2 = new Node();

        $graph->addNode($node1);
        $graph->addNode($node2);

        $nodes = $graph->getNodes();

        $this->assertInstanceOf(ArrayCollection::class, $nodes);
        $this->assertTrue($nodes->contains($node1));
        $this->assertTrue($nodes->contains($node2));
    }

    public function testSetNodes()
    {
        $graph = new Graph();
        $nodes = new ArrayCollection([new Node(), new Node()]);

        $graph->setNodes($nodes);

        $this->assertEquals($nodes, $graph->getNodes());
    }

    public function testAddNode()
    {
        $graph = new Graph();
        $node = new Node();

        $graph->addNode($node);

        $this->assertTrue($graph->getNodes()->contains($node));
        $this->assertEquals($graph, $node->getGraph());
    }

    public function testRemoveNode()
    {
        $graph = new Graph();
        $node = new Node();

        $graph->addNode($node);
        $graph->removeNode($node);

        $this->assertFalse($graph->getNodes()->contains($node));
        $this->assertNull($node->getGraph());
    }

    public function testSetIsActive()
    {
        $graph = new Graph();
        $isActive = true;

        $graph->setIsActive($isActive);

        $this->assertEquals($isActive, $graph->isIsActive());
    }

    public function testSetIsDraft()
    {
        $graph = new Graph();
        $isDraft = true;

        $graph->setIsDraft($isDraft);

        $this->assertEquals($isDraft, $graph->isIsDraft());
    }

    public function testGetLogs()
    {
        $graph = new Graph();
        $logs = ['Log 1', 'Log 2'];

        $graph->setLogs($logs);

        $this->assertEquals($logs, $graph->getLogs());
    }

    public function testAddLogs()
    {
        $graph = new Graph();
        $message = 'Log message';

        $graph->addLogs($message);

        $this->assertContains($message, $graph->getLogs());
    }
}
