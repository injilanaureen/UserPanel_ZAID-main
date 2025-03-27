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
use App\Http\Controllers\Jwt; 

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

        return Jwt::encode(
            $payload,
            $this->secretKey,
            'HS256'
        );
    }
    public function generateUrl(Request $request)
{
    // Validate user input
    $validator = Validator::make($request->all(), [
        'refid' => 'required|string|max:50',
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
    ]);

    if ($validator->fails()) {
        return Inertia::render('Admin/cmsairtel/GenerateUrl', [
            'error' => $validator->errors(),
        ]);
    }

    $refid = $request->input('refid');
    $latitude = $request->input('latitude');
    $longitude = $request->input('longitude');

    // Generate JWT token
    $token = $this->generateJwtToken($refid);

    try {
        // Call API
        $response = Http::withHeaders([
            'Token' => $token,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post('https://api.paysprint.in/api/v1/service/airtelcms/V2/airtel/index', [
            'refid' => $refid,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);

        // Convert response to JSON
        $responseData = $response->json();

        // Return response data to Inertia
        return Inertia::render('Admin/cmsairtel/GenerateUrl', [
            'apiResponse' => $responseData,
            'refid' => $refid,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);

    } catch (\Exception $e) {
        Log::error('API Call Failed: ' . $e->getMessage());

        return Inertia::render('Admin/cmsairtel/GenerateUrl', [
            'error' => 'Failed to fetch API response. Please try again.',
        ]);
    }
}


    
   
public function airtelTransactionEnquiry(Request $request)
    {
        if ($request->isMethod('post')) {
            // Validate user input
            $validator = Validator::make($request->all(), [
                'refid' => 'required|string|max:50',
            ]);

            if ($validator->fails()) {
                return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry', [
                    'error' => $validator->errors()->first(),
                ]);
            }

            $refid = $request->input('refid');
            $token = $this->generateJwtToken($refid);

            try {
                // Call API
                $response = Http::withHeaders([
                    'Token' => $token,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])->post('https://api.paysprint.in/api/v1/service/airtelcms/airtel/status', [
                    'refid' => $refid,
                ]);

                $responseData = $response->json();

                return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry', [
                    'transactionData' => $responseData,
                ]);

            } catch (\Exception $e) {
                Log::error('Transaction Enquiry Failed: ' . $e->getMessage());

                return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry', [
                    'error' => 'Failed to fetch transaction status. Please try again.',
                ]);
            }
        }

        // For GET request, just render the page
        return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry');
    }

}