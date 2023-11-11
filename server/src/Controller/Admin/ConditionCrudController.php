<?php

namespace App\Controller\Admin;

use App\Entity\Node\Condition;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class ConditionCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Condition::class;
    }

    /*
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('title'),
            TextEditorField::new('description'),
        ];
    }
    */
}
