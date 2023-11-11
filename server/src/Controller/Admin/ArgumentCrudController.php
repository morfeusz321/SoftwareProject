<?php

namespace App\Controller\Admin;

use App\Entity\Argument;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class ArgumentCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Argument::class;
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
