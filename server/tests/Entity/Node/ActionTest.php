<?php

namespace App\Tests\Entity\Node;

namespace App\Tests\Entity\Node;

use App\Entity\Argument;
use App\Entity\Node\Action;
use App\Entity\Request;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;

class ActionTest extends TestCase
{
    public function testGetRequest()
    {
        $action = new Action();
        $request = new Request();

        $action->setRequest($request);

        $this->assertEquals($request, $action->getRequest());
    }

    public function testSetRequest()
    {
        $action = new Action();
        $request = new Request();

        $action->setRequest($request);

        $this->assertEquals($request, $action->getRequest());
    }

    public function testGetArguments()
    {
        $action = new Action();
        $argument1 = new Argument();
        $argument2 = new Argument();

        $action->addArgument($argument1);
        $action->addArgument($argument2);

        $arguments = $action->getArguments();

        $this->assertInstanceOf(ArrayCollection::class, $arguments);
        $this->assertTrue($arguments->contains($argument1));
        $this->assertTrue($arguments->contains($argument2));
    }

    public function testSetArguments()
    {
        $action = new Action();
        $arguments = new ArrayCollection([new Argument(), new Argument()]);

        $action->setArguments($arguments);

        $this->assertEquals($arguments, $action->getArguments());
    }

    public function testAddArgument()
    {
        $action = new Action();
        $argument = new Argument();

        $action->addArgument($argument);

        $this->assertTrue($action->getArguments()->contains($argument));
        $this->assertEquals($action, $argument->getAction());
    }

    public function testRemoveArgument()
    {
        $action = new Action();
        $argument = new Argument();

        $action->addArgument($argument);
        $action->removeArgument($argument);

        $this->assertFalse($action->getArguments()->contains($argument));
        $this->assertNull($argument->getAction());
    }
}
