<?php

namespace App\Repository\Node;

use App\Entity\Node\Trigger;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Trigger>
 *
 * @method Trigger|null find($id, $lockMode = null, $lockVersion = null)
 * @method Trigger|null findOneBy(array $criteria, array $orderBy = null)
 * @method Trigger[]    findAll()
 * @method Trigger[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TriggerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Trigger::class);
    }

    public function save(Trigger $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Trigger $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
