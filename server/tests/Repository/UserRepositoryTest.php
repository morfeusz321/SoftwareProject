<?php

namespace App\Tests\Repository;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class UserRepositoryTest extends KernelTestCase
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
        $user = $this->getUser();
        // Call the save method of the repository
        $this->entityManager->getRepository(User::class)->save($user, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($user, $this->entityManager->getRepository(User::class)->findAll());
    }

    public function testRemove(): void
    {
        $user = $this->getUser();

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(User::class)->save($user, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(User::class)->remove($user, true);

        // Assert that the entity has been removed
        $this->assertNotContains($user, $this->entityManager->getRepository(User::class)->findAll());
    }

    private function getUser(): User
    {
        $user = new User();

        return $user;
    }
}
