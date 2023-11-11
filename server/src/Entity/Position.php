<?php

namespace App\Entity;

use App\Repository\PositionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PositionRepository::class)]
class Position
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(["graph", "graphInfo"])]
    private ?int $positionX = null;

    #[ORM\Column]
    #[Groups(["graph", "graphInfo"])]
    private ?int $positionY = null;

    #[ORM\Column]
    #[Groups(["graph", "graphInfo"])]
    private ?int $positionZ = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPositionX(): ?int
    {
        return $this->positionX;
    }

    /**
     * @return $this
     */
    public function setPositionX(int $positionX): self
    {
        $this->positionX = $positionX;

        return $this;
    }

    public function getPositionY(): ?int
    {
        return $this->positionY;
    }

    /**
     * @return $this
     */
    public function setPositionY(int $positionY): self
    {
        $this->positionY = $positionY;

        return $this;
    }

    public function getPositionZ(): ?int
    {
        return $this->positionZ;
    }

    /**
     * @return $this
     */
    public function setPositionZ(int $positionZ): self
    {
        $this->positionZ = $positionZ;

        return $this;
    }
}
