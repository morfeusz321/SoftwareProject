<?php

namespace App\Entity\Node;

use App\Entity\Graph;
use App\Entity\Position;
use App\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\DiscriminatorColumn;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\InheritanceType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Uid\UuidV4;

#[Entity]
#[InheritanceType('SINGLE_TABLE')]
#[DiscriminatorColumn(name: 'discr', type: 'string')]
#[DiscriminatorMap([
    'node' => Node::class,
    'action' => Action::class,
    'invite' => Invite::class,
    'condition' => Condition::class,
    'trigger' => Trigger::class,
])]
class Node
{
    #[ORM\Id]
    #[ORM\Column(type: "uuid")]
    #[Groups(["graph", "graphInfo"])]
    private ?UuidV4 $id = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(["graph", "graphInfo"])]
    private ?string $name = null;

    #[ORM\ManyToMany(targetEntity: self::class)]
    #[Groups(["graph"])]
    private Collection $neighbours;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $userId;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id')]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Graph::class, inversedBy: 'nodes')]
    private ?Graph $graph = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(["graph", "graphInfo"])]
    private ?string $type;

    #[ORM\OneToOne(cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(["graph", "graphInfo"])]
    private ?Position $position = null;

    public function __construct()
    {
        $this->neighbours = new ArrayCollection();
    }

    #[Groups(["graphInfo"])]
    #[SerializedName("neighbours")]
    public function getIdsOfNeighbours()
    {
        $ids = [];
        foreach ($this->neighbours as $neighbour) {
            $ids[] = $neighbour->getId();
        }
        return $ids;
    }

    public function getId(): ?UuidV4
    {
        return $this->id;
    }

    // This is so that we can use a Node's ID as a map key, since UuidV4 requires casting to string first.
    public function getIdString(): ?string
    {
        return (string) $this->id;
    }

    /**
     * @return Collection<int, self>
     */
    public function getNeighbours(): Collection
    {
        return $this->neighbours;
    }

    public function setNeighbours(ArrayCollection $collection)
    {
        $this->neighbours = $collection;
        return $this;
    }

    public function addNeighbour(self $neighbour): self
    {
        if (! $this->neighbours->contains($neighbour)) {
            $this->neighbours->add($neighbour);
        }

        return $this;
    }

    public function removeNeighbour(self $neighbour): self
    {
        $this->neighbours->removeElement($neighbour);

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getGraph(): ?Graph
    {
        return $this->graph;
    }

    public function setGraph(?Graph $graph): self
    {
        $this->graph = $graph;

        return $this;
    }

    public function setId(?UuidV4 $id): void
    {
        $this->id = $id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): void
    {
        $this->type = $type;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): void
    {
        $this->userId = $userId;
    }

    public function getPosition(): ?Position
    {
        return $this->position;
    }

    public function setPosition(?Position $position): self
    {
        $this->position = $position;

        return $this;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getName(): ?string
    {
        return $this->name;
    }
}
