<?php

namespace App\Controller\Admin;

use App\Entity\Auth;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class AuthCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Auth::class;
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
