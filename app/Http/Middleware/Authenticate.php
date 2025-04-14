<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Inertia\Inertia;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return '/';
        }

        $ip = \DB::table('portal_settings')->where('code', 'whitelistip')->first(['value']);

        if($ip->value != "::1" && $ip->value != $request->ip()){
            abort(403);
        }
    }
}
