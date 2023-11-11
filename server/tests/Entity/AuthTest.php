<?php

namespace App\Tests\Entity;

use App\Entity\Auth;
use PHPUnit\Framework\TestCase;

class AuthTest extends TestCase
{
    public function testGetId()
    {
        $auth = new Auth();
        $this->assertNull($auth->getId());
    }

    public function testGetToken()
    {
        $auth = new Auth();
        $this->assertNull($auth->getToken());
    }

    public function testSetToken()
    {
        $auth = new Auth();
        $token = 'example_token';
        $auth->setToken($token);
        $this->assertEquals($token, $auth->getToken());
    }

    public function testGetType()
    {
        $auth = new Auth();
        $type = Auth::OAUTH2;
        $auth->setType($type);
        $this->assertEquals($type, $auth->getType());
    }

    public function testSetTypeWithValidType()
    {
        $auth = new Auth();
        $type = Auth::API_KEY;
        $auth->setType($type);
        $this->assertEquals($type, $auth->getType());
    }

    public function testSetTypeWithInvalidType()
    {
        $this->expectException(\InvalidArgumentException::class);
        $auth = new Auth();
        $type = 'INVALID_TYPE';
        $auth->setType($type);
    }
}
