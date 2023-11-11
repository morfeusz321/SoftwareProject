<?php

namespace App\Tests\Service;

use App\Entity\Argument;
use App\Entity\Node\Action;
use App\Repository\Node\ActionRepository;
use App\Service\ActionService;
use App\Service\ArgumentService;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\UuidV4;

class ActionServiceTest extends TestCase
{
    private ActionService $actionService;

    private ActionRepository $actionRepository;

    private ArgumentService $argumentService;

    private SerializerInterface $serializer;

    private LoggerInterface $logger;

    protected function setUp(): void
    {
        $this->actionRepository = $this->createMock(ActionRepository::class);
        $this->serializer = $this->createMock(SerializerInterface::class);
        $this->argumentService = $this->createMock(ArgumentService::class);
        $this->logger = $this->createMock(LoggerInterface::class);
        $this->actionService = new ActionService($this->actionRepository, $this->serializer, $this->argumentService, $this->logger);
    }

    public function testUpdateActionCreatesNewActionIfNotFound(): void
    {
        $actionId = UuidV4::v4();
        $content = '{"id":"' . $actionId . '"}';
        $userId = 1;

        $expectedAction = new Action();
        $expectedAction->setId($actionId);
        $expectedAction->setUserId($userId);
        $this->actionRepository->expects($this->once())
            ->method('find')
            ->with($actionId)
            ->willReturn(null);
        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->willReturn($expectedAction);
        $this->actionRepository->expects($this->once())
            ->method('save')
            ->with($expectedAction);

        $result = $this->actionService->updateAction($content, $userId, $actionId);

        $this->assertSame($expectedAction, $result);
    }

    // Add more test methods for other scenarios as needed
    public function testUpdateActionUpdatesExistingAction(): void
    {
        $content = '{"name": "Updated Action"}';
        $userId = 1;
        $actionId = UuidV4::v4();

        $existingAction = new Action();
        $existingAction->setId($actionId);
        $existingAction->setUserId($userId);

        $expectedAction = clone $existingAction;

        $this->actionRepository->expects($this->once())
            ->method('find')
            ->with($actionId)
            ->willReturn($existingAction);
        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->with($content, Action::class, 'json', $this->isType('array'))
            ->willReturn(
                $expectedAction
            );
        $this->actionRepository->expects($this->once())
            ->method('save')
            ->with($expectedAction);

        $result = $this->actionService->updateAction($content, $userId, $actionId);

        $this->assertSame($expectedAction, $result);
    }

    public function testUpdateActionHandlesMissingArguments(): void
    {
        $content = '{"name": "Action without arguments"}';
        $userId = 1;
        $actionId = UuidV4::v4();

        $expectedAction = new Action();
        $expectedAction->setId($actionId);
        $expectedAction->setUserId($userId);
        $this->actionRepository->expects($this->once())
            ->method('find')
            ->with($actionId)
            ->willReturn(null);
        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->with($content, Action::class, 'json', $this->isType('array'))
            ->willReturn(
                $expectedAction
            );
        $this->actionRepository->expects($this->once())
            ->method('save')
            ->with($expectedAction);

        $result = $this->actionService->updateAction($content, $userId, $actionId);

        $this->assertSame($expectedAction, $result);
    }

    public function testUpdateActionHandlesArgumentsFromRequest(): void
    {
        $content = '{"name": "Action with arguments", "arguments": [{"name": "Argument 1"}, {"name": "Argument 2"}]}';
        $userId = 1;
        $actionId = UuidV4::v4();
        $arguments = new ArrayCollection([
            new Argument(),
            new Argument(),
        ]);
        $expectedAction = new Action();
        $expectedAction->setId($actionId);
        $expectedAction->setUserId($userId);
        $expectedAction->setArguments($arguments);
        $this->actionRepository->expects($this->once())
            ->method('find')
            ->with($actionId)
            ->willReturn(null);
        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->with($content, Action::class, 'json', $this->isType('array'))
            ->willReturn($expectedAction);
        $this->argumentService->expects($this->exactly(2))->method('updateArgument')->willReturn($arguments->get(0))->willReturn($arguments->get(1));
        $this->actionRepository->expects($this->once())
            ->method('save')
            ->with($expectedAction);

        $result = $this->actionService->updateAction($content, $userId, $actionId);

        $this->assertSame($expectedAction, $result);
    }

    public function testGetActionRepository(): void
    {
        $actionRepository = $this->createMock(ActionRepository::class);
        $service = new ActionService($actionRepository, $this->serializer, $this->argumentService, $this->logger);

        $result = $service->getActionRepository();

        $this->assertSame($actionRepository, $result);
    }

    public function testSetActionRepository(): void
    {
        $actionRepository = $this->createMock(ActionRepository::class);
        $service = new ActionService($this->actionRepository, $this->serializer, $this->argumentService, $this->logger);

        $service->setActionRepository($actionRepository);

        $this->assertSame($actionRepository, $service->getActionRepository());
    }

    public function testSetLogger(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $service = new ActionService($this->actionRepository, $this->serializer, $this->argumentService, $this->logger);

        $service->setLogger($logger);

        $this->assertSame($logger, $service->getLogger());
    }

    public function testGetSerializer(): void
    {
        $serializer = $this->createMock(SerializerInterface::class);
        $service = new ActionService($this->actionRepository, $serializer, $this->argumentService, $this->logger);

        $result = $service->getSerializer();

        $this->assertSame($serializer, $result);
    }

    public function testSetSerializer(): void
    {
        $serializer = $this->createMock(SerializerInterface::class);
        $service = new ActionService($this->actionRepository, $this->serializer, $this->argumentService, $this->logger);

        $service->setSerializer($serializer);

        $this->assertSame($serializer, $service->getSerializer());
    }

    public function testGetArgumentService(): void
    {
        $argumentService = $this->createMock(ArgumentService::class);
        $service = new ActionService($this->actionRepository, $this->serializer, $argumentService, $this->logger);

        $result = $service->getArgumentService();

        $this->assertSame($argumentService, $result);
    }

    public function testSetArgumentService(): void
    {
        $argumentService = $this->createMock(ArgumentService::class);
        $service = new ActionService($this->actionRepository, $this->serializer, $this->argumentService, $this->logger);

        $service->setArgumentService($argumentService);

        $this->assertSame($argumentService, $service->getArgumentService());
    }

    public function testCreateActionExistingAction(): void
    {
        $nodeId = UuidV4::v4();
        $existingAction = new Action();
        $existingAction->setId(UuidV4::fromString($nodeId));

        $actionRepository = $this->createMock(ActionRepository::class);
        $actionRepository->expects($this->once())
            ->method('find')
            ->with($nodeId)
            ->willReturn($existingAction);

        $service = new ActionService($actionRepository, $this->serializer, $this->argumentService, $this->logger);

        $result = $service->createAction($nodeId);

        $this->assertSame($existingAction, $result);
    }

    public function testCreateActionNewAction(): void
    {
        $nodeId = UuidV4::v4();

        $actionRepository = $this->createMock(ActionRepository::class);
        $actionRepository->expects($this->once())
            ->method('find')
            ->with($nodeId)
            ->willReturn(null);

        $actionRepository->expects($this->once())
            ->method('save')
            ->with($this->isInstanceOf(Action::class));

        $service = new ActionService($actionRepository, $this->serializer, $this->argumentService, $this->logger);

        $result = $service->createAction($nodeId);

        $this->assertInstanceOf(Action::class, $result);
        $this->assertEquals($nodeId, $result->getId());
    }
}
