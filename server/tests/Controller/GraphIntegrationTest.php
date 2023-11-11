<?php

namespace App\Tests\Controller;

use App\Service\GraphService;
use App\Tests\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class GraphIntegrationTest extends WebTestCase
{
    private GraphService $graphServiceMock;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a mock of the GraphService class
        $this->graphServiceMock = $this->createMock(GraphService::class);
    }

    public function testGetGraphs()
    {
        $client = static::createClient();
        $client->request('GET', '/api/user/1/graphs');

        // Check that the response status code is 200 OK
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());

        // Check that the response data matches our sample data
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(1, $data[0]["id"]);
        $this->assertEquals("Example Graph With Only Actions", $data[0]["name"]);
        $this->assertEquals(1, $data[0]["user"]["id"]);
    }

    public function testExecuteGraph()
    {
        $client = static::createClient();
        $userId = 1;
        $graphId = 1;

        $client->request('GET', '/api/user/' . $userId . '/graphs/' . $graphId . '/execute');
        $response = $client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $expectedPayload = [
            "logs" => [
                "Executing Trigger:",
                "Root Trigger Node",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000001",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000002",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000003",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000004",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000005",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
            ],
        ];

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals($expectedPayload, $responseData);
    }

    public function testGetLogForGraph()
    {
        $client = static::createClient();
        $userId = 1;
        $graphId = 1;

        $client->request('GET', '/api/user/' . $userId . '/graphs/' . $graphId . '/execute');
        $client->request('GET', '/api/user/' . $userId . '/graphs/' . $graphId . '/logs');

        $response = $client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $expectedPayload = [
            "logs" => [
                "Executing Trigger:",
                "Root Trigger Node",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000001",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000002",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000003",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000004",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
                "Executing GET Action:",
                "00000000-0000-4000-8000-000000000005",
                'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
                'Body evaluated to ',
                "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
            ],
        ];

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals($expectedPayload, $responseData);
    }

    public function testPostGraph()
    {
        $expectedResponse = DataProvider::getContentOfFixtureFile('Graph/Post/postGraphResponse.json');
        $payload = DataProvider::getContentOfFixtureFile('Graph/Post/postGraphRequest.json');

        $client = static::createClient();
        $client->request('POST', '/api/user/1/graphs', content: $payload);

        // Check that the response status code is 201 created
        $this->assertEquals(Response::HTTP_CREATED, $client->getResponse()->getStatusCode());

        // Check that the response data matches the expected response
        $this->assertJson(json_encode($expectedResponse), $client->getResponse()->getContent());
    }

    public function testPutGraph()
    {
        $expectedResponse = DataProvider::getContentOfFixtureFile('Graph/Put/putGraphResponse.json');
        $payload = DataProvider::getContentOfFixtureFile('Graph/Put/putGraphRequest.json');

        $client = static::createClient();
        $client->request('PUT', '/api/user/1/graphs/5', content: $payload);

        // Check that the response status code is 201 created
        $this->assertEquals(Response::HTTP_CREATED, $client->getResponse()->getStatusCode());

        // Check that the response data matches the expected response
        $this->assertJson(json_encode($expectedResponse), $client->getResponse()->getContent());
    }

    public function testGetGraph()
    {
        $expectedResponse = DataProvider::getContentOfFixtureFile('getGraph.json');

        $client = static::createClient();
        $client->request('GET', '/api/user/1/graphs/1');

        // Check that the response status code is 200 OK
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());

        // Check that the response data matches the expected response
        $this->assertJson(json_encode($expectedResponse), $client->getResponse()->getContent());
    }

    // Write additional tests for the other methods in the GraphController class here

    public function testDeleteGraph()
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/user/1/graphs/1');

        $this->assertEquals(Response::HTTP_NO_CONTENT, $client->getResponse()->getStatusCode());
    }
}
