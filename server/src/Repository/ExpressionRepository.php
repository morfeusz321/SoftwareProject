<?php

namespace App\Repository;

use App\Entity\Expression;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Expression>
 *
 * @method Expression|null find($id, $lockMode = null, $lockVersion = null)
 * @method Expression|null findOneBy(array $criteria, array $orderBy = null)
 * @method Expression[]    findAll()
 * @method Expression[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ExpressionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Expression::class);
    }

    public function save(Expression $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Expression $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
