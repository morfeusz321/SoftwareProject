<?php

namespace App\Controller\Admin;

use App\Entity\Argument;
use App\Entity\Auth;
use App\Entity\Graph;
use App\Entity\Node\Action;
use App\Entity\Request;
use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractDashboardController
{
    #[Route('/admin', name: 'admin')]
    public function index(): Response
    {
        $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);

        return $this->redirect($adminUrlGenerator->setController(ArgumentCrudController::class)->generateUrl());
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('App');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkToCrud('Argument', 'fas fa-list', Argument::class);
        yield MenuItem::linkToCrud('Graph', 'fas fa-list', Graph::class);
        yield MenuItem::linkToCrud('User', 'fas fa-list', User::class);
        yield MenuItem::linkToCrud('Action', 'fas fa-list', Action::class);
        yield MenuItem::linkToCrud('Request', 'fas fa-list', Request::class);
        yield MenuItem::linkToCrud('Auth', 'fas fa-list', Auth::class);
    }
}
