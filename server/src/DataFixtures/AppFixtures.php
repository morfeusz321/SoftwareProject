<?php

namespace App\DataFixtures;

use App\Entity\Argument;
use App\Entity\Expression;
use App\Entity\Graph;
use App\Entity\MapExpression;
use App\Entity\Node\Action;
use App\Entity\Node\Condition;
use App\Entity\Node\Custom;
use App\Entity\Node\Trigger;
use App\Entity\Position;
use App\Entity\Request;
use App\Entity\Task;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Uid\UuidV4;

class AppFixtures extends Fixture
{
    public const UUID_STRINGS = ["00000000-0000-4000-8000-000000000001",
        "00000000-0000-4000-8000-000000000002",
        "00000000-0000-4000-8000-000000000003",
        "00000000-0000-4000-8000-000000000004",
        "00000000-0000-4000-8000-000000000005",
        "00000000-0000-4000-8000-000000000006"];

    public const TEST_GET_URL = "https://jsonplaceholder.typicode.com/todos/1";

    public const TEST_POST_URL = "https://jsonplaceholder.typicode.com/posts";

    public const TEST_PUT_URL = "https://jsonplaceholder.typicode.com/posts/1";

    public const TEST_POST_RESPONSE_JSON = '{"id": 101, "test": 1}';

    public const TEST_GET_RESPONSE_JSON = '{"userId": 1,"id": 1,"title": "delectus aut autem","completed": false}';

    public const TEST_POST_BODY = '{"test": 1}';

    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $manager->persist($user);

        $graphOnlyActions = $this->createExampleGraphWithOnlyActions($user, $manager);
        $manager->persist($graphOnlyActions);

        $graphWithIfConditions = $this->createExampleGraphWithIfConditions($user, $manager);
        $manager->persist($graphWithIfConditions);

        $graphWithFilter = $this->createExampleGraphWithFilterNode($user, $manager);
        $manager->persist($graphWithFilter);

        $graphWithArgument = $this->createExampleGraphWithPostAndArguments($user, $manager);
        $manager->persist($graphWithArgument);

        $customGetNode = $this->createExampleCustomNode($user, $manager);
        $manager->persist($customGetNode);

        $graphWithNestedFields = $this->createExampleGraphWithNestedObjects($user, $manager);
        $manager->persist($graphWithNestedFields);

