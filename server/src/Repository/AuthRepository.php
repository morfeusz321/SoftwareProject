<?php

namespace App\Repository;

use App\Entity\Auth;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Auth>
 *
 * @method Auth|null find($id, $lockMode = null, $lockVersion = null)
 * @method Auth|null findOneBy(array $criteria, array $orderBy = null)
 * @method Auth[]    findAll()
 * @method Auth[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AuthRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Auth::class);
    }

    public function save(Auth $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Auth $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
