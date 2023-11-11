<?php

namespace App\Tests\Repository;

use App\Entity\Request;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

class RequestRepositoryTest extends KernelTestCase
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
        $request = $this->getrequest();
        // Call the save method of the repository
        $this->entityManager->getRepository(Request::class)->save($request, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($request, $this->entityManager->getRepository(Request::class)->findAll());
        $this->assertNotNull($request->getId());
    }

    public function testRemove(): void
    {
        $request = $this->getRequest();

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Request::class)->save($request, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Request::class)->remove($request, true);

        // Assert that the entity has been removed
        $this->assertNotContains($request, $this->entityManager->getRepository(Request::class)->findAll());
    }

    private function getRequest(): Request
    {
        $request = new request();
        $request->setUrl('');
        $request->setMethod(SymfonyRequest::METHOD_GET);
        return $request;
    }
}