        $manager->flush();
    }

    // TODO: uncomment this, figure out a way to have both data fixtures at once (this will require changing the way we
    // handle UUIDs, since right now they're fixed and we can't reuse them in two graphs.
    private function createExampleGraphWithOnlyActions(User $user, ObjectManager $manager): Graph
    {
        $graph = new Graph();
        $graph->setUser($user);

        $graph->setName("Example Graph With Only Actions");
        $graph->setIsActive(true);
        $graph->setIsDraft(false);

        $nodes = [];

        // The first node will make a GET request to a site which can be used for making a test request, as it will
        // always return a predetermined test JSON object. In this case, the returned value will be:
        // {
        //    "userId": 1,
        //    "id": 1,
        //    "title": "delectus aut autem",
        //    "completed": false
        // }
        // Set the position, user and id values for all the nodes.

        $pos = new Position();
        $pos->setPositionX(0);
        $pos->setPositionY(0);
        $pos->setPositionZ(0);
        $manager->persist($pos);

        for ($i = 0; $i < 5; $i++) {
            $nodes[$i] = new Action();
            $nodes[$i]->setType(Action::ACTION_NODE_TYPE_GET);

            $exampleGetRequest = new Request();
            $exampleGetRequest->setUrl("https://jsonplaceholder.typicode.com/todos/1");
            $exampleGetRequest->setMethod(Action::ACTION_NODE_TYPE_GET);
            $manager->persist($exampleGetRequest);
            $nodes[$i]->setRequest($exampleGetRequest);

            $nodes[$i]->setPosition($pos);
            $nodes[$i]->setUser($user);
            $nodes[$i]->setId(UuidV4::fromString(self::UUID_STRINGS[$i]));
        }

        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[0]->addNeighbour($nodes[2]);

        $nodes[1]->addNeighbour($nodes[3]);
        $nodes[2]->addNeighbour($nodes[3]);

        $nodes[2]->addNeighbour($nodes[4]);

        // Root trigger node
        $nodes[5] = new Trigger();
        $nodes[5]->addNeighbour($nodes[0]);
        $nodes[5]->setName("Root Trigger Node");
        $nodes[5]->setPosition($pos);
        $nodes[5]->setUser($user);
        $nodes[5]->setSchedule("*/2 * * * *");
        $nodes[5]->setId(UuidV4::fromString(self::UUID_STRINGS[5]));
        $nodes[5]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        foreach ($nodes as $node) {
            $manager->persist($node);
            $graph->addNode($node);
        }

        $task = new Task();
        $task->setGraph($graph);
        $task->setCron("*/2 * * * *");
        $manager->persist($task);
        return $graph;
    }

    private function createExampleGraphWithIfConditions(User $user, ObjectManager $manager): Graph
    {
        $graph = new Graph();
        $graph->setUser($user);
        $graph->setName("Example Graph With If Conditions");
        $graph->setIsActive(true);
        $graph->setIsDraft(false);

        $nodes = [];

        // Set up the two GET requests.
        $requestOne = new Request();
        $requestOne->setUrl("https://jsonplaceholder.typicode.com/todos/1");
        $requestOne->setMethod(Action::ACTION_NODE_TYPE_GET);
        $manager->persist($requestOne);

        $requestTwo = new Request();
        $requestTwo->setUrl("https://jsonplaceholder.typicode.com/todos/2");
        $requestTwo->setMethod(Action::ACTION_NODE_TYPE_GET);
        $manager->persist($requestTwo);

        // Node 0 is a trigger node
        $nodes[0] = new Trigger();
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // Node 1 is a GET node
        $nodes[1] = new Action();
        $nodes[1]->setRequest($requestOne);
        $nodes[1]->setId(new UuidV4()); // We need this ID for the expression so we set it here instead of below, awful.
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);

        // Node 2 and 3 are If nodes, checking the userId of the body returned by the node 1 GET. Node 2 should give
        // true, node 3 should give false.
        $nodes[2] = new Condition();
        $nodes[2]->setType(Condition::CONDITION_NODE_TYPE_IF);
        $ifExpressionOne = new Expression();
        $ifExpressionOne->setComparisonType(Expression::EQUAL);
        $ifExpressionOne->setFirstFieldValue('userId');
        $ifExpressionOne->setFirstFieldNodeId($nodes[1]->getId());
        $ifExpressionOne->setSecondFieldUserValue('1');
        $ifExpressionOne->setCompareTo(Expression::USER_VALUE);
        $manager->persist($ifExpressionOne);
        $nodes[2]->setExpression($ifExpressionOne);

        $nodes[3] = new Condition();
        $nodes[3]->setType(Condition::CONDITION_NODE_TYPE_IF);
        $ifExpressionTwo = new Expression();
        $ifExpressionTwo->setComparisonType(Expression::EQUAL);
        $ifExpressionTwo->setFirstFieldValue('userId');
        $ifExpressionTwo->setFirstFieldNodeId($nodes[1]->getId());
        $ifExpressionTwo->setSecondFieldUserValue('2');
        $ifExpressionTwo->setCompareTo(Expression::USER_VALUE);
        $manager->persist($ifExpressionTwo);
        $nodes[3]->setExpression($ifExpressionTwo);

        // Nodes 4 and 5 are GET nodes
        $nodes[4] = new Action();
        $nodes[4]->setRequest($requestTwo);
        $nodes[4]->setType(Action::ACTION_NODE_TYPE_GET);
        $nodes[5] = new Action();
        $nodes[5]->setRequest($requestTwo);
        $nodes[5]->setType(Action::ACTION_NODE_TYPE_GET);

        // Add neighbours
        $nodes[0]->addNeighbour($nodes[1]);

        $nodes[1]->addNeighbour($nodes[2]);
        $nodes[1]->addNeighbour($nodes[3]);

        $nodes[2]->addNeighbour($nodes[4]);
        $nodes[3]->addNeighbour($nodes[5]);

        $pos = new Position();
        $pos->setPositionX(0);
        $pos->setPositionY(0);
        $pos->setPositionZ(0);
        $manager->persist($pos);

        for ($i = 0; $i < 6; $i++) {
            $nodes[$i]->setPosition($pos);
            $nodes[$i]->setUser($user);

            if ($i != 1) { // Disgusting............
                $nodes[$i]->setId(new UuidV4());
            }

            $manager->persist($nodes[$i]);
            $graph->addNode($nodes[$i]);
        }

        return $graph;
    }

    private function createExampleGraphWithFilterNode(User $user, ObjectManager $manager): Graph
    {
        $graph = new Graph();
        $graph->setUser($user);

        $graph->setName("Example Graph With Filter Node");
        $graph->setIsActive(true);
        $graph->setIsDraft(false);

        // Create and store a GET request which will return an example list of objects
        $requestOne = new Request();
        $requestOne->setUrl("https://jsonplaceholder.typicode.com/posts");
        $requestOne->setMethod(Action::ACTION_NODE_TYPE_GET);
        $manager->persist($requestOne);

        $nodes = [];
        $nodes[0] = new Trigger();
        $nodes[1] = new Action();
        $nodes[2] = new Condition();

        $pos = new Position();
        $pos->setPositionX(0);
        $pos->setPositionY(0);
        $pos->setPositionZ(0);

        $manager->persist($pos);

        foreach ($nodes as $node) {
            $node->setPosition($pos);
            $node->setUser($user);

            $node->setId(new UuidV4());

            $manager->persist($node);
            $graph->addNode($node);
        }

        // Node 0 is a trigger node
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // Node 1 is a GET node
        $nodes[1]->setRequest($requestOne);
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);

        // Node 2 is a filter node which will get the posts from the example list with userId=2
        $ifExpressionOne = new Expression();
        $ifExpressionOne->setComparisonType(Expression::EQUAL);
        $ifExpressionOne->setFirstFieldValue('userId');
        $ifExpressionOne->setFirstFieldNodeId($nodes[1]->getId());
        $ifExpressionOne->setSecondFieldUserValue('2');
        $ifExpressionOne->setCompareTo(Expression::USER_VALUE);
        $manager->persist($ifExpressionOne);
        $nodes[2]->setExpression($ifExpressionOne);
        $nodes[2]->setType(Condition::CONDITION_NODE_TYPE_FILTER);

        // Add neighbours
        $nodes[0]->addNeighbour($nodes[1]);

        $nodes[1]->addNeighbour($nodes[2]);

        for ($i = 0; $i < 3; $i++) {
            $nodes[$i]->setPosition($pos);
            $nodes[$i]->setUser($user);
            $manager->persist($nodes[$i]);
            $graph->addNode($nodes[$i]);
        }
        return $graph;
    }

    private function createExampleGraphWithPostAndArguments(User $user, ObjectManager $manager): Graph
    {
        $graph = new Graph();
        $graph->setUser($user);
        $graph->setName("Example Graph With Arguments");
        $graph->setIsActive(true);
        $graph->setIsDraft(false);

        $nodes = [];
        // Set up the two requests.
        $requestOne = new Request();
        $requestOne->setUrl(self::TEST_GET_URL);
        $requestOne->setMethod(Action::ACTION_NODE_TYPE_GET);
        $manager->persist($requestOne);

        $requestTwo = new Request();
        $requestTwo->setUrl(self::TEST_POST_URL);
        $requestTwo->setMethod(Action::ACTION_NODE_TYPE_POST);
        $requestTwo->setBody('{"test": <<test>>}');
        $manager->persist($requestTwo);

        // Node 0 is a trigger node
        $nodes[0] = new Trigger();
        $nodes[0]->setId(new UuidV4());
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // Node 1 is a GET node
        $nodes[1] = new Action();
        $nodes[1]->setRequest($requestOne);
        $nodes[1]->setId(new UuidV4());
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);

        // Node 2 is a POST node with an argument
        $nodes[2] = new Action();
        $nodes[2]->setRequest($requestTwo);
        $nodes[2]->setId(new UuidV4());
        $nodes[2]->setType(Action::ACTION_NODE_TYPE_POST);

        $argumentForNodeTwo = new Argument();
        $argumentForNodeTwo->setAlias('test');
        $argumentForNodeTwo->setParentId($nodes[1]->getId());
        $argumentForNodeTwo->setField('userId');
        $argumentForNodeTwo->setAction($nodes[2]);
        $manager->persist($argumentForNodeTwo);

        $nodes[2]->setArguments(new ArrayCollection([$argumentForNodeTwo]));

        // Add neighbours
        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[1]->addNeighbour($nodes[2]);

        $pos = new Position();
        $pos->setPositionX(0);
        $pos->setPositionY(0);
        $pos->setPositionZ(0);

        for ($i = 0; $i < 3; $i++) {
            $nodes[$i]->setPosition($pos);
            $nodes[$i]->setUser($user);
            $manager->persist($nodes[$i]);
            $graph->addNode($nodes[$i]);
        }

        return $graph;
    }

    public function createExampleCustomNode(User $user, ObjectManager $manager): Custom
    {
        $custom = new Custom();
        $custom->setUser($user);

        $requestOne = new Request();
        $requestOne->setUrl(self::TEST_GET_URL);
        $requestOne->setMethod(Action::ACTION_NODE_TYPE_GET);
        $manager->persist($requestOne);

        $action = new Action();
        $action->setName('Example Custom Node');
        $action->setRequest($requestOne);
        $action->setId(new UuidV4());
        $action->setType(Action::ACTION_NODE_TYPE_GET);

        $pos = new Position();
        $pos->setPositionX(0);
        $pos->setPositionY(0);
        $pos->setPositionZ(0);

        $action->setPosition($pos);

        $manager->persist($action);
        $custom->setAction($action);

        return $custom;
    }

    private function createExampleGraphWithNestedObjects(User $user, ObjectManager $manager): Graph
    {
        $graph = new Graph();
        $graph->setUser($user);

        $graph->setName("Example Graph With Nested Objects");
        $graph->setIsActive(true);
        $graph->setIsDraft(false);

        $nodes = [];
        $nodes[0] = new Trigger();
        $nodes[1] = new Action();
        $nodes[2] = new Condition();
        $nodes[3] = new Condition();
        $nodes[4] = new Action();
        $nodes[5] = new Condition();
        $nodes[6] = new Action();

        $pos = new Position();
        $pos->setPositionX(0);
        $pos->setPositionY(0);
        $pos->setPositionZ(0);

        $manager->persist($pos);

        foreach ($nodes as $node) {
            $node->setPosition($pos);
            $node->setUser($user);

            $node->setId(new UuidV4());

            $manager->persist($node);
            $graph->addNode($node);
        }

        // Node 0 is a trigger node
        $nodes[0]->setType(Trigger::TRIGGER_NODE_TYPE_TRIGGER);

        // Create and store a GET request which will return an example list of objects
        $requestOne = new Request();
        $requestOne->setUrl("https://jsonplaceholder.typicode.com/users");
        $requestOne->setMethod(Action::ACTION_NODE_TYPE_GET);

        // Node 1 is a GET node
        $manager->persist($requestOne);
        $nodes[1]->setRequest($requestOne);
        $nodes[1]->setType(Action::ACTION_NODE_TYPE_GET);

        // Node 2 is a filter node which will get only positive longitude users
        $filterExpression = new Expression();
        $filterExpression->setComparisonType(Expression::GREATER);
        $filterExpression->setFirstFieldValue('address.geo.lat');
        $filterExpression->setFirstFieldNodeId($nodes[1]->getId());
        $filterExpression->setSecondFieldUserValue('0');
        $filterExpression->setCompareTo(Expression::USER_VALUE);
        $manager->persist($filterExpression);
        $nodes[2]->setExpression($filterExpression);
        $nodes[2]->setType(Condition::CONDITION_NODE_TYPE_FILTER);

        // Node 3 is a map node which will get the users map the user's company name
        $mapExpression = new MapExpression();
        $mapExpression->setFieldName('company.name');
        $mapExpression->setParentNodeId($nodes[1]->getId());
        $mapExpression->setMappedFieldName('company-name');
        $manager->persist($mapExpression);
        $nodes[3]->setMapExpression($mapExpression);
        $nodes[3]->setType(Condition::CONDITION_NODE_TYPE_MAP);

        // Create and store a GET request which will return a specific user
        $requestTwo = new Request();
        $requestTwo->setUrl("https://jsonplaceholder.typicode.com/users/1");
        $requestTwo->setMethod(Action::ACTION_NODE_TYPE_GET);

        // Node 4 is a GET node
        $manager->persist($requestTwo);
        $nodes[4]->setRequest($requestTwo);
        $nodes[4]->setType(Action::ACTION_NODE_TYPE_GET);

        // Node 5 is an if node which will check if city is Gwenborough
        $ifExpression = new Expression();
        $ifExpression->setComparisonType(Expression::EQUAL);
        $ifExpression->setFirstFieldValue('address.city');
        $ifExpression->setFirstFieldNodeId($nodes[4]->getId());
        $ifExpression->setSecondFieldUserValue('Gwenborough');
        $ifExpression->setCompareTo(Expression::USER_VALUE);
        $manager->persist($ifExpression);
        $nodes[5]->setExpression($ifExpression);
        $nodes[5]->setType(Condition::CONDITION_NODE_TYPE_IF);

        // Create and make a POST request which will post a user's geolocation
        $requestThree = new Request();
        $requestThree->setUrl("https://jsonplaceholder.typicode.com/users/1");
        $requestThree->setMethod(Action::ACTION_NODE_TYPE_POST);
        $requestThree->setBody('{"user-location": <<geolocation>>}');
        $manager->persist($requestThree);

        // Argument that will take the user's geolocation
        $argument = new Argument();
        $argument->setAlias('geolocation');
        $argument->setParentId($nodes[4]->getId());
        $argument->setField('address.geo');
        $argument->setAction($nodes[6]);
        $manager->persist($argument);

        // Node 6 is a POST node that will post the user's location with an argument
        $nodes[6]->setRequest($requestThree);
        $nodes[6]->setType(Action::ACTION_NODE_TYPE_POST);
        $nodes[6]->setArguments(new ArrayCollection([$argument]));

        // Add neighbours
        $nodes[0]->addNeighbour($nodes[1]);
        $nodes[1]->addNeighbour($nodes[2]);
        $nodes[1]->addNeighbour($nodes[3]);
        $nodes[0]->addNeighbour($nodes[4]);
        $nodes[4]->addNeighbour($nodes[5]);
        $nodes[5]->addNeighbour($nodes[6]);

        for ($i = 0; $i < 7; $i++) {
            $nodes[$i]->setPosition($pos);
            $nodes[$i]->setUser($user);
            $manager->persist($nodes[$i]);
            $graph->addNode($nodes[$i]);
        }
        return $graph;
    }
}
