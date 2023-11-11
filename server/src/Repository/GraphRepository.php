<?php

namespace App\Repository;

use App\Entity\Graph;
use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Graph>
 *
 * @method Graph|null find($id, $lockMode = null, $lockVersion = null)
 * @method Graph|null findOneBy(array $criteria, array $orderBy = null)
 * @method Graph[]    findAll()
 * @method Graph[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GraphRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Graph::class);
    }

    public function save(Graph $entity, bool $flush = false): void
    {
        if (! empty($entity->getUser())) {
            $user = $entity->getUser();
            $entity->setUserId($user->getId());
        }

        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Graph $entity, bool $flush = false): void
    {
        $tasks = $this->getEntityManager()->getRepository(Task::class)->findBy([
            'graph' => $entity,
        ]);
        foreach ($tasks as $task) {
            $this->getEntityManager()->remove($task);
        }
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
