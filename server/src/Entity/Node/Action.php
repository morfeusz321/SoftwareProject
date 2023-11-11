<?php

namespace App\Entity\Node;

use App\Entity\Argument;
use App\Entity\Request;
use App\Repository\Node\ActionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ActionRepository::class)]
class Action extends Node
{
    public const ACTION_NODE_TYPE_GET = 'GET';

    public const ACTION_NODE_TYPE_PUT = 'PUT';

    public const ACTION_NODE_TYPE_POST = 'POST';

    public const ACTION_NODE_TYPE_INVITE = 'INVITE';

    public const ACTION_NODE_TYPES = [
        self::ACTION_NODE_TYPE_GET,
        self::ACTION_NODE_TYPE_POST,
        self::ACTION_NODE_TYPE_PUT,
        self::ACTION_NODE_TYPE_INVITE,
    ];

    #[ORM\OneToOne(cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?Request $request = null;

    #[ORM\OneToMany(mappedBy: 'action', targetEntity: Argument::class, cascade: ['remove'], fetch: 'EAGER', orphanRemoval: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?Collection $arguments;

    public function __construct()
    {
        parent::__construct();
        $this->arguments = new ArrayCollection();
    }

    public function getRequest(): ?Request
    {
        return $this->request;
    }

    public function setRequest(Request $request): self
    {
        $this->request = $request;

        return $this;
    }

    public function getArguments(): Collection
    {
        return $this->arguments;
    }

    public function setArguments(ArrayCollection $arguments): self
    {
        $this->arguments = new ArrayCollection($arguments->toArray());
        return $this;
    }

    public function addArgument(Argument $argument): self
    {
        if (! $this->arguments->contains($argument)) {
            $this->arguments->add($argument);
            $argument->setAction($this);
        }

        return $this;
    }

    public function removeArgument(Argument $argument): self
    {
        if ($this->arguments->removeElement($argument)) {
            // set the owning side to null (unless already changed)
            if ($argument->getAction() === $this) {
                $argument->setAction(null);
            }
        }

        return $this;
    }
}
