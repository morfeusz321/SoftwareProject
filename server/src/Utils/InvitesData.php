<?php

namespace App\Utils;

class InvitesData
{
    public array $data;

    public string $email;

    public function __construct(array $data, string $email)
    {
        $this->data = $data;
        $this->email = $email;
    }


    public function getData(): array
    {
        return $this->data;
    }


    public function setData(array $data): void
    {
        $this->data = $data;
    }


    public function getEmail(): string
    {
        return $this->email;
    }


    public function setEmail(string $email): void
    {
        $this->email = $email;
    }
}
