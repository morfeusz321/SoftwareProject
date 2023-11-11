<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Graph $graph = null;

    #[ORM\Column(type: "integer", nullable: false)]
    private ?int $graphId;

    #[ORM\Column(length: 255)]
    private ?string $cron = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGraph(): ?Graph
    {
        return $this->graph;
    }

    public function setGraph(Graph $graph): self
    {
        $this->graph = $graph;

        return $this;
    }

    public function getCron(): ?string
    {
        return $this->cron;
    }

    public function setCron(string $cron): self
    {
        $this->cron = $cron;

        return $this;
    }

    /**
     * @return int
     */
    public function getGraphId(): ?int
    {
        return $this->graphId;
    }

    public function setGraphId(?int $graphId): void
    {
        $this->graphId = $graphId;
    }
}
