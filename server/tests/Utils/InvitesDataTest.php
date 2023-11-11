<?php

namespace App\Tests\Utils;

use App\Utils\InvitesData;
use PHPUnit\Framework\TestCase;

class InvitesDataTest extends TestCase
{
    public function testConstructor(): void
    {
        $data = [
            'foo' => 'bar',
        ];
        $email = 'test@example.com';

        $invitesData = new InvitesData($data, $email);

        $this->assertSame($data, $invitesData->getData());
        $this->assertSame($email, $invitesData->getEmail());
    }

    public function testGetData(): void
    {
        $data = [
            'foo' => 'bar',
        ];
        $email = 'test@example.com';

        $invitesData = new InvitesData($data, $email);
        $result = $invitesData->getData();

        $this->assertSame($data, $result);
    }

    public function testSetData(): void
    {
        $data = [
            'foo' => 'bar',
        ];
        $email = 'test@example.com';

        $invitesData = new InvitesData($data, $email);
        $newData = [
            'baz' => 'qux',
        ];
        $invitesData->setData($newData);

        $this->assertSame($newData, $invitesData->getData());
    }

    public function testGetEmail(): void
    {
        $data = [
            'foo' => 'bar',
        ];
        $email = 'test@example.com';

        $invitesData = new InvitesData($data, $email);
        $result = $invitesData->getEmail();

        $this->assertSame($email, $result);
    }

    public function testSetEmail(): void
    {
        $data = [
            'foo' => 'bar',
        ];
        $email = 'test@example.com';

        $invitesData = new InvitesData($data, $email);
        $newEmail = 'new@example.com';
        $invitesData->setEmail($newEmail);

        $this->assertSame($newEmail, $invitesData->getEmail());
    }
}
