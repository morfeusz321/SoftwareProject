<?php

namespace App\Tests\Service;

use App\Entity\Node\Custom;
use App\Entity\User;
use App\Repository\Node\CustomNodeRepository;
use App\Repository\UserRepository;
use App\Service\ActionService;
use App\Service\CustomNodeService;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\UuidV4;

class CustomNodeServiceTest extends TestCase
{
    private CustomNodeService $customNodeService;

    private ActionService $actionService;

    private SerializerInterface $serializer;

    private UserRepository $userRepository;

    private LoggerInterface $logger;

    private CustomNodeRepository $customNodeRepository;

    protected function setUp(): void
    {
        $this->customNodeRepository = $this->createMock(CustomNodeRepository::class);
        $this->actionService = $this->createMock(ActionService::class);
        $this->serializer = $this->createMock(SerializerInterface::class);
        $this->userRepository = $this->createMock(UserRepository::class);
        $this->logger = $this->createMock(LoggerInterface::class);
        $this->customNodeService = new CustomNodeService($this->customNodeRepository, $this->actionService, $this->serializer, $this->userRepository, $this->logger);
    }

    public function testUpdateCustomNodeCreatesNewCustomNodeIfNotFound(): void
    {
        $customNodeId = 3;
        $actionId = UuidV4::v4();
        $actionContent = '{"id":"' . $actionId . '"}';
        $content = '{"id":"' . $customNodeId . '","action":' . $actionContent . '}';
        $userId = 1;
        $user = new User();
        $this->userRepository->method('find')->with($userId)->willReturn($user);

        $expectedCustomNode = new Custom();
        $expectedCustomNode->setId($customNodeId);
        $expectedCustomNode->setUserId($userId);
        //dd($expectedCustomNode);
        $this->customNodeRepository->expects($this->once())
            ->method('findOneBy')
            ->with([
                'id' => $customNodeId,
                'user' => $userId,
            ])
            ->willReturn(null);
        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->willReturn($expectedCustomNode);
        $this->actionService->expects($this->once())
            ->method('updateAction')
            ->with($actionContent, $userId, $actionId);
        $this->customNodeRepository->expects($this->once())
            ->method('save')
            ->with($expectedCustomNode);

        $result = $this->customNodeService->updateCustomNode($content, $userId, $customNodeId);

        $this->assertSame($expectedCustomNode, $result);
    }

    public function testUpdateCustomNodeUpdatesExistingCustomNode(): void
    {
        $customNodeId = 3;
        $actionId = UuidV4::v4();
        $actionContent = '{"id":"' . $actionId . '"}';
        $content = '{"id":"' . $customNodeId . '","action":' . $actionContent . '}';
        $userId = 1;
        $user = new User();
        $this->userRepository->method('find')->with($userId)->willReturn($user);

        $expectedCustomNode = new Custom();
        $expectedCustomNode->setId($customNodeId);
        $expectedCustomNode->setUserId($userId);
        $this->customNodeRepository->expects($this->once())
            ->method('findOneBy')
            ->with([
                'id' => $customNodeId,
                'user' => $userId,
            ])
            ->willReturn($expectedCustomNode);
        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->willReturn($expectedCustomNode);
        $this->actionService->expects($this->once())
            ->method('updateAction')
            ->with($actionContent, $userId, $actionId);
        $this->customNodeRepository->expects($this->once())
            ->method('save')
            ->with($expectedCustomNode);

        $result = $this->customNodeService->updateCustomNode($content, $userId, $customNodeId);

        $this->assertSame($expectedCustomNode, $result);
    }

    public function testGetCustomNodesReturnsProperCustomNodes(): void
    {
        $userId = 1;
        $user = new User();
        $this->userRepository->method('find')->with($userId)->willReturn($user);
        $customNodes = [new Custom(), new Custom()];
        $this->customNodeRepository->expects($this->once())
            ->method('findBy')
            ->with([
                'user' => $userId,
            ])
            ->willReturn($customNodes);

        $result = $this->customNodeService->getCustomNodes($userId);

        $this->assertSame($customNodes, $result);
    }

    public function testGetCustomNodeReturnsProperCustomNode(): void
    {
        $userId = 1;
        $customNodeId = 3;
        $customNode = new Custom();
        $user = new User();
        $this->userRepository->method('find')->with($userId)->willReturn($user);
        $this->customNodeRepository->expects($this->once())
            ->method('findOneBy')
            ->with([
                'id' => $customNodeId,
                'user' => $userId,
            ])
            ->willReturn($customNode);

        $result = $this->customNodeService->getCustomNode($userId, $customNodeId);

        $this->assertSame($customNode, $result);
    }

    public function testCreateCustomNodeCreatesNode(): void
    {
        $userId = 1;
        $customNodeId = 3;
        $actionId = UuidV4::v4();
        $actionContent = '{"id":"' . $actionId . '"}';
        $label = 'label';
        $content = '{"id":"' . $customNodeId . '","action":' . $actionContent . '}';
        $expectedCustomNode = new Custom();
        $expectedCustomNode->setId($customNodeId);
        $expectedCustomNode->setUserId($userId);
        $this->userRepository
            ->method('find')
            ->with($userId)
            ->willReturn(new User());
        $this->serializer->expects($this->once())
            ->method('deserialize')
            ->willReturn($expectedCustomNode);
        $this->actionService->expects($this->once())
            ->method('updateAction')
            ->with($actionContent, $userId, $actionId);
        $this->customNodeRepository->expects($this->once())
            ->method('save')
            ->with($expectedCustomNode);

        $result = $this->customNodeService->createCustomNode($userId, $content);

        $this->assertSame($expectedCustomNode, $result);
    }

    public function testCreateReturnsExceptionWhenUserDoesNotExist()
    {
        $userId = 1;
        $customNodeId = 3;
        $actionId = UuidV4::v4();
        $actionContent = '{"id":"' . $actionId . '"}';
        $label = 'label';
        $content = '{"id":"' . $customNodeId . '","action":' . $actionContent . '}';
        $expectedCustomNode = new Custom();
        $expectedCustomNode->setId($customNodeId);
        $expectedCustomNode->setUserId($userId);
        $this->userRepository
            ->method('find')
            ->with($userId)
            ->willReturn(null);

        $this->expectException(\Exception::class);
        $this->customNodeService->createCustomNode($userId, $content);
    }
}
