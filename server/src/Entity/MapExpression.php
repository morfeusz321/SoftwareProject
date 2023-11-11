<?php

namespace App\Entity;

use App\Repository\MapExpressionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MapExpressionRepository::class)]
class MapExpression
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $fieldName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $parentNodeId = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $mappedFieldName = null;

    public function getId(): ?int
    {
        return $this->id;
    }

     public function getFieldName(): ?string
     {
         return $this->fieldName;
     }

     public function setFieldName(string $fieldName): self
     {
         $this->fieldName = $fieldName;

         return $this;
     }

     public function getParentNodeId(): ?string
     {
         return $this->parentNodeId;
     }

     public function setParentNodeId(string $parentNodeId): self
     {
         $this->parentNodeId = $parentNodeId;

         return $this;
     }

     public function getMappedFieldName(): ?string
     {
         return $this->mappedFieldName;
     }

     public function setMappedFieldName(?string $mappedFieldName): self
     {
         $this->mappedFieldName = $mappedFieldName;

         return $this;
     }
}
