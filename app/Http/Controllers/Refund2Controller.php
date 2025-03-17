<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\refundOtp;
use App\Models\ClaimRefund;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;
class Refund2Controller extends Controller
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

        return JWT::encode($payload, $this->secretKey, 'HS256');
    }

    public function refundOtp(Request $request)
    {
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

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

            $response = Http::withHeaders([
                'Token' => $jwtToken,
                'User-Agent' => $this->partnerId,
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ])->post('https://api.paysprint.in/api/v1/service/dmt-v2/refund/refund/resendotp', [
                'referenceid' => $validated['referenceid'],
                'ackno' => $validated['ackno'],
            ]);

            $responseData = $response->json();

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
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        $request->validate([
            'ackno'       => 'required|string',
            'referenceid' => 'required|string',
            'otp'         => 'required|string',
        ]);
    
        try {
            $response = Http::withHeaders([
                'Content-Type'  => 'application/json',
                 'Token' => $jwtToken,
                'User-Agent' => $this->partnerId,
                'accept'        => 'application/json',
            ])->post('https://api.paysprint.in/api/v1/service/dmt-v2/refund/refund/', [
                'ackno'       => $request->ackno,
                'referenceid' => $request->referenceid,
                'otp'         => $request->otp,
            ]);
    
            $apiResponse = $response->json();
    
            // Store response in claim_refunds table
            ClaimRefund::create([
                'ackno'        => $request->ackno,
                'referenceid'  => $request->referenceid,
                'status'       => $apiResponse['status'] ?? 'failed',
                'response_code'=> $apiResponse['response_code'] ?? 'unknown',
                'message'      => $apiResponse['message'] ?? 'No message',
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
