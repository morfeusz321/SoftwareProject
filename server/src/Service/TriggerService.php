<?php

namespace App\Service;

use App\Entity\Node\Trigger;
use App\Repository\Node\TriggerRepository;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\UuidV4;

class TriggerService
{
    private SerializerInterface $serializer;

    private TriggerRepository $repository;

    private TaskService $taskService;

    public function __construct(SerializerInterface $serializer, TriggerRepository $repository, TaskService $taskService)
    {
        $this->serializer = $serializer;
        $this->repository = $repository;
        $this->taskService = $taskService;
    }

    /**
     * creates a trigger
     * @param mixed $nodeId - the id of the trigger
     * @return Trigger|null - the created trigger
     */
    public function createTrigger(mixed $nodeId): ?Trigger
    {
        $trigger = $this->getRepository()->find($nodeId);
        if ($trigger === null) {
            $trigger = new Trigger();
        }
        $trigger->setId(UuidV4::fromString($nodeId));
        $this->getRepository()->save($trigger);
        return $trigger;
    }

    /**
     * updates a trigger
     * @param string $content - the content to deserialize and update the trigger
     * @param int $userId - the user id associated with the trigger
     * @param string $triggerId - the id of the trigger to update
     * @return mixed|object - the updated or created trigger entity
     */
    public function updateTrigger(string $content, int $userId, string $triggerId)
    {
        $trigger = $this->getRepository()->find($triggerId);
        if ($trigger === null) {
            $trigger = new Trigger();
        }
        $trigger = $this->getSerializer()->deserialize($content, Trigger::class, 'json', [
            AbstractNormalizer::OBJECT_TO_POPULATE => $trigger,
            AbstractNormalizer::GROUPS => ['graph'],
        ]);
        $this->getRepository()->save($trigger);
        $this->getTaskService()->updateTaskFromTriggerNode($trigger);
        $trigger->setUserId($userId);
        return $trigger;
    }

    public function getSerializer(): SerializerInterface
    {
        return $this->serializer;
    }

    public function setSerializer(SerializerInterface $serializer): void
    {
        $this->serializer = $serializer;
    }

    public function getRepository(): TriggerRepository
    {
        return $this->repository;
    }

    public function setRepository(TriggerRepository $repository): void
    {
        $this->repository = $repository;
    }

    public function getTaskService(): TaskService
    {
        return $this->taskService;
    }

    public function setTaskService(TaskService $taskService): void
    {
        $this->taskService = $taskService;
    }
}
