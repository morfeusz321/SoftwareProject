<?php

namespace App\Tests\Controller;

use App\Service\CustomNodeService;
use App\Tests\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CustomNodeIntegrationTest extends WebTestCase
{
    private CustomNodeService $customNodeService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->customNodeService = $this->createMock(CustomNodeService::class);
    }

    public function testGetCustomNodes(): void
    {
        $client = static::createClient();
        $client->request('GET', 'api/user/1/custom-nodes');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(1, $data[0]["id"]);
        $this->assertEquals("Example Custom Node", $data[0]["action"]["name"]);
        $this->assertEquals(1, $data[0]["userId"]);
    }

    public function testGetCustomNode(): void
    {
        $client = static::createClient();
        $client->request('GET', 'api/user/1/custom-nodes/1');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(1, $data["id"]);
        $this->assertEquals("Example Custom Node", $data["action"]["name"]);
        $this->assertEquals(1, $data["userId"]);
    }

    public function testGetNonExistingCustomNode(): void
    {
        $client = static::createClient();
        $client->request('GET', 'api/user/1/custom-nodes/2');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    public function testDeleteCustomNode(): void
    {
        $client = static::createClient();
        $client->request('DELETE', 'api/user/1/custom-nodes/1');
        $this->assertEquals(204, $client->getResponse()->getStatusCode());
    }

    public function testUpdateCustomNode(): void
    {
        $expectedResponse = DataProvider::getContentOfFixtureFile('CustomNode/Put/putCustomNodeResponse.json');
        $payload = DataProvider::getContentOfFixtureFile('CustomNode/Put/putCustomNodeRequest.json');
        $client = static::createClient();

        $client->request('PUT', 'api/user/1/custom-nodes/2', content: $payload);

        $this->assertEquals(201, $client->getResponse()->getStatusCode());
        $this->assertJson(json_encode($expectedResponse), $client->getResponse()->getContent());
    }

    public function testCreateCustomNode(): void
    {
        $expectedResponse = DataProvider::getContentOfFixtureFile('CustomNode/Post/postCustomNodeResponse.json');
        $payload = DataProvider::getContentOfFixtureFile('CustomNode/Post/postCustomNodeRequest.json');
        $client = static::createClient();

        $client->request('POST', 'api/user/1/custom-nodes', content: $payload);

        $this->assertEquals(201, $client->getResponse()->getStatusCode());
        $this->assertJson(json_encode($expectedResponse), $client->getResponse()->getContent());
    }
}
