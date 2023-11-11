<?php

namespace App\Tests\Repository;

use App\Entity\Position;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class PositionRepositoryTest extends KernelTestCase
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
        $position = $this->getPosition();
        // Call the save method of the repository
        $this->entityManager->getRepository(Position::class)->save($position, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($position, $this->entityManager->getRepository(Position::class)->findAll());
        $this->assertNotNull($position->getId());
    }

    public function testRemove(): void
    {
        $position = $this->getPosition();

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Position::class)->save($position, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Position::class)->remove($position, true);

        // Assert that the entity has been removed
        $this->assertNotContains($position, $this->entityManager->getRepository(Position::class)->findAll());
    }

    private function getPosition(): Position
    {
        $position = new Position();
        $position->setPositionX(0);
        $position->setPositionY(0);
        $position->setPositionZ(0);
        return $position;
    }
}
