<?php

namespace App\Entity\Node;

use App\Entity\Argument;
use App\Repository\Node\InviteRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: InviteRepository::class)]
class Invite extends Action
{
    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['graphInfo', 'graph'])]
    private ?Argument $email = null;

    public function getEmail(): ?Argument
    {
        return $this->email;
    }

    public function setEmail(Argument $email): self
    {
        $this->email = $email;

        return $this;
    }
}
