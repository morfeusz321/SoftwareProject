<?php

namespace App\Repository;

use App\Entity\Expression;
use App\Entity\MapExpression;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MapExpression>
 *
 * @method Expression|null find($id, $lockMode = null, $lockVersion = null)
 * @method Expression|null findOneBy(array $criteria, array $orderBy = null)
 * @method Expression[]    findAll()
 * @method Expression[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MapExpressionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MapExpression::class);
    }

    public function save(MapExpression $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MapExpression $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
