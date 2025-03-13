<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RegisterBeneficiary2;
use App\Models\FetchBeneficiary;
use App\Models\BeneficiaryDeletion;
use App\Models\FetchbyBenied;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class Beneficiary2Controller extends Controller
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


   private function getBeneficiaries()
{
    return RegisterBeneficiary2::latest()->get();
}

public function registerBeneficiary(Request $request)
{
    if ($request->isMethod('post')) {
        try {
            // Validate the request
            $validated = $request->validate([
                'mobile' => 'required|string',
                'benename' => 'required|string',
                'bankid' => 'required|string',
                'accno' => 'required|string',
                'ifsccode' => 'required|string',
                'verified' => 'required|string',
            ]);

            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);

            // Log the request for debugging
            Log::info('Sending API request to register beneficiary', [
                'request_data' => $request->all(),
                'request_id' => $requestId
            ]);

            $response = Http::withHeaders([
                'Token' => $jwtToken,
                'accept' => 'application/json',
                'Content-Type' => 'application/json',
                'User-Agent' => $this->partnerId
            ])->post('https://api.paysprint.in/api/v1/service/dmt-v2/beneficiary/registerbeneficiary', [
                'mobile' => $request->mobile,
                'benename' => $request->benename,
                'bankid' => $request->bankid,
                'accno' => $request->accno,
                'ifsccode' => $request->ifsccode,
                'verified' => $request->verified,
            ]);

            // Log the response for debugging
            Log::info('API response received', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $responseData = $response->json();

            // Check if the API call was successful
            if ($response->successful() && isset($responseData['data'])) {
                // Create record in database
                RegisterBeneficiary2::create([
                    'bene_id' => $responseData['data']['bene_id'] ?? null,
                    'bankid' => $responseData['data']['bankid'] ?? null,
                    'bankname' => $responseData['data']['bankname'] ?? null,
                    'name' => $responseData['data']['name'] ?? null,
                    'accno' => $responseData['data']['accno'] ?? null,
                    'ifsc' => $responseData['data']['ifsc'] ?? null,
                    'verified' => isset($responseData['data']['verified']) ? $responseData['data']['verified'] === '1' : false,
                    'banktype' => $responseData['data']['banktype'] ?? null,
                    'status' => $responseData['data']['status'] ?? null,
                    'bank3' => $responseData['data']['bank3'] ?? false,
                    'message' => $responseData['message'] ?? null,
                ]);

                return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
                    'success' => true,
                    'response' => $responseData,
                    'beneficiaries' => $this->getBeneficiaries(),
                ]);
            } else {
                // Handle API error
                Log::error('API returned unsuccessful response', [
                    'response' => $responseData,
                    'status' => $response->status()
                ]);

                return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
                    'success' => false,
                    'response' => $responseData,
                    'error' => $responseData['message'] ?? 'Failed to register beneficiary. Please try again.',
                    'beneficiaries' => $this->getBeneficiaries(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error registering beneficiary: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
                'success' => false,
                'response' => [],
                'error' => 'Failed to register beneficiary: ' . $e->getMessage(),
                'beneficiaries' => $this->getBeneficiaries(),
            ]);
        }
    }

    return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
        'beneficiaries' => $this->getBeneficiaries(),
    ]);
}



