<?php

namespace App\Entity;

use App\Entity\Node\Action;
use App\Repository\ArgumentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ArgumentRepository::class)]
class Argument
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['graph', "graphInfo"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $alias = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $parentId = null;

    #[ORM\Column]
    #[Groups(['graph', "graphInfo"])]
    private ?string $field = null;

    #[ORM\ManyToOne(inversedBy: 'arguments')]
    private ?Action $action = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAlias(): ?string
    {
        return $this->alias;
    }

    public function setAlias(string $alias): self
    {
        $this->alias = $alias;

        return $this;
    }

    public function getField(): ?string
    {
        return $this->field;
    }

    public function setField(string $field): self
    {
        $this->field = $field;

        return $this;
    }

    public function getAction(): ?Action
    {
        return $this->action;
    }

    public function setAction(?Action $action): self
    {
        $this->action = $action;

        return $this;
    }

    public function getParentId(): ?string
    {
        return $this->parentId;
    }

    public function setParentId(?string $parentId): self
    {
        $this->parentId = $parentId;

        return $this;
    }
}
