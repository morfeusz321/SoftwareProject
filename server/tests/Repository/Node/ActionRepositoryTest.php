<?php

namespace App\Tests\Repository\Node;

use App\Entity\Node\Action;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;

class ActionRepositoryTest extends KernelTestCase
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
        $action = $this->getAction();
        // Call the save method of the repository
        $this->entityManager->getRepository(Action::class)->save($action, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($action, $this->entityManager->getRepository(Action::class)->findAll());
    }

    public function testRemove(): void
    {
        $action = $this->getAction();

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Action::class)->save($action, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Action::class)->remove($action, true);

        // Assert that the entity has been removed
        $this->assertNotContains($action, $this->entityManager->getRepository(action::class)->findAll());
    }

    private function getAction(): Action
    {
        $action = new Action();
        $action->setId(UuidV4::v4());
        return $action;
    }
}
