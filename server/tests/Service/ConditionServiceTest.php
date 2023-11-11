<?php

namespace App\Tests\Service;

use App\Entity\Node\Condition;
use App\Repository\ConditionRepository;
use App\Service\ConditionService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\UuidV4;

class ConditionServiceTest extends TestCase
{
    private ConditionService $conditionService;

    private ConditionRepository $conditionRepository;

    private SerializerInterface $serializer;

    protected function setUp(): void
    {
        $this->conditionRepository = $this->createMock(ConditionRepository::class);
        $this->serializer = $this->createMock(SerializerInterface::class);

        $this->conditionService = new ConditionService($this->conditionRepository, $this->serializer);
    }

    public function testUpdateCondition(): void
    {
        $content = '{"name": "Test Condition"}';
        $userId = 123;
        $conditionId = 'abc123';

        // Mock ConditionRepository
        $this->conditionRepository->expects($this->once())
            ->method('find')
            ->with($conditionId)
            ->willReturn(null);
        $this->conditionRepository->expects($this->once())
            ->method('save');

        // Mock SerializerInterface
        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->willReturn(new Condition());

        $condition = $this->conditionService->updateCondition($content, $userId, $conditionId);

        $this->assertInstanceOf(Condition::class, $condition);
    }

    public function testCreateCondition(): void
    {
        $nodeId = UuidV4::v4();

        // Mock ConditionRepository
        $this->conditionRepository->expects($this->once())
            ->method('find')
            ->with($nodeId)
            ->willReturn(null);
        $this->conditionRepository->expects($this->once())
            ->method('save')
            ->willReturnCallback(function ($condition) use ($nodeId) {
                $this->assertInstanceOf(Condition::class, $condition);
                $this->assertEquals($nodeId, $condition->getId());
            });

        $condition = $this->conditionService->createCondition($nodeId);

        $this->assertInstanceOf(Condition::class, $condition);
    }

    public function testGetSetConditionRepository(): void
    {
        $conditionRepository = $this->createMock(ConditionRepository::class);

        $this->conditionService->setConditionRepository($conditionRepository);

        $this->assertEquals($conditionRepository, $this->conditionService->getConditionRepository());
    }

    public function testGetSetSerializer(): void
    {
        $serializer = $this->createMock(SerializerInterface::class);

        $this->conditionService->setSerializer($serializer);

        $this->assertEquals($serializer, $this->conditionService->getSerializer());
    }
}
