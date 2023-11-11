<?php

namespace App\Entity;

use App\Repository\RequestRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RequestRepository::class)]
class Request
{
    public const REQUEST_METHODS = [
        SymfonyRequest::METHOD_GET,
        SymfonyRequest::METHOD_POST,
        SymfonyRequest::METHOD_PUT,
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['graph', "graphInfo"])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['graph', "graphInfo"])]
    private string $body = '';

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $url = null;

    #[ORM\Column]
    #[Groups(['graph', "graphInfo"])]
    private ?string $method = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['graph', "graphInfo"])]
    private ?Auth $auth = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBody(): string
    {
        return $this->body;
    }

    public function setBody(?string $body): self
    {
        $this->body = $body;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getAuth(): ?Auth
    {
        return $this->auth;
    }

    public function setAuth(?Auth $auth): self
    {
        $this->auth = $auth;

        return $this;
    }

    public function getMethod(): ?string
    {
        return $this->method;
    }

    public function setMethod(?string $method): self
    {
        if (! in_array($method, self::REQUEST_METHODS)) {
            throw new \InvalidArgumentException("Invalid status");
        }
        $this->method = $method;
        return $this;
    }
}
