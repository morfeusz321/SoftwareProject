<?php

namespace App\Service;

use App\Entity\Argument;
use App\Entity\Node\Invite;
use App\Repository\Node\InviteRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Uid\UuidV4;

class InviteService
{
    private InviteRepository $inviteRepository;

    private ActionService $actionService;

    public function __construct(InviteRepository $inviteRepository, ActionService $actionService)
    {
        $this->inviteRepository = $inviteRepository;
        $this->actionService = $actionService;
    }

    /**
     * Creates a new Invite entity.
     *
     * @param mixed $nodeId The ID of the node associated with the Invite.
     *
     * @return Invite The newly created Invite entity.
     */
    public function createInvite(mixed $nodeId): Invite
    {
        $actionNode = $this->inviteRepository->find($nodeId);
        if ($actionNode === null) {
            $actionNode = new Invite();
        }
        $actionNode->setId(UuidV4::fromString($nodeId));
        assert($actionNode instanceof Invite);
        $this->inviteRepository->save($actionNode);
        return $actionNode;
    }

    /**
     * Updates an existing Invite entity.
     *
     * @param string $content  The content to update the Invite with.
     * @param int    $userId   The ID of the user performing the update.
     * @param string $inviteId The ID of the Invite to update.
     *
     * @return Invite The updated Invite entity.
     */
    public function updateInvite(string $content, int $userId, string $inviteId): Invite
    {
        $actionNode = $this->inviteRepository->find($inviteId);

        if ($actionNode === null) {
            $actionNode = new Invite();
        }
        $actionNode = $this->actionService->deserializeActionNode($content, $actionNode, $userId);
        assert($actionNode instanceof Invite);

        $email = $this->updateEmail($content, $actionNode);
        $actionNode->setEmail($email);
        return $actionNode;
    }

    /**
     * Updates the email field of the Invite entity based on the provided content.
     *
     * @param string $content     The content containing the email information.
     * @param Invite $actionNode  The Invite entity to update.
     *
     * @return Argument The updated Argument entity representing the email.
     *
     * @throws HttpException If the email field is missing in the provided content.
     */
    public function updateEmail(string $content, Invite $actionNode): Argument
    {
        $data = json_decode($content, true);
        if (! key_exists('email', $data)) {
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, "Invite has to be provided with email-form address filed");
        }
        $email = $data['email'];
        $argument = $this->actionService->updateArgument($email);
        $argument->setAction($actionNode);
        return $argument;
    }
}
