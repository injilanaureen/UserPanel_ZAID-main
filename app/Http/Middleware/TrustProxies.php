<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    protected $proxies;

    protected function proxies(): array
    {
        return $this->proxies ?? [];
    }

    // Replace HEADER_X_FORWARDED_ALL with HEADER_X_FORWARDED_FOR
    protected $headers = Request::HEADER_X_FORWARDED_FOR;
}


