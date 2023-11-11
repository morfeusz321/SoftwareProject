<?php

namespace App\Controller\Admin;

use App\Entity\Graph;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class GraphCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Graph::class;
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
