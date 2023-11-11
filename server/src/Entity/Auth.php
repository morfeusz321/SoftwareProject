<?php

namespace App\Entity;

use App\Repository\AuthRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AuthRepository::class)]
class Auth
{
    public const BEARER = 'BEARER';

    public const API_KEY = 'API_KEY';

    public const OAUTH2 = 'OAUTH2';

    public const NONE = 'NONE';

    public const TOKEN_TYPES = [
        self::OAUTH2,
        self::API_KEY,
        self::BEARER,
        self::NONE,
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $token = null;

    #[ORM\Column]
    #[Groups(['graph', "graphInfo"])]
    private string $type;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        if (! in_array($type, self::TOKEN_TYPES)) {
            throw new \InvalidArgumentException("Invalid status");
        }
        $this->type = $type;
        return $this;
    }
}
