<?php

namespace App\Tests\Entity;

use App\Entity\Argument;
use App\Entity\Node\Action;
use PHPUnit\Framework\TestCase;

class ArgumentTest extends TestCase
{
    private Argument $argument;

    protected function setUp(): void
    {
        $this->argument = new Argument();
    }

    public function testGetSetAlias(): void
    {
        $alias = 'argument_alias';

        $this->argument->setAlias($alias);

        $this->assertEquals($alias, $this->argument->getAlias());
    }

    public function testGetSetField(): void
    {
        $field = 'argument_field';

        $this->argument->setField($field);

        $this->assertEquals($field, $this->argument->getField());
    }

    public function testGetSetAction(): void
    {
        $action = new Action();

        $this->argument->setAction($action);

        $this->assertEquals($action, $this->argument->getAction());
    }

    public function testGetSetParentId(): void
    {
        $parentId = 'parent_id';

        $this->argument->setParentId($parentId);

        $this->assertEquals($parentId, $this->argument->getParentId());
    }
}
