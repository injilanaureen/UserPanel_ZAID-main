<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Jwt;

class HLRController extends Controller
{
    private $partnerId = 'PS005962'; 
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

    private function generateJwtToken($requestId)
    {
        $timestamp = time();
        $payload = [
            'timestamp' => $timestamp,
            'partnerId' => $this->partnerId,
            'reqid' => $requestId
        ];

        return Jwt::encode($payload, $this->secretKey, 'HS256');
    }

    public function hlrcheck(Request $request)
    {
        // Generate a unique request ID
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        if ($request->isMethod('post')) {
            $validatedData = $request->validate([
                'number' => 'required|string',
                'type' => 'required|string'
            ]);

            try {
                // Log the request for debugging
                Log::info('Sending API request for HLR check', [
                    'request_data' => $validatedData,
                    'request_id' => $requestId
                ]);

                $response = Http::withHeaders([
                    'Token' => $jwtToken,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])->post('https://api.paysprint.in/api/v1/service/recharge/hlrapi/hlrcheck', [
                    'number' => $validatedData['number'],
                    'type' => $validatedData['type'],
                ]);

                $responseData = $response->json();

                // Log the API response
                Log::info('HLR API response received', [
                    'status' => $response->status(),
                    'body' => $responseData
                ]);

                return response()->json([
                    'success' => true,
                    'data' => $responseData
                ]);
            } catch (\Exception $e) {
                Log::error('HLR API Error: ' . $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => 'Something went wrong. Please try again later.'
                ], 500);
            }
        }

        return Inertia::render('Admin/hlr/hlrcheck');
    }

    public function hlrbrowseplan(Request $request)
    {
        if ($request->isMethod('post')) {
            // Validate request input
            $validatedData = $request->validate([
                'circle' => 'required|string',
                'op' => 'required|string'
            ]);

            try {
                // Generate request ID and JWT token
                $requestId = time() . rand(1000, 9999);
                $jwtToken = $this->generateJwtToken($requestId);

                // Log request
                Log::info('Sending API request for HLR browse plan', [
                    'request_data' => $validatedData,
                    'request_id' => $requestId
                ]);

                // Make cURL request using Laravel's HTTP client
                $response = Http::withHeaders([
                    'Token' => $jwtToken,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])->post('https://api.paysprint.in/api/v1/service/recharge/hlrapi/browseplan', [
                    'circle' => $validatedData['circle'],
                    'op' => $validatedData['op'],
                ]);

                $responseData = $response->json();

                // Log API response
                Log::info('HLR Browse Plan API Response', [
                    'status' => $response->status(),
                    'body' => $responseData
                ]);

                return Inertia::render('Admin/hlr/hlrbrowseplan', [
                    'success' => true,
                    'response' => $responseData
                ]);
            } catch (\Exception $e) {
                Log::error('Error in HLR Browse Plan API', ['error' => $e->getMessage()]);

                return Inertia::render('Admin/hlr/hlrbrowseplan', [
                    'success' => false,
                    'error' => 'Something went wrong. Please try again.'
                ]);
            }
        }

        return Inertia::render('Admin/hlr/hlrbrowseplan');
    }

}
