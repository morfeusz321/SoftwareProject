<?php

namespace App\Tests\Repository;

use App\Entity\Argument;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;

class ArgumentRepositoryTest extends KernelTestCase
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
        $argument = new Argument();
        $argument->setAlias('alias');
        $argument->setParentId(new UuidV4());
        $argument->setField('field');

        // Call the save method of the repository
        $this->entityManager->getRepository(Argument::class)->save($argument, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($argument, $this->entityManager->getRepository(Argument::class)->findAll());
    }

    public function testRemove(): void
    {
        $argument = new Argument();
        $argument->setAlias('alias');
        $argument->setParentId(new UuidV4());
        $argument->setField('field');

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Argument::class)->save($argument, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Argument::class)->remove($argument, true);

        // Assert that the entity has been removed
        $this->assertNotContains($argument, $this->entityManager->getRepository(Argument::class)->findAll());
    }
}
