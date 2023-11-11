<?php

namespace App\Entity\Node;

use App\Entity\Expression;
use App\Entity\MapExpression;
use App\Repository\ConditionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ConditionRepository::class)]
#[ORM\Table(name: '`condition`')]
class Condition extends Node
{
    public const CONDITION_NODE_TYPE_TRIGGER = 'TRIGGER';

    public const CONDITION_NODE_TYPE_MAP = 'MAP';

    public const CONDITION_NODE_TYPE_FILTER = 'FILTER';

    public const CONDITION_NODE_TYPE_IF = 'IF';

    public const CONDITION_NODE_TYPE = [
        self::CONDITION_NODE_TYPE_IF,
        self::CONDITION_NODE_TYPE_FILTER,
        self::CONDITION_NODE_TYPE_MAP,
    ];

    #[ORM\OneToOne(cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?Expression $expression = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?MapExpression $mapExpression = null;

    public function getExpression(): ?Expression
    {
        return $this->expression;
    }

    public function setExpression(?Expression $expression): self
    {
        $this->expression = $expression;

        return $this;
    }

    public function getMapExpression(): ?MapExpression
    {
        return $this->mapExpression;
    }

    public function setMapExpression(?MapExpression $mapExpression): self
    {
        $this->mapExpression = $mapExpression;

        return $this;
    }
}
