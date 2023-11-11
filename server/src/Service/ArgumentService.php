<?php

namespace App\Service;

use App\Entity\Argument;
use App\Repository\ArgumentRepository;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class ArgumentService
{
    private ArgumentRepository $argumentRepository;

    private SerializerInterface $serializer;

    /**
     * ArgumentService constructor.
     *
     * @param ArgumentRepository $argumentRepository The argument repository.
     * @param SerializerInterface $serializer The serializer.
     */
    public function __construct(ArgumentRepository $argumentRepository, SerializerInterface $serializer)
    {
        $this->argumentRepository = $argumentRepository;
        $this->serializer = $serializer;
    }

    /**
     * Update or create an Argument entity based on the provided content.
     *
     * @param int $argumentId The ID of the Argument to update or create.
     * @param string $content The content to deserialize and update the Argument.
     * @return Argument The updated or created Argument entity.
     */
    public function updateArgument(int $argumentId, string $content)
    {
        $argument = $this->getArgumentRepository()->find($argumentId);
        if ($argument === null) {
            $argument = new Argument();
        }
        $argument = $this->getSerializer()->deserialize($content, Argument::class, 'json', [
            AbstractNormalizer::OBJECT_TO_POPULATE => $argument,
        ]);
        $this->getArgumentRepository()->save($argument);
        return $argument;
    }

    public function getArgumentRepository(): ArgumentRepository
    {
        return $this->argumentRepository;
    }

    public function setArgumentRepository(ArgumentRepository $argumentRepository): void
    {
        $this->argumentRepository = $argumentRepository;
    }

    public function getSerializer(): SerializerInterface
    {
        return $this->serializer;
    }

    public function setSerializer(SerializerInterface $serializer): void
    {
        $this->serializer = $serializer;
    }
}
