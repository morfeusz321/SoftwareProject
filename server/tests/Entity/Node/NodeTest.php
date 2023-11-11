<?php

namespace App\Tests\Entity\Node;

namespace App\Tests\Entity\Node;

use App\Entity\Graph;
use App\Entity\Node\Node;
use App\Entity\Position;
use App\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Uid\UuidV4;

class NodeTest extends TestCase
{
    public function testGetAndSetId()
    {
        $node = new Node();
        $id = UuidV4::v4();

        $node->setId($id);

        $this->assertSame($id, $node->getId());
    }

    public function testGetAndSetNeighbours()
    {
        $node = new Node();
        $neighbour1 = new Node();
        $neighbour2 = new Node();
        $collection = new ArrayCollection([$neighbour1, $neighbour2]);

        $node->setNeighbours($collection);

        $this->assertSame($collection, $node->getNeighbours());
    }

    public function testAddAndRemoveNeighbour()
    {
        $node = new Node();
        $neighbour = new Node();

        $node->addNeighbour($neighbour);
        $this->assertTrue($node->getNeighbours()->contains($neighbour));

        $node->removeNeighbour($neighbour);
        $this->assertFalse($node->getNeighbours()->contains($neighbour));
    }

    public function testGetAndSetUser()
    {
        $node = new Node();
        $user = new User();

        $node->setUser($user);

        $this->assertSame($user, $node->getUser());
    }

    public function testGetAndSetGraph()
    {
        $node = new Node();
        $graph = new Graph();

        $node->setGraph($graph);

        $this->assertSame($graph, $node->getGraph());
    }

    public function testGetType()
    {
        $node = new Node();
        $type = 'node';

        $node->setType($type);

        $this->assertSame($type, $node->getType());
    }

    public function testGetAndSetUserId()
    {
        $node = new Node();
        $userId = 123;

        $node->setUserId($userId);

        $this->assertSame($userId, $node->getUserId());
    }

    public function testGetAndSetPosition()
    {
        $node = new Node();
        $position = new Position();

        $node->setPosition($position);

        $this->assertSame($position, $node->getPosition());
    }
}
