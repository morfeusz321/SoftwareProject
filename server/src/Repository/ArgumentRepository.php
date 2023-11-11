<?php

namespace App\Repository;

use App\Entity\Argument;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Argument>
 *
 * @method Argument|null find($id, $lockMode = null, $lockVersion = null)
 * @method Argument|null findOneBy(array $criteria, array $orderBy = null)
 * @method Argument[]    findAll()
 * @method Argument[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArgumentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Argument::class);
    }

    public function save(Argument $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Argument $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
