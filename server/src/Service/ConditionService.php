<?php

namespace App\Service;

use App\Entity\Node\Condition;
use App\Repository\ConditionRepository;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\UuidV4;

class ConditionService
{
    private ConditionRepository $conditionRepository;

    private SerializerInterface $serializer;

    /**
     * ConditionService constructor.
     *
     * @param ConditionRepository $conditionRepository - The condition repository.
     * @param SerializerInterface $serializer - The serializer.
     */
    public function __construct(ConditionRepository $conditionRepository, SerializerInterface $serializer)
    {
        $this->conditionRepository = $conditionRepository;
        $this->serializer = $serializer;
    }

    /**
     * Update or create a Condition entity based on the provided content.
     *
     * @param string $content - The content to deserialize and update the Condition.
     * @param int $userId - The user ID associated with the Condition.
     * @param string $conditionId - The ID of the Condition to update or create.
     * @return Condition - The updated or created Condition entity.
     */
    public function updateCondition(string $content, int $userId, string $conditionId)
    {
        $condition = $this->getConditionRepository()->find($conditionId);
        if ($condition === null) {
            $condition = new Condition();
        }
        $condition = $this->getSerializer()->deserialize($content, Condition::class, 'json', [
            AbstractNormalizer::OBJECT_TO_POPULATE => $condition,
            AbstractNormalizer::GROUPS => ['graph'],
        ]);
        $this->getConditionRepository()->save($condition);
        $condition->setUserId($userId);
        return $condition;
    }

    public function getConditionRepository(): ConditionRepository
    {
        return $this->conditionRepository;
    }

    public function setConditionRepository(ConditionRepository $conditionRepository): void
    {
        $this->conditionRepository = $conditionRepository;
    }

    public function getSerializer(): SerializerInterface
    {
        return $this->serializer;
    }

    public function setSerializer(SerializerInterface $serializer): void
    {
        $this->serializer = $serializer;
    }

    /**
     * Create a Condition entity with the provided ID.
     *
     * @param mixed $nodeId - The ID of the Condition to create.
     * @return Condition - The created Condition entity.
     */
    public function createCondition(mixed $nodeId)
    {
        $condition = $this->getConditionRepository()->find($nodeId);
        if ($condition === null) {
            $condition = new Condition();
        }
        $condition->setId(UuidV4::fromString($nodeId));
        $this->getConditionRepository()->save($condition);
        return $condition;
    }
}
