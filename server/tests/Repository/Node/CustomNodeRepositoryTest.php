<?php

namespace App\Tests\Repository\Node;

use App\Entity\Node\Action;
use App\Entity\Node\Custom;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;

class CustomNodeRepositoryTest extends KernelTestCase
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
        $customNode = $this->getCustomNode();

        $this->entityManager->getRepository(Custom::class)->save($customNode, true);

        $this->assertContains($customNode, $this->entityManager->getRepository(Custom::class)->findAll());
    }

    public function testDelete(): void
    {
        $customNode = $this->getCustomNode();

        $this->entityManager->getRepository(Custom::class)->save($customNode, true);

        $this->entityManager->getRepository(Custom::class)->remove($customNode, true);

        $this->assertNotContains($customNode, $this->entityManager->getRepository(Custom::class)->findAll());
    }

    private function getCustomNode(): Custom
    {
        $action = $this->getAction();
        $customNode = new Custom();
        $customNode->setId(1);
        $customNode->setAction($action);
        return $customNode;
    }

    private function getAction(): Action
    {
        $action = new Action();
        $action->setId(UuidV4::v4());
        $action->setName('test');
        return $action;
    }
}
