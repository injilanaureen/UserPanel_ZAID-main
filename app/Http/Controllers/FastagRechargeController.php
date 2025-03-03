<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;
class FastagRechargeController extends Controller
{
    public function fastagRechargeOperatorList()
    {
        // Call the external API
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'accept' => 'application/json',
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
            'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
        ])->post('https://sit.paysprint.in/service-api/api/v1/service/fastag/Fastag/operatorsList');

        // Convert response to JSON
        $apiResponse = $response->json();

        return Inertia::render('Admin/FastagRecharge/FastagOperatorList', [
            'operators' => $apiResponse
        ]);
    }
    public function fetchConsumerDetails()
    {
        return Inertia::render('Admin/FastagRecharge/FastagFetchConsumerDetails');
    }
    public function getConsumerDetails(Request $request)
    {
        $validated = $request->validate([
            'operator' => 'required|integer',
            'canumber' => 'required|string'
        ]);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=', 
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M' // Store securely
        ])->post('https://sit.paysprint.in/service-api/api/v1/service/fastag/Fastag/fetchConsumerDetails', [
            'operator' => $validated['operator'],
            'canumber' => $validated['canumber']
        ]);

        return response()->json($response->json());
    }
    public function FastagRecharge(){
        return Inertia::render('Admin/FastagRecharge/FastagRecharge');
    }



    public function FastagStatus(){
        return Inertia::render('Admin/FastagRecharge/FastagStatus');
    }
}