public function fetchBeneficiary(Request $request)
{
    $mobile = $request->input('mobile');
    $beneficiaries = []; // Initialize empty array
    $error = null;
    
    if ($mobile) {
        try {
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);
            
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Token' => $jwtToken,
                'accept' => 'application/json',
                'User-Agent' => $this->partnerId
            ])->post('https://api.paysprint.in/api/v1/service/dmt-v2/beneficiary/registerbeneficiary/fetchbeneficiary', [
                'mobile' => $mobile,
            ]);
            
            $responseData = $response->json();
            
            if ($response->successful() && isset($responseData['status']) && $responseData['status'] === true && !empty($responseData['data'])) {
                // Clear existing beneficiaries for this mobile if needed
                // FetchBeneficiary::where('mobile', $mobile)->delete();
                
                foreach ($responseData['data'] as $beneficiary) {
                    FetchBeneficiary::updateOrCreate(
                        ['bene_id' => $beneficiary['bene_id']], // Unique identifier
                        [
                            'mobile' => $mobile, // Store the mobile number to filter later
                            'bankid' => $beneficiary['bankid'] ?? '',
                            'bankname' => $beneficiary['bankname'] ?? '',
                            'name' => $beneficiary['name'] ?? '',
                            'accno' => $beneficiary['accno'] ?? '',
                            'ifsc' => $beneficiary['ifsc'] ?? '',
                            'verified' => isset($beneficiary['verified']) && $beneficiary['verified'] === "1",
                            'banktype' => $beneficiary['banktype'] ?? '',
                            'paytm' => isset($beneficiary['paytm']) ? $beneficiary['paytm'] : false,
                        ]
                    );
                }
                
                // Get only beneficiaries for this mobile number
                $beneficiaries = FetchBeneficiary::where('mobile', $mobile)->get();
            } else {
                // API returned failure or empty data
                $errorMsg = $responseData['message'] ?? 'No beneficiaries found for this mobile number';
                $error = $errorMsg;
            }
        } catch (\Exception $e) {
            Log::error('Error fetching beneficiary: ' . $e->getMessage());
            $error = 'Failed to fetch beneficiary: ' . $e->getMessage();
        }
    }
    
    return Inertia::render('Admin/beneficiary2/fetchBeneficiary', [
        'beneficiaryData' => $beneficiaries,
        'mobile' => $mobile,
        'error' => $error,
    ]);
}


    public function deleteBeneficiary()
    {
        return Inertia::render('Admin/beneficiary2/deleteBeneficiary');
    }

    public function destroyBeneficiary(Request $request)
    {
        $validated = $request->validate([
            'mobile' => 'required|digits:10',
            'bene_id' => 'required|string'
        ]);

        try {
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Token' => $jwtToken, 
                'User-Agent' => $this->partnerId
            ])->post('https://api.paysprint.in/api/v1/service/dmt-v2/beneficiary/registerbeneficiary/deletebeneficiary', [
                'mobile' => $validated['mobile'],
                'bene_id' => $validated['bene_id']
            ]);

            $responseData = $response->json();

            // Store the response in the database
            BeneficiaryDeletion::create([
                'mobile' => $validated['mobile'],
                'bene_id' => $validated['bene_id'],
                'status' => $responseData['status'] ?? false,
                'response_code' => $responseData['response_code'] ?? null,
                'message' => $responseData['message'] ?? 'No message provided'
            ]);

            // Instead of redirecting, return an Inertia response
            return Inertia::render('Admin/beneficiary2/deleteBeneficiary', [
                'flash' => [
                    'status' => $responseData['status'] ?? false,
                    'response_code' => $responseData['response_code'] ?? null,
                    'message' => $responseData['message'] ?? 'No message provided'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error in deleteBeneficiary', ['error' => $e->getMessage()]);

            return Inertia::render('Admin/beneficiary2/deleteBeneficiary', [
                'flash' => [
                    'status' => false,
                    'message' => 'An error occurred: ' . $e->getMessage()
                ]
            ]);
        }
    }

    public function getDeletionHistory()
    {
        $history = BeneficiaryDeletion::latest()->get();
        return response()->json($history);
    }
    public function fetchbyBenied()
    {
        return Inertia::render('Admin/beneficiary2/fetchbyBenied');
    }

    public function fetchBeneficiaryData(Request $request)
    {
        $request->validate([
            'mobile' => 'required|string|size:10',
            'beneid' => 'required|string'
        ]);

        try {
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Token' => $jwtToken, 
                'accept' => 'application/json',
                'User-Agent' => $this->partnerId
            ])->post('https://api.paysprint.in/api/v1/service/dmt-v2/beneficiary/registerbeneficiary/fetchbeneficiarybybeneid', [
                'mobile' => $request->mobile,
                'beneid' => $request->beneid
            ]);

            $responseData = $response->json();

            // Store data in database if the API call was successful
            if (!empty($responseData['data']) && is_array($responseData['data'])) {
                foreach ($responseData['data'] as $beneficiary) {
                    FetchbyBenied::updateOrCreate(
                        [
                            'mobile' => $request->mobile,
                            'bene_id' => $beneficiary['bene_id']
                        ],
                        [
                            'bank_id' => $beneficiary['bankid'] ?? null,
                            'bank_name' => $beneficiary['bankname'] ?? null,
                            'name' => $beneficiary['name'] ?? null,
                            'account_number' => $beneficiary['accno'] ?? null,
                            'ifsc' => $beneficiary['ifsc'] ?? null,
                            'verified' => isset($beneficiary['verified']) ? (bool)$beneficiary['verified'] : false,
                            'bank_type' => $beneficiary['banktype'] ?? null
                        ]
                    );
                }
            }

            return response()->json($responseData);
        } catch (\Exception $e) {
            Log::error('Error in fetchBeneficiaryData', ['error' => $e->getMessage()]);

            return response()->json([
                'error' => 'Failed to fetch beneficiary data',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
