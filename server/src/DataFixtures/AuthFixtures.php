<?php

namespace App\DataFixtures;

use App\Entity\Auth;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AuthFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);
        $auth = new Auth();
        $auth->setType(Auth::BEARER);
        $auth->setToken("secret");
        $manager->persist($auth);
        $manager->flush();
    }
}
