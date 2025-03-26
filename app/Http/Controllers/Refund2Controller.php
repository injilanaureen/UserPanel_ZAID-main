<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RefundOtp;
use App\Models\ClaimRefund;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Jwt; 
class Refund2Controller extends Controller
{
    private $partnerId = 'PS005962';
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

    private function callDynamicApi($apiName, $payload = [], $additionalHeaders = [])
    {
        try {
            // Fetch API URL using helper
            $apiUrl = \App\Helpers\ApiHelper::getApiUrl($apiName);

            // Generate unique request ID and JWT token using helpers
            $requestId = \App\Helpers\ApiHelper::generateRequestId();
            $jwtToken = \App\Helpers\ApiHelper::generateJwtToken($requestId, $this->partnerId, $this->secretKey);

            // Prepare headers using helper
            $headers = \App\Helpers\ApiHelper::getApiHeaders($jwtToken, $additionalHeaders, $this->partnerId);

            // Make the API call
            $response = Http::withHeaders($headers)
                ->post($apiUrl, $payload);

            // Log the API call
            Log::info('Dynamic API Call', [
                'api_name' => $apiName,
                'url' => $apiUrl,
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

    public function refundOtp(Request $request)
    {
        if ($request->isMethod('get')) {
            return Inertia::render('Admin/refund2/refundOtp', [
                'apiResponse' => null
            ]);
        }

        try {
            $validated = $request->validate([
                'referenceid' => 'required|string',
                'ackno' => 'required|string',
            ]);

            $responseData = $this->callDynamicApi('Dmt2Refund Otp', [
                'referenceid' => $validated['referenceid'],
                'ackno' => $validated['ackno'],
            ]);

            RefundOtp::create([
                'referenceid' => $validated['referenceid'],
                'ackno' => $validated['ackno'],
                'status' => $responseData['status'] ?? 'unknown',
                'response_code' => $responseData['response_code'] ?? 'unknown',
                'message' => $responseData['message'] ?? 'No message',
            ]);

            return Inertia::render('Admin/refund2/refundOtp', [
                'apiResponse' => $responseData
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Admin/refund2/refundOtp', [
                'apiResponse' => [
                    'status' => 'error',
                    'message' => 'An error occurred',
                    'details' => $e->getMessage()
                ]
            ]);
        }
    }
    
    public function claimRefund()
    {
        return Inertia::render('Admin/refund2/claimRefund', [
            'apiResponse' => session('apiResponse') ?? null,
        ]);
    }
    
    public function processRefund(Request $request)
    {
        $request->validate([
            'ackno' => 'required|string',
            'referenceid' => 'required|string',
            'otp' => 'required|string',
        ]);

        try {
            $payload = [
                'ackno' => $request->ackno,
                'referenceid' => $request->referenceid,
                'otp' => $request->otp,
            ];

            $apiResponse = $this->callDynamicApi('Dmt2Claim Refund', $payload);

            ClaimRefund::create([
                'ackno' => $request->ackno,
                'referenceid' => $request->referenceid,
                'status' => $apiResponse['status'] ?? 'failed',
                'response_code' => $apiResponse['response_code'] ?? 'unknown',
                'message' => $apiResponse['message'] ?? 'No message',
            ]);

            return redirect()->route('transaction2.claimRefund')->with('apiResponse', $apiResponse);
        } catch (\Exception $e) {
            return redirect()->route('transaction2.claimRefund')->with('apiResponse', [
                'status' => 'error',
                'message' => 'Failed to process refund.',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
