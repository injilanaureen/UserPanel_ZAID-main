<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RegisterBeneficiary2;
use App\Models\FetchBeneficiary;
use App\Models\BeneficiaryDeletion;
use App\Models\FetchbyBenied;
use App\Models\ApiManagement;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Jwt; 
use App\Helpers\ApiHelper;

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

        return Jwt::encode($payload, $this->secretKey, 'HS256');
    }

 // Dynamic API caller method
  // gets api url from our apimanagement db tabke based on $apiName
  private function callDynamicApi($apiName, $payload = [], $additionalHeaders = [])
  {
      try {
         //to get api response from db 
          $apiDetails = ApiManagement::where('api_name', $apiName)->first();
 
          if (!$apiDetails) {
              throw new \Exception("API not found for name: {$apiName}");
          }
 
          // Generate unique request ID and JWT token
          $requestId = time() . rand(1000, 9999);
          $jwtToken = $this->generateJwtToken($requestId);
          // Prepare headers
          $headers = ApiHelper::getApiHeaders($jwtToken, $additionalHeaders, $this->partnerId);
          // Make the API call
          $response = Http::withHeaders($headers)
              ->post($apiDetails->api_url, $payload);
 
          // Log the API call
          Log::info('Dynamic API Call', [
              'api_name' => $apiName,
              'url' => $apiDetails->api_url,
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

   private function getBeneficiaries()
{
    return RegisterBeneficiary2::latest()->get();
}

public function registerBeneficiary(Request $request)
    {
        if ($request->isMethod('post')) {
            try {
                $validator = Validator::make($request->all(), [
                    'mobile' => 'required|string',
                    'benename' => 'required|string',
                    'bankid' => 'required|string',
                    'accno' => 'required|string',
                    'ifsccode' => 'required|string',
                    'verified' => 'required|string',
                ]);

                if ($validator->fails()) {
                    return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
                        'success' => false,
                        'error' => 'Validation failed',
                        'errors' => $validator->errors(),
                        'beneficiaries' => $this->getBeneficiaries(),
                    ]);
                }

                $payload = [
                    'mobile' => $request->mobile,
                    'benename' => $request->benename,
                    'bankid' => $request->bankid,
                    'accno' => $request->accno,
                    'ifsccode' => $request->ifsccode,
                    'verified' => $request->verified,
                ];

                $responseData = $this->callDynamicApi('Dmt2registerbeneficiary', $payload);

                if (isset($responseData['status']) && $responseData['status'] === true && isset($responseData['data'])) {
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
                    return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
                        'success' => false,
                        'response' => $responseData,
                        'error' => $responseData['message'] ?? 'Failed to register beneficiary',
                        'beneficiaries' => $this->getBeneficiaries(),
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Error registering beneficiary: ' . $e->getMessage());
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
        $beneficiaries = [];
        $error = null;

        if ($mobile) {
            try {
                $payload = ['mobile' => $mobile];
                $responseData = $this->callDynamicApi('Dmt2fetchbeneficiary', $payload);

                if (isset($responseData['status']) && $responseData['status'] === true && !empty($responseData['data'])) {
                    foreach ($responseData['data'] as $beneficiary) {
                        FetchBeneficiary::updateOrCreate(
                            ['bene_id' => $beneficiary['bene_id']],
                            [
                                'mobile' => $mobile,
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
                    $beneficiaries = FetchBeneficiary::where('mobile', $mobile)->get();
                } else {
                    $error = $responseData['message'] ?? 'No beneficiaries found for this mobile number';
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
        $validator = Validator::make($request->all(), [
            'mobile' => 'required|digits:10',
            'bene_id' => 'required|string'
        ]);

        if ($validator->fails()) {
            return Inertia::render('Admin/beneficiary2/deleteBeneficiary', [
                'flash' => [
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ]
            ]);
        }

        try {
            $payload = [
                'mobile' => $request->mobile,
                'bene_id' => $request->bene_id
            ];
            $responseData = $this->callDynamicApi('Dmt2deletebeneficiary', $payload);

            BeneficiaryDeletion::create([
                'mobile' => $request->mobile,
                'bene_id' => $request->bene_id,
                'status' => $responseData['status'] ?? false,
                'response_code' => $responseData['response_code'] ?? null,
                'message' => $responseData['message'] ?? 'No message provided'
            ]);

            return Inertia::render('Admin/beneficiary2/deleteBeneficiary', [
                'flash' => [
                    'status' => $responseData['status'] ?? false,
                    'response_code' => $responseData['response_code'] ?? null,
                    'message' => $responseData['message'] ?? 'No message provided'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error in deleteBeneficiary: ' . $e->getMessage());
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
        $validator = Validator::make($request->all(), [
            'mobile' => 'required|string|size:10',
            'beneid' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $payload = [
                'mobile' => $request->mobile,
                'beneid' => $request->beneid
            ];
            $responseData = $this->callDynamicApi('Dmt2fetchbeneficiarybybenied', $payload);

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
            Log::error('Error in fetchBeneficiaryData: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch beneficiary data',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
