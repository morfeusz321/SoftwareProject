<?php

namespace App\Tests\Entity\Node;

use App\Entity\Expression;
use App\Entity\MapExpression;
use App\Entity\Node\Condition;
use PHPUnit\Framework\TestCase;

class ConditionTest extends TestCase
{
    public function testExpressionGetterAndSetter()
    {
        $condition = new Condition();

        // Create a new mock object for the Expression class
        $expressionMock = $this->createMock(Expression::class);

        // Test the setter
        $condition->setExpression($expressionMock);
        $this->assertSame($expressionMock, $condition->getExpression());

        // Test setting it to null
        $condition->setExpression(null);
        $this->assertNull($condition->getExpression());
    }

    public function testMapExpressionGetterAndSetter()
    {
        $condition = new Condition();

        // Create a new mock object for the MapExpression class
        $mapExpressionMock = $this->createMock(MapExpression::class);

        // Test the setter
        $condition->setMapExpression($mapExpressionMock);
        $this->assertSame($mapExpressionMock, $condition->getMapExpression());

        // Test setting it to null
        $condition->setMapExpression(null);
        $this->assertNull($condition->getMapExpression());
    }
}
