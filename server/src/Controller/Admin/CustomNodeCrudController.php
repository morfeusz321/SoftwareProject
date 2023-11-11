<?php

namespace App\Controller\Admin;

use App\Entity\Node\Custom;

class CustomNodeCrudController
{
    public static function getEntityFqcn(): string
    {
        return Custom::class;
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
