<?php

namespace App\Tests\Entity\Node;

namespace App\Tests\Entity\Node;

use App\Entity\Node\Action;
use App\Entity\Node\Custom;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class CustomTest extends TestCase
{
    public function testSetAndGetAction()
    {
        $custom = new Custom();
        $action = new Action();

        $custom->setAction($action);

        $this->assertSame($action, $custom->getAction());
    }

    public function testSetAndGetUser()
    {
        $custom = new Custom();
        $user = new User();

        $custom->setUser($user);

        $this->assertSame($user, $custom->getUser());
    }

    public function testSetAndGetId()
    {
        $custom = new Custom();
        $id = 123;

        $custom->setId($id);

        $this->assertSame($id, $custom->getId());
    }

    public function testSetAndGetUserId()
    {
        $custom = new Custom();
        $userId = 456;

        $custom->setUserId($userId);

        $this->assertSame($userId, $custom->getUserId());
    }
}
