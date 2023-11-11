<?php

namespace App\Tests\Entity;

use App\Entity\Expression;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class ExpressionTest extends TestCase
{
    public function testGetType()
    {
        $expression = new Expression();
        $type = Expression::LESS_THAN;
        $expression->setType($type);
        $this->assertEquals($type, $expression->getType());
    }

    public function testSetTypeWithValidType()
    {
        $expression = new Expression();
        $type = Expression::GREATER;
        $expression->setType($type);
        $this->assertEquals($type, $expression->getType());
    }

    public function testSetTypeWithInvalidType()
    {
        $this->expectException(InvalidArgumentException::class);
        $expression = new Expression();
        $type = 'INVALID_TYPE';
        $expression->setType($type);
    }

    public function testGetCompareTo()
    {
        $expression = new Expression();
        $compareTo = Expression::NODE_VALUE;
        $expression->setCompareTo($compareTo);
        $this->assertEquals($compareTo, $expression->getCompareTo());
    }

    public function testSetCompareToWithValidType()
    {
        $expression = new Expression();
        $compareTo = Expression::USER_VALUE;
        $expression->setCompareTo($compareTo);
        $this->assertEquals($compareTo, $expression->getCompareTo());
    }

    public function testSetCompareToWithInvalidType()
    {
        $this->expectException(InvalidArgumentException::class);
        $expression = new Expression();
        $compareTo = 'INVALID_TYPE';
        $expression->setCompareTo($compareTo);
    }

    public function testEvaluateLessThan()
    {
        $expression = new Expression();
        $expression->setType(Expression::LESS_THAN);
        $result = $expression->evaluate(5, 10);
        $this->assertTrue($result);
    }

    public function testEvaluateLessThanOrEqual()
    {
        $expression = new Expression();
        $expression->setType(Expression::LESS_THAN_OR_EQUAL);
        $result = $expression->evaluate(5, 10);
        $this->assertTrue($result);
    }

    public function testEvaluateEqual()
    {
        $expression = new Expression();
        $expression->setType(Expression::EQUAL);
        $result = $expression->evaluate(10, 10);
        $this->assertTrue($result);
    }

    public function testEvaluateNotEqual()
    {
        $expression = new Expression();
        $expression->setType(Expression::NOT_EQUAL);
        $result = $expression->evaluate(10, 5);
        $this->assertTrue($result);
    }

    public function testEvaluateGreaterOrEqual()
    {
        $expression = new Expression();
        $expression->setType(Expression::GREATER_OR_EQUAL);
        $result = $expression->evaluate(10, 5);
        $this->assertTrue($result);
    }

    public function testEvaluateGreater()
    {
        $expression = new Expression();
        $expression->setType(Expression::GREATER);
        $result = $expression->evaluate(10, 5);
        $this->assertTrue($result);
    }

    // Test evaluate() method with different values

    public function testEvaluateLessThanWithFalseResult()
    {
        $expression = new Expression();
        $expression->setType(Expression::LESS_THAN);
        $result = $expression->evaluate(10, 5);
        $this->assertFalse($result);
    }

    public function testEvaluateLessThanOrEqualWithFalseResult()
    {
        $expression = new Expression();
        $expression->setType(Expression::LESS_THAN_OR_EQUAL);
        $result = $expression->evaluate(10, 5);
        $this->assertFalse($result);
    }

    public function testEvaluateEqualWithFalseResult()
    {
        $expression = new Expression();
        $expression->setType(Expression::EQUAL);
        $result = $expression->evaluate(10, 5);
        $this->assertFalse($result);
    }

    public function testEvaluateNotEqualWithFalseResult()
    {
        $expression = new Expression();
        $expression->setType(Expression::NOT_EQUAL);
        $result = $expression->evaluate(10, 10);
        $this->assertFalse($result);
    }

    public function testEvaluateGreaterOrEqualWithFalseResult()
    {
        $expression = new Expression();
        $expression->setType(Expression::GREATER_OR_EQUAL);
        $result = $expression->evaluate(5, 10);
        $this->assertFalse($result);
    }

    public function testEvaluateGreaterWithFalseResult()
    {
        $expression = new Expression();
        $expression->setType(Expression::GREATER);
        $result = $expression->evaluate(5, 10);
        $this->assertFalse($result);
    }

    public function testSetComparisonTypeWithInvalidType()
    {
        $this->expectException(InvalidArgumentException::class);
        $expression = new Expression();
        $type = 'INVALID_TYPE';
        $expression->setComparisonType($type);
    }

    public function testGetSetSecondFieldTimeDate(): void
    {
        $expression = new Expression();
        $date = '2023-06-18';

        $expression->setSecondFieldTimeDate($date);

        $this->assertEquals($date, $expression->getSecondFieldTimeDate());
    }

    public function testGetSetSecondFieldTimeDays(): void
    {
        $expression = new Expression();
        $days = 5;

        $expression->setSecondFieldTimeDays($days);

        $this->assertEquals($days, $expression->getSecondFieldTimeDays());
    }

    public function testGetSetSecondFieldTimeExecutionTime(): void
    {
        $expression = new Expression();
        $executionTime = 'after';

        $expression->setSecondFieldTimeExecutionTime($executionTime);

        $this->assertEquals($executionTime, $expression->getSecondFieldTimeExecutionTime());
    }

    public function testGetSetSecondFieldTimeMonths(): void
    {
        $expression = new Expression();
        $months = 3;

        $expression->setSecondFieldTimeMonths($months);

        $this->assertEquals($months, $expression->getSecondFieldTimeMonths());
    }

    public function testEvaluateDate(): void
    {
        $expression = new Expression();
        $expression->setSecondFieldTimeDate('2023-06-18');
        $expression->setSecondFieldTimeDays(5);
        $expression->setSecondFieldTimeMonths(3);
        $expression->setSecondFieldTimeExecutionTime('after');
        $expression->setComparisonType(Expression::LESS_THAN_OR_EQUAL);

        $leftSide = '2023-06-10';

        $result = $expression->evaluateDate($leftSide);

        $this->assertTrue($result);
    }

    public function testGetSetSecondFieldTimeYears(): void
    {
        $expression = new Expression();
        $years = 2;

        $expression->setSecondFieldTimeYears($years);

        $this->assertEquals($years, $expression->getSecondFieldTimeYears());
    }
}
