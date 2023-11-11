<?php

namespace App\Tests\Repository;

use App\Entity\Auth;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class AuthRepositoryTest extends KernelTestCase
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
        $auth = new Auth();
        $auth->setToken('');
        $auth->setType(AUTH::NONE);
        // Call the save method of the repository
        $this->entityManager->getRepository(Auth::class)->save($auth, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($auth, $this->entityManager->getRepository(Auth::class)->findAll());
    }

    public function testRemove(): void
    {
        $auth = new Auth();
        $auth->setToken('');
        $auth->setType(Auth::NONE);

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Auth::class)->save($auth, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Auth::class)->remove($auth, true);

        // Assert that the entity has been removed
        $this->assertNotContains($auth, $this->entityManager->getRepository(Auth::class)->findAll());
    }
}
