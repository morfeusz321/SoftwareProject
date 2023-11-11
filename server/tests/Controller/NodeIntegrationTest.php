<?php

namespace App\Tests\Controller;

use App\Tests\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class NodeIntegrationTest extends WebTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    public function testExecuteNode(): void
    {
        $expectedResponse = DataProvider::getContentOfFixtureFile('Node/executeNodeResponse.json');
        $payload = DataProvider::getContentOfFixtureFile('Node/executeNodeRequest.json');
        $client = static::createClient();

        $client->request('POST', 'api/user/1/nodes/execute', content: $payload);

        $this->assertEquals(201, $client->getResponse()->getStatusCode());
        $this->assertJson(json_encode($expectedResponse), $client->getResponse()->getContent());
    }
}
