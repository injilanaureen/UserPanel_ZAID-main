<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use App\Models\AirtelCmsUrl;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class CMSAirtelController extends Controller
{
    private $partnerId = 'PS005962';
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

    // Generate JWT token
    private function generateJwtToken($requestId)
    {
        $timestamp = time();
        $payload = [
            'timestamp' => $timestamp,
            'partnerId' => $this->partnerId,
            'reqid' => $requestId
        ];

        return JWT::encode(
            $payload,
            $this->secretKey,
            'HS256'
        );
    }

    public function generateUrl()
    {
        // API call to fetch Airtel CMS data
        $url = "https://sit.paysprint.in/service-api/api/v1/service/airtelcms/V2/airtel/index";
        $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3NDEzNDk2MzAsInBhcnRuZXJJZCI6IlBTMDA1OTYyIiwicmVxaWQiOiIxNzQxMzQ5NjMwICJ9.XDf0Oc7lRKY6042VAmm_E916_9TzBNzAjE2EzccSdzY";
    
    
        return Inertia::render('Admin/cmsairtel/GenerateUrl');
    }
    
    public function storeUrl(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'refid' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);
        
        // Get API settings from config
        $apiSettings = Config::get('services.airtelcms');
        
        try {
            // Make the API call to generate URL
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiSettings['token'],
                'Content-Type' => 'application/json'
            ])->post($apiSettings['url'], [
                'refid' => $request->refid,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]);
            
            $responseData = $response->json();
            
            // Store the data in the database
            $airtelUrl = new AirtelCmsUrl();
            $airtelUrl->refid = $request->refid;
            $airtelUrl->latitude = $request->latitude;
            $airtelUrl->longitude = $request->longitude;
            $airtelUrl->message = $responseData['message'] ?? null;
            $airtelUrl->redirectionUrl = $responseData['redirectionUrl'] ?? null;
            $airtelUrl->save();
            
            // Return the API response to the frontend
            return response()->json($responseData);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error processing request: ' . $e->getMessage()
            ], 500);
        }
    }
   
    public function airtelTransactionEnquiry()
    {
        return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry');
    }

}