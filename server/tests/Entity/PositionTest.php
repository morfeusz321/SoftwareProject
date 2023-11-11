<?php

namespace App\Tests\Entity;

namespace App\Tests\Entity;

use App\Entity\Position;
use PHPUnit\Framework\TestCase;

class PositionTest extends TestCase
{
    public function testGetAndSetPositionX()
    {
        $position = new Position();
        $positionX = 10;

        $position->setPositionX($positionX);

        $this->assertSame($positionX, $position->getPositionX());
    }

    public function testGetAndSetPositionY()
    {
        $position = new Position();
        $positionY = 20;

        $position->setPositionY($positionY);

        $this->assertSame($positionY, $position->getPositionY());
    }

    public function testGetAndSetPositionZ()
    {
        $position = new Position();
        $positionZ = 30;

        $position->setPositionZ($positionZ);

        $this->assertSame($positionZ, $position->getPositionZ());
    }
}
