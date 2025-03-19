<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use App\Models\Remitter;
use App\Models\RemitterRegistration;
use App\Models\RemitterAadharVerify;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Jwt; 
use GuzzleHttp\Client;

class Remitter2Controller extends Controller
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

    public function showQueryForm()
    {
        return Inertia::render('Admin/remitter2/QueryRemitter');
    }

    public function queryRemitter(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'mobile' => 'required|digits:10'
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);

            $response = Http::withHeaders([
                'Token' => $jwtToken,
                'accept' => 'application/json',
                'Content-Type' => 'application/json',
                'User-Agent' => $this->partnerId
            ])->post('https://api.paysprint.in/api/v1/service/dmt-v2/remitter/queryremitter', [
                'mobile' => $request->input('mobile')
            ]);

            $responseData = $response->json();

            Log::info('Remitter query successful', [
                'mobile' => $request->input('mobile'),
                'jwt_token' => $jwtToken,
                'response_status' => $responseData['status'] ?? 'unknown'
            ]);

            return response()->json(['success' => true, 'data' => $responseData]);
        } catch (\Exception $e) {
            Log::error('Remitter query error: ' . $e->getMessage(), [
                'mobile' => $request->input('mobile') ?? 'unknown',
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['success' => false, 'message' => 'An error occurred while fetching remitter data'], 500);
        }
    }

    public function storeRemitterData(Request $request)
    {
        $request->validate([
            'mobile' => 'required|unique:remitters,mobile',
            'limit' => 'required|numeric',
        ]);

        $remitter = Remitter::create([
            'mobile' => $request->mobile,
            'limit' => $request->limit,
        ]);

        return response()->json(['success' => true, 'message' => 'Remitter data stored successfully', 'data' => $remitter]);
    }

    public function maskAadhaar($aadhaar)
    {
        return 'XXXX-XXXX-XXXX-' . substr($aadhaar, -4);
    }

    public function showRemitterAdhaarVerifyApi(Request $request)
    {
        return Inertia::render('Admin/remitter2/RemitterAdhaarVerifyApi', [
            'mobile' => $request->query('mobile'),
            'queryData' => $request->query('queryData'),
        ]);
    }

    public function verifyAadhaar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile' => 'required|digits:10',
            'aadhaar_no' => 'required|digits:12',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        try {
            $client = new Client();
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);

            $response = $client->post('https://api.paysprint.in/api/v1/service/dmt-v2/remitter/queryremitter/aadhar_verify', [
                'headers' => [
                    'Token' => $jwtToken,
                    'accept' => 'application/json',
                    'content-type' => 'application/json',
                ],
                'json' => [
                    'mobile' => $request->mobile,
                    'aadhaar_no' => $request->aadhaar_no,
                ],
            ]);

            $apiResponse = json_decode($response->getBody()->getContents(), true);
            $maskedAadhaar = $this->maskAadhaar($request->aadhaar_no);

            $verification = RemitterAadharVerify::create([
                'mobile' => $request->mobile,
                'masked_aadhaar' => $maskedAadhaar,
                'status' => $apiResponse['status'] ?? 'FAILED',
                'response_code' => $apiResponse['response_code'] ?? 'ERROR',
                'message' => $apiResponse['message'] ?? 'API call failed',
            ]);

            return Inertia::render('Admin/remitter2/RemitterAdhaarVerifyApi', [
                'apiData' => $apiResponse,
                'dbData' => $verification,
                'error' => null,
                'mobile' => $request->mobile, // Pass mobile back for redirection
            ]);
        } catch (\Exception $e) {
            Log::error('Aadhaar verification error: ' . $e->getMessage());
            return Inertia::render('Admin/remitter2/RemitterAdhaarVerifyApi', [
                'apiData' => null,
                'dbData' => null,
                'error' => 'Failed to verify Aadhaar: ' . $e->getMessage()
            ]);
        }
    }

    public function registerAdhaarRemitter(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile' => 'required|digits:10',
            'aadhaar_no' => 'required|digits:12',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            $apiResponse = $this->verifyAadhaarWithAPI($request->mobile, $request->aadhaar_no);
            $maskedAadhaar = $this->maskAadhaar($request->aadhaar_no);

            $verification = RemitterAadharVerify::create([
                'status' => $apiResponse['status'] ?? 'FAILED',
                'response_code' => $apiResponse['response_code'] ?? 'ERROR',
                'message' => $apiResponse['message'] ?? 'API call failed',
                'mobile' => $request->mobile,
                'masked_aadhaar' => $maskedAadhaar,
            ]);

            return response()->json([
                'status' => $apiResponse['status'] ?? 'FAILED',
                'message' => $apiResponse['message'] ?? 'Verification failed',
                'data' => $verification
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred during verification: ' . $e->getMessage()], 500);
        }
    }

    private function verifyAadhaarWithAPI($mobile, $aadhaar)
    {
        $client = new Client();
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        $response = $client->post('https://api.paysprint.in/api/v1/service/dmt-v2/remitter/queryremitter/aadhar_verify', [
            'headers' => [
               'Token' => $jwtToken,
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ],
            'json' => [
                'mobile' => $mobile,
                'aadhaar_no' => $aadhaar,
            ],
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function showVerificationForm()
    {
        return Inertia::render('Admin/remitter2/RemitterAdhaarVerifyApi', [
            'data' => null,
            'error' => null
        ]);
    }

    public function registerRemitter(Request $request)
    {
        if ($request->isMethod('post')) {
            try {
                $requestId = time() . rand(1000, 9999);
                $jwtToken = $this->generateJwtToken($requestId);

                $response = Http::withHeaders([
                    'Token' => $jwtToken,
                    'accept' => 'application/json',
                    'content-type' => 'application/json',
                    'User-Agent' => $this->partnerId
                ])->post('https://api.paysprint.in/api/v1/service/dmt-v2/remitter/registerremitter', $request->all());

                $responseData = $response->json();

                $status = $responseData['status'] ?? null;
                $message = $responseData['message'] ?? null;
                $limit = $responseData['data']['limit'] ?? null;
                $mobile = $responseData['data']['mobile'] ?? $request->mobile;

                $registration = RemitterRegistration::create([
                    'mobile' => $request->mobile,
                    'otp' => $request->otp,
                    'stateresp' => $request->stateresp,
                    'data' => $request->data,
                    'accessmode' => $request->accessmode,
                    'is_iris' => $request->is_iris,
                    'limit' => $limit,
                    'api_response' => $responseData,
                    'status' => $status,
                    'message' => $message,
                    'jwt_token' => $jwtToken
                ]);

                Log::info('Remitter registration successful', [
                    'mobile' => $request->mobile,
                    'jwt_token' => $jwtToken,
                    'status' => $status
                ]);

                return response()->json([
                    'data' => [
                        'mobile' => $mobile,
                        'limit' => $limit,
                        'status' => $status,
                        'message' => $message,
                        'registration_id' => $registration->id
                    ]
                ], $response->status());
            } catch (\Exception $e) {
                $registration = RemitterRegistration::create([
                    'mobile' => $request->mobile,
                    'otp' => $request->otp,
                    'stateresp' => $request->stateresp,
                    'data' => $request->data,
                    'accessmode' => $request->accessmode,
                    'is_iris' => $request->is_iris,
                    'limit' => null,
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'api_response' => ['error' => $e->getMessage()]
                ]);

                Log::error('Remitter registration failed: ' . $e->getMessage(), [
                    'mobile' => $request->mobile,
                    'trace' => $e->getTraceAsString()
                ]);

                return response()->json([
                    'error' => 'Failed to communicate with external API',
                    'message' => $e->getMessage()
                ], 500);
            }
        }

        $recentRegistrations = RemitterRegistration::latest()
            ->take(5)
            ->get()
            ->map(function ($registration) {
                return [
                    'id' => $registration->id,
                    'mobile' => $registration->mobile,
                    'status' => $registration->status,
                    'message' => $registration->message,
                    'accessmode' => $registration->accessmode,
                    'created_at' => $registration->created_at,
                    'limit' => $registration->limit,
                ];
            });

        return Inertia::render('Admin/remitter2/RegisterRemitter', [
            'recentRegistrations' => $recentRegistrations,
            'mobile' => $request->query('mobile'),
            'aadhaarData' => $request->query('aadhaarData'),
            'dbData' => $request->query('dbData'),
        ]);
    }

    public function getRegistrations()
    {
        $registrations = RemitterRegistration::latest()
            ->paginate(10)
            ->through(function ($registration) {
                return [
                    'id' => $registration->id,
                    'mobile' => $registration->mobile,
                    'status' => $registration->status,
                    'message' => $registration->message,
                    'accessmode' => $registration->accessmode,
                    'created_at' => $registration->created_at,
                    'limit' => $registration->limit,
                ];
            });

        return Inertia::render('Admin/remitter2/Registrations', [
            'registrations' => $registrations
        ]);
    }
}