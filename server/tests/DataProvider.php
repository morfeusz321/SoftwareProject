<?php

namespace App\Tests;

class DataProvider
{
    public static function getContentOfFixtureFile(string $path)
    {
        return file_get_contents(__DIR__ . '/Fixtures/' . $path);
    }
}
