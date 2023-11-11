<?php

namespace App\Tests\Repository;

use App\Entity\Expression;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;

class ExpressionRepositoryTest extends KernelTestCase
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
        $expression = $this->getExpression();
        // Call the save method of the repository
        $this->entityManager->getRepository(Expression::class)->save($expression, true);

        // Assert that the entity has been persisted and flushed
        $this->assertContains($expression, $this->entityManager->getRepository(Expression::class)->findAll());
        self::assertNotNull($expression->getId());
    }

    public function testRemove(): void
    {
        $expression = $this->getExpression();

        // Call the save method of the repository to persist the entity
        $this->entityManager->getRepository(Expression::class)->save($expression, true);

        // Call the remove method of the repository
        $this->entityManager->getRepository(Expression::class)->remove($expression, true);

        // Assert that the entity has been removed
        $this->assertNotContains($expression, $this->entityManager->getRepository(Expression::class)->findAll());
    }

    private function getExpression(): Expression
    {
        $expression = new Expression();
        $expression->setType(Expression::GREATER_OR_EQUAL);
        $expression->setCompareTo(Expression::USER_VALUE);
        $expression->setFirstFieldValue('one');
        $expression->setFirstFieldNodeId(UuidV4::v4());
        $expression->setSecondFieldUserValue('12');
        return $expression;
    }
}
