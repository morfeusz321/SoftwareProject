<?php

namespace App\Entity;

use App\Entity\Node\Node;
use App\Repository\GraphRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GraphRepository::class)]
class Graph
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["graph", "graphInfo"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["graph", "graphInfo"])]
    private ?string $name = null;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $userId = null;

    #[ORM\ManyToOne(targetEntity: User::class, cascade: ['persist'])]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id")]
    #[Groups(["graph", "graphInfo"])]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'graph', targetEntity: Node::class, cascade: ['persist', 'remove'])]
    #[Groups(["graph", "graphInfo"])]
    private Collection $nodes;

    #[ORM\Column]
    #[Groups(["graph", "graphInfo"])]
    private ?bool $isActive = null;

    #[ORM\Column]
    #[Groups(["graph", "graphInfo"])]
    private ?bool $isDraft = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    #[Groups('logs')]
    private array $logs = [];

    public function __construct()
    {
        $this->nodes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): void
    {
        $this->userId = $userId;
    }

    /**
     * @return Collection<int, Node>
     */
    public function getNodes(): Collection
    {
        return $this->nodes;
    }

    public function setNodes(ArrayCollection $nodes): void
    {
        $this->nodes = $nodes;
    }

    public function addNode(Node $node): self
    {
        if (! $this->nodes->contains($node)) {
            $this->nodes->add($node);
            $node->setGraph($this);
        }

        return $this;
    }

    public function removeNode(Node $node): self
    {
        if ($this->nodes->removeElement($node)) {
            // set the owning side to null (unless already changed)
            if ($node->getGraph() === $this) {
                $node->setGraph(null);
            }
        }

        return $this;
    }

    public function isIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function isIsDraft(): ?bool
    {
        return $this->isDraft;
    }

    public function setIsDraft(bool $isDraft): self
    {
        $this->isDraft = $isDraft;

        return $this;
    }

    public function getLogs(): array
    {
        return $this->logs;
    }

    public function setLogs(?array $logs): self
    {
        $this->logs = $logs;

        return $this;
    }

    public function addLogs(string $message): self
    {
        $this->logs[] = $message;
        return $this;
    }

    public function clearGraphsLogs(): void
    {
        $logs = [];
        $this->setLogs($logs);
    }
}
