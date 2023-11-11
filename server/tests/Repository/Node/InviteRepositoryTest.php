<?php

namespace App\Tests\Repository\Node;

use App\Entity\Argument;
use App\Entity\Node\Action;
use App\Entity\Node\Invite;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;
use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertTrue;

class InviteRepositoryTest extends KernelTestCase
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
        $action = $this->getInvite();
        // Call the save method of the repository
        $this->entityManager->getRepository(Invite::class)->save($action, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($action, $this->entityManager->getRepository(Action::class)->findAll());
        $savedNode = $this->entityManager->getRepository(Invite::class)->find($action->getId());
        assertTrue($action->getId()->equals($savedNode->getId()));
        assertEquals($action->getEmail()->getField(), $savedNode->getEmail()->getField());
        assertEquals($action->getEmail()->getAlias(), $savedNode->getEmail()->getAlias());
        assertTrue($action->getId()->equals($savedNode->getEmail()->getAction()->getId()));
    }

//    public function testRemove(): void
//    {
//        $action = $this->getInvite();
//
//        // Call the save method of the repository to persist the entity
//        $this->entityManager->getRepository(Invite::class)->save($action, true);
//        $actionId = $action->getId();
//        $emailArgumentId = $action->getEmail()->getId();
//        // Call the remove method of the repository
//        $this->entityManager->getRepository(Invite::class)->remove($action, true);
//
//        // Assert that the entity has been removed
//        $this->assertNull($this->entityManager->getRepository(Invite::class)->find($actionId));
//        $this->assertNull($this->entityManager->getRepository(Argument::class)->find($emailArgumentId));
//    }


    private function getInvite(): Invite
    {
        $action = new Invite();
        $actionId = UuidV4::v4();
        $action->setId($actionId);
        $emailArgument = $this->getEmailArgument($actionId);
        $emailArgument->setAction($action);
        $action->setEmail($emailArgument);
        $emailArgument->setAction($action);
        return $action;
    }

    private function getEmailArgument(UuidV4 $parentId)
    {
        $argument = new Argument();
        $argument->setAlias('email');
        $argument->setParentId($parentId);
        $argument->setField('random@email.com');
        return $argument;
    }
}
