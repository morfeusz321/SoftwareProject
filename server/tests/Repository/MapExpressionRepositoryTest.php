<?php

namespace App\Tests\Repository;

use App\Entity\MapExpression;
use App\Repository\MapExpressionRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MapExpressionRepositoryTest extends KernelTestCase
{
    private ?MapExpressionRepository $mapExpressionRepository;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $this->mapExpressionRepository = $this->getContainer()->get(MapExpressionRepository::class);
    }

    public function testSave(): void
    {
        $mapExpression = new MapExpression();
        $mapExpression->setFieldName('field_name');
        $mapExpression->setParentNodeId('parent_node_id');
        $mapExpression->setMappedFieldName('mapped_field_name');

        $this->mapExpressionRepository->save($mapExpression, true);

        $savedMapExpression = $this->mapExpressionRepository->find($mapExpression->getId());

        $this->assertSame('field_name', $savedMapExpression->getFieldName());
        $this->assertSame('parent_node_id', $savedMapExpression->getParentNodeId());
        $this->assertSame('mapped_field_name', $savedMapExpression->getMappedFieldName());
    }

    public function testRemove(): void
    {
        $mapExpression = new MapExpression();
        $mapExpression->setFieldName('field_name');
        $mapExpression->setParentNodeId('parent_node_id');
        $mapExpression->setMappedFieldName('mapped_field_name');

        $this->mapExpressionRepository->save($mapExpression, true);
        $mapExpressionId = $mapExpression->getId();
        $this->mapExpressionRepository->remove($mapExpression, true);

        $removedMapExpression = $this->mapExpressionRepository->find($mapExpressionId);

        $this->assertNull($removedMapExpression);
    }
}
