<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class AirtelController extends Controller
{
    public function generate()
    {
        return Inertia::render('Admin/cms/airtelcms'); // Renders the React component
    }

    public function process(Request $request)
{
    $data = $request->validate([
        'refid' => 'required|integer',
        'latitude' => 'required|string',
        'longitude' => 'required|string',
    ]);

    // External API Call
    $apiResponse = Http::withHeaders([
        'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
        'token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3NDAwMjk5NjEsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzQwMDI5OTYxIn0.FinP5ONFH5_lPJ6wPlHsYN1EjEsI1RuXM0IqlGvokHU',
        'accept' => 'text/plain',
        'content-type' => 'application/json',
    ])->post('https://sit.paysprint.in/service-api/api/v1/service/airtelcms/V2/airtel/index', $data);

    // External API ka exact JSON return karna
    return response($apiResponse->body(), $apiResponse->status())
        ->header('Content-Type', 'application/json');
}
    public function check(Request $request)
{
    $data = $request->validate([
        'refid' => 'required|integer',
    ]);

    // External API Call
    $apiResponse = Http::withHeaders([
        'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
        'token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3NDAwMjk5NjEsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzQwMDI5OTYxIn0.FinP5ONFH5_lPJ6wPlHsYN1EjEsI1RuXM0IqlGvokHU',
        'accept' => 'text/plain',
        'content-type' => 'application/json',
    ])->post('https://sit.paysprint.in/service-api/api/v1/service/airtelcms/airtel/status', $data);

    // External API ka exact JSON return karna
    return response($apiResponse->body(), $apiResponse->status())
        ->header('Content-Type', 'application/json');
}


}

