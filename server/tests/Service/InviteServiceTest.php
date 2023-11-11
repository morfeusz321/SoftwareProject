<?php

namespace App\Tests\Service;

use App\Entity\Argument;
use App\Entity\Node\Invite;
use App\Repository\Node\InviteRepository;
use App\Service\ActionService;
use App\Service\InviteService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Uid\Uuid;

class InviteServiceTest extends TestCase
{
    private $inviteRepositoryMock;

    private $actionServiceMock;

    protected function setUp(): void
    {
        $this->inviteRepositoryMock = $this->createMock(InviteRepository::class);
        $this->actionServiceMock = $this->createMock(ActionService::class);
    }

    public function testCreateInvite(): void
    {
        $nodeId = Uuid::v4();
        $expectedInvite = new Invite();

        $this->inviteRepositoryMock
            ->expects($this->once())
            ->method('find')
            ->with($nodeId)
            ->willReturn(null);

        $this->inviteRepositoryMock
            ->expects($this->once())
            ->method('save');

        $inviteService = new InviteService($this->inviteRepositoryMock, $this->actionServiceMock);
        $result = $inviteService->createInvite($nodeId);

        $this->assertInstanceOf(Invite::class, $result);
        $this->assertEquals($nodeId, $result->getId());
    }

    public function testUpdateInvite(): void
    {
        $content = '{"email": "test@example.com"}';
        $userId = 1;
        $inviteId = Uuid::v4();
        $expectedInvite = new Invite();
        $expectedArgument = new Argument();

        $this->inviteRepositoryMock
            ->expects($this->once())
            ->method('find')
            ->with($inviteId)
            ->willReturn(null);

        $this->actionServiceMock
            ->expects($this->once())
            ->method('deserializeActionNode')
            ->with($content, $this->isInstanceOf(Invite::class), $userId)
            ->willReturn($expectedInvite);

        $this->actionServiceMock
            ->expects($this->once())
            ->method('updateArgument')
            ->with('test@example.com')
            ->willReturn($expectedArgument);

        $inviteService = new InviteService($this->inviteRepositoryMock, $this->actionServiceMock);
        $result = $inviteService->updateInvite($content, $userId, $inviteId);

        $this->assertInstanceOf(Invite::class, $result);
        $this->assertEquals($expectedInvite, $result);
        $this->assertEquals($expectedArgument, $result->getEmail());
    }

    public function testUpdateEmail(): void
    {
        $content = '{"email": "test@example.com"}';
        $expectedArgument = new Argument();

        $invite = new Invite();

        $this->actionServiceMock
            ->expects($this->once())
            ->method('updateArgument')
            ->with('test@example.com')
            ->willReturn($expectedArgument);

        $inviteService = new InviteService($this->inviteRepositoryMock, $this->actionServiceMock);
        $result = $inviteService->updateEmail($content, $invite);

        $this->assertInstanceOf(Argument::class, $result);
        $this->assertEquals($expectedArgument, $result);
        $this->assertEquals($invite, $result->getAction());
    }

    public function testUpdateEmailMissingEmailField(): void
    {
        $this->expectException(HttpException::class);

        $content = '{"name": "John Doe"}';
        $invite = new Invite();

        $inviteService = new InviteService($this->inviteRepositoryMock, $this->actionServiceMock);
        $inviteService->updateEmail($content, $invite);
    }
}
