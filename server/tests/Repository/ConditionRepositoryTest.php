<?php

namespace App\Tests\Repository;

use App\Entity\Node\Condition;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;

class ConditionRepositoryTest extends KernelTestCase
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
        $condition = new Condition();
        $condition->setId(UuidV4::v4());
        // Call the save method of the repository
        $this->entityManager->getRepository(Condition::class)->save($condition, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($condition, $this->entityManager->getRepository(Condition::class)->findAll());
    }

    public function testRemove(): void
    {
        $condition = new Condition();
        $condition->setId(UuidV4::v4());

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Condition::class)->save($condition, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Condition::class)->remove($condition, true);

        // Assert that the entity has been removed
        $this->assertNotContains($condition, $this->entityManager->getRepository(Condition::class)->findAll());
    }
}
