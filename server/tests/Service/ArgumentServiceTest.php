<?php

namespace App\Tests\Service;

use App\Entity\Argument;
use App\Repository\ArgumentRepository;
use App\Service\ArgumentService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class ArgumentServiceTest extends TestCase
{
    private ArgumentRepository $argumentRepository;

    private SerializerInterface $serializer;

    private ArgumentService $argumentService;

    protected function setUp(): void
    {
        $this->argumentRepository = $this->createMock(ArgumentRepository::class);
        $this->serializer = $this->createMock(SerializerInterface::class);
        $this->argumentService = new ArgumentService($this->argumentRepository, $this->serializer);
    }

    public function testUpdateArgumentExistingArgument(): void
    {
        $argumentId = 1;
        $content = '{"alias": "argument_alias", "field": "argument_field"}';

        $existingArgument = new Argument();
        $existingArgument->setAlias('existing_alias');
        $existingArgument->setField('existing_field');

        $this->argumentRepository->expects($this->once())
            ->method('find')
            ->with($argumentId)
            ->willReturn($existingArgument);

        $updatedArgument = new Argument();
        $updatedArgument->setAlias('argument_alias');
        $updatedArgument->setField('argument_field');

        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->with($content, Argument::class, 'json', [
                AbstractNormalizer::OBJECT_TO_POPULATE => $existingArgument,
            ])
            ->willReturn($updatedArgument);

        $this->argumentRepository->expects($this->once())
            ->method('save')
            ->with($updatedArgument);

        $result = $this->argumentService->updateArgument($argumentId, $content);

        $this->assertSame($updatedArgument, $result);
    }

    public function testUpdateArgumentNewArgument(): void
    {
        $argumentId = 1;
        $content = '{"alias": "new_argument_alias", "field": "new_argument_field"}';

        $this->argumentRepository->expects($this->once())
            ->method('find')
            ->with($argumentId)
            ->willReturn(null);

        $newArgument = new Argument();
        $newArgument->setAlias('new_argument_alias');
        $newArgument->setField('new_argument_field');

        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->willReturn($newArgument);

        $this->argumentRepository->expects($this->once())
            ->method('save')
            ->with($newArgument);

        $result = $this->argumentService->updateArgument($argumentId, $content);

        $this->assertSame($newArgument, $result);
    }

    public function testGetSetArgumentRepository(): void
    {
        $argumentRepository = $this->createMock(ArgumentRepository::class);

        $this->argumentService->setArgumentRepository($argumentRepository);

        $this->assertEquals($argumentRepository, $this->argumentService->getArgumentRepository());
    }

    public function testGetSetSerializer(): void
    {
        $serializer = $this->createMock(SerializerInterface::class);

        $this->argumentService->setSerializer($serializer);

        $this->assertEquals($serializer, $this->argumentService->getSerializer());
    }
}
