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
use App\Models\ApiManagement;
class CMSAirtelController extends Controller
{
    private $partnerId = 'PS005962';
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

    private function callDynamicApi($apiName, $payload = [], $additionalHeaders = [])
    {
        try {
            $requestId = \App\Helpers\ApiHelper::generateRequestId();
            $jwtToken = \App\Helpers\ApiHelper::generateJwtToken($requestId, $this->partnerId, $this->secretKey);
            
            // Fetch API URL from ApiManagement table
            $apiConfig = ApiManagement::where('api_name', $apiName)->first();
            if (!$apiConfig) {
                throw new \Exception("API configuration not found for: $apiName");
            }
            
            $headers = array_merge([
                'Token' => $jwtToken,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ], $additionalHeaders);

            $response = Http::withHeaders($headers)
                ->post($apiConfig->api_url, $payload);

            Log::info('Dynamic API Call', [
                'api_name' => $apiName,
                'url' => $apiConfig->api_url,
                'payload' => $payload,
                'response' => $response->json()
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Dynamic API Call Failed', [
                'api_name' => $apiName,
                'error' => $e->getMessage()
            ]);

            return [
                'status' => false,
                'message' => 'API call failed: ' . $e->getMessage()
            ];
        }
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

        try {
            $payload = [
                'refid' => $request->input('refid'),
                'latitude' => $request->input('latitude'),
                'longitude' => $request->input('longitude'),
            ];

            $responseData = $this->callDynamicApi('GenerateUrl', $payload);

            if (isset($responseData['status']) && !$responseData['status']) {
                throw new \Exception($responseData['message'] ?? 'API returned error status');
            }

            return Inertia::render('Admin/cmsairtel/GenerateUrl', [
                'apiResponse' => $responseData,
                'refid' => $payload['refid'],
                'latitude' => $payload['latitude'],
                'longitude' => $payload['longitude'],
            ]);

        } catch (\Exception $e) {
            Log::error('Generate URL Failed: ' . $e->getMessage());
            return Inertia::render('Admin/cmsairtel/GenerateUrl', [
                'error' => 'Failed to fetch API response: ' . $e->getMessage(),
            ]);
        }
    }


    
    public function airtelTransactionEnquiry(Request $request)
    {
        if ($request->isMethod('post')) {
            $validator = Validator::make($request->all(), [
                'refid' => 'required|string|max:50',
            ]);

            if ($validator->fails()) {
                return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry', [
                    'error' => $validator->errors()->first(),
                ]);
            }

            try {
                $payload = [
                    'refid' => $request->input('refid'),
                ];

                $responseData = $this->callDynamicApi('TransactionEnquiry', $payload);

                if (isset($responseData['status']) && !$responseData['status']) {
                    throw new \Exception($responseData['message'] ?? 'API returned error status');
                }

                return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry', [
                    'transactionData' => $responseData,
                ]);

            } catch (\Exception $e) {
                Log::error('Transaction Enquiry Failed: ' . $e->getMessage());
                return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry', [
                    'error' => 'Failed to fetch transaction status: ' . $e->getMessage(),
                ]);
            }
        }

        return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry');
    }

}