<?php

namespace App\Entity\Enum;

enum ContentType: string
{
    case JSON = 'application/json';
    case XML = 'application/xml';
}
