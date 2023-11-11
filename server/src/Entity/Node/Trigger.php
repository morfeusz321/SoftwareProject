<?php

namespace App\Entity\Node;

use App\Repository\Node\TriggerRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TriggerRepository::class)]
#[ORM\Table(name: '`trigger`')]
class Trigger extends Node
{
    public const TRIGGER_NODE_TYPE_TRIGGER = 'TRIGGER';

    #[ORM\Column(length: 255)]
    #[Groups(['graph', 'graphInfo'])]
    private ?string $schedule = null;

    public function getSchedule(): ?string
    {
        return $this->schedule;
    }

    public function setSchedule(string $schedule): self
    {
        $this->schedule = $schedule;

        return $this;
    }
}
