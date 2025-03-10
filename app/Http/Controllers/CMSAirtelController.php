<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

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
    
        // Hardcoded latitude and longitude
        $latitude = "28.6139";  // Example: New Delhi
        $longitude = "77.2090";
    
        // Pass hardcoded values to Inertia view
        return Inertia::render('Admin/cmsairtel/GenerateUrl', [
            'latitude' => $latitude,
            'longitude' => $longitude
        ]);
    }
    

 public function airtelTransactionEnquiry()
    {
        return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry');
    }

    // API call to get operators
    public function getBillOperators(Request $request)
    {
        Log::info('getBillOperators method called'); // Debug log to confirm method is hit
        
        try {
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);

            Log::info('Generated JWT Token: ' . $jwtToken); // Debug token

            $response = Http::withHeaders([
                'accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Token' => $jwtToken,
                'User-Agent' => $this->partnerId
            ])->post('https://api.paysprint.in/api/v1/service/bill-payment/bill/getoperator', [
                'mode' => 'online'
            ]);

            Log::info('API Response: ', $response->json()); // Debug API response

            $responseData = $response->json();

            if ($response->successful()) {
                return response()->json([
                    'status' => true,
                    'data' => $responseData,
                    'message' => 'Operators fetched successfully'
                ]);
            } else {
                Log::error('API call failed:', $responseData);
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to fetch operators',
                    'error' => $responseData
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Error fetching operators: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
}
