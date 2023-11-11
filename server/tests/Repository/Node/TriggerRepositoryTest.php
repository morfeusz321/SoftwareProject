<?php

namespace App\Tests\Repository\Node;

use App\Entity\Node\Trigger;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;

class TriggerRepositoryTest extends KernelTestCase
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
        $trigger = $this->getTrigger();
        // Call the save method of the repository
        $this->entityManager->getRepository(Trigger::class)->save($trigger, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($trigger, $this->entityManager->getRepository(Trigger::class)->findAll());
    }

    public function testRemove(): void
    {
        $trigger = $this->getTrigger();

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Trigger::class)->save($trigger, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Trigger::class)->remove($trigger, true);

        // Assert that the entity has been removed
        $this->assertNotContains($trigger, $this->entityManager->getRepository(Trigger::class)->findAll());
    }

    private function getTrigger(): Trigger
    {
        $trigger = new Trigger();
        $trigger->setId(UuidV4::v4());
        return $trigger;
    }
}
