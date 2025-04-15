<?php
namespace App\Http\Middleware;
 
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
 
class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'example/*', // Exclude specific routes (e.g., /example/*)
        'api/*',     // Exclude API routes
        'submit',    // Exclude a specific endpoint (e.g., /submit)
    ];
}