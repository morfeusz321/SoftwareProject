<?php

namespace App\Tests\Entity;

use App\Entity\Auth;
use App\Entity\Request;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

class RequestTest extends TestCase
{
    public function testGetAndSetBody()
    {
        $request = new Request();
        $body = 'Example body';

        $request->setBody($body);

        $this->assertSame($body, $request->getBody());
    }

    public function testGetAndSetUrl()
    {
        $request = new Request();
        $url = 'http://example.com';

        $request->setUrl($url);

        $this->assertSame($url, $request->getUrl());
    }

    public function testGetAndSetMethod()
    {
        $request = new Request();
        $method = SymfonyRequest::METHOD_GET;

        $request->setMethod($method);

        $this->assertSame($method, $request->getMethod());
    }

    public function testGetAndSetMethodWithInvalidMethod()
    {
        $this->expectException(\InvalidArgumentException::class);

        $request = new Request();
        $invalidMethod = 'INVALID_METHOD';

        $request->setMethod($invalidMethod);
    }

    public function testGetAndSetAuth()
    {
        $request = new Request();
        $auth = new Auth();

        $request->setAuth($auth);

        $this->assertSame($auth, $request->getAuth());
    }
}
