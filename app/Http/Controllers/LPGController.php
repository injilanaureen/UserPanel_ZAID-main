<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\LpgOperator;
use App\Models\LpgBillDetail;
use App\Models\LPGSTatus;
use App\Models\JwtToken;
use App\Models\LPGPayBillResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Jwt; 
class LPGController extends Controller
{
    private $partnerId = 'PS005962'; 
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

    // Method to generate JWT token
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
            'HS256' // Using HMAC SHA-256 algorithm
        );
    }


    public function LPGOperator(){
        return Inertia::render('Admin/LPG/LPGOperator');
    }
    public function fetchLPGOperator(Request $request)
    {
        // Generate unique reference ID
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        $response = Http::withHeaders([
            'Token' => $jwtToken,
            'Content-Type' => 'application/json',
            'accept' => 'text/plain',
            'Content-Type' => 'application/json',
            'User-Agent' => $this->partnerId
        ])->post('https://api.paysprint.in/api/v1/service/bill-payment/lpg/getoperator', [
            'mode' => $request->mode
        ]);

        $data = $response->json();

        if (isset($data['data'])) {
            foreach ($data['data'] as $item) {
                LPGOperator::updateOrCreate(
                    ['id' => $item['id']],
                    [
                        'name' => $item['name'],
                        'category' => $item['category'],
                        'viewbill' => $item['viewbill'],
                        'regex' => $item['regex'] ?? null,
                        'displayname' => $item['displayname'] ?? null,
                        'ad1_d_name' => $item['ad1_d_name'] ?? null,
                        'ad1_name' => $item['ad1_name'] ?? null,
                        'ad1_regex' => $item['ad1_regex'] ?? null,
                        'ad2_d_name' => $item['ad2_d_name'] ?? null,
                        'ad2_name' => $item['ad2_name'] ?? null,
                        'ad2_regex' => $item['ad2_regex'] ?? null,
                        'ad3_d_name' => $item['ad3_d_name'] ?? null,
                        'ad3_name' => $item['ad3_name'] ?? null,
                        'ad3_regex' => $item['ad3_regex'] ?? null,
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'LPG Operators data fetched and stored successfully',
            'data' => LPGOperator::all()
        ]);
    }
    

    
    public function FetchLPGDetails(Request $request)
    {
        // Generate unique reference ID
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);
    
        // If no input, just load the page with operators
        if (!$request->has('operator') || !$request->has('canumber')) {
            $operators = LPGOperator::select('id', 'name', 'displayname', 'ad1_d_name', 'ad2_d_name', 'ad3_d_name')
                ->orderBy('name')
                ->get();
    
            return Inertia::render('Admin/LPG/FetchLPGDetails', [
                'lpgData' => null,
                'operators' => $operators
            ]);
        }
    
        $response = Http::withHeaders([
            'Token' => $jwtToken,
            'Content-Type' => 'application/json',
            'accept' => 'application/json',
            'User-Agent' => $this->partnerId
        ])->post('https://api.paysprint.in/api/v1/service/bill-payment/lpg/fetchbill', [
            'operator' => $request->input('operator'),
            'canumber' => $request->input('canumber'),
            'referenceid' => $referenceId,
            'latitude' => '28.65521',
            'longitude' => '77.14343',
            'ad1' => $request->input('ad1'),
            'ad2' => $request->input('ad2'),
            'ad3' => $request->input('ad3'),
            'ad4' => $request->input('ad4')
        ]);
    
        $apiResponse = $response->json();
    
        LpgBillDetail::create([
            'operator' => $request->input('operator'),
            'canumber' => $request->input('canumber'),
            'referenceid' => $referenceId,
            'latitude' => '28.65521',
            'longitude' => '77.14343',
            'ad1' => $request->input('ad1'),
            'ad2' => $request->input('ad2'),
            'ad3' => $request->input('ad3'),
            'ad4' => $request->input('ad4'),
            'response_code' => $apiResponse['response_code'] ?? null,
            'status' => $apiResponse['status'] ?? 'Failed',
            'amount' => $apiResponse['amount'] ?? 0.00,
            'name' => $apiResponse['name'] ?? 'N/A',
            'message' => $apiResponse['message'] ?? 'No message'
        ]);
    
        // Load operators for dropdown (for after submission)
        $operators = LPGOperator::select('id', 'name', 'displayname', 'ad1_d_name', 'ad2_d_name', 'ad3_d_name')
            ->orderBy('name')
            ->get();
    
        return Inertia::render('Admin/LPG/FetchLPGDetails', [
            'lpgData' => $apiResponse,
            'operators' => $operators
        ]);
    }
    
    

    public function LPGBill(){
        return Inertia::render('Admin/LPG/LPGPayBill');
    }
    public function payLpgBill(Request $request)
    {
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        // Validate request data
        $request->validate([
            'canumber'    => 'required|string',
            'referenceid' => 'required|string',
            'amount'      => 'required|numeric',
            'operator'    => 'required|string',
        ]);
    
        // Make API request
        $response = Http::withHeaders([
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
            'Token' => $jwtToken,
            'User-Agent' => $this->partnerId
        ])->post('https://api.paysprint.in/api/v1/service/bill-payment/lpg/paybill', [
            "canumber"    => $request->canumber,
            "referenceid" => $request->referenceid,
            "amount"      => $request->amount,
            "operator"    => $request->operator,
            "ad1"         => 22,
            "ad2"         => 458,
            "ad3"         => 16336200,
            "latitude"    => 27.2232,
            "longitude"   => 78.26535
        ]);
    
        $responseData = $response->json();
    
        // Store response data in the database
        $billResponse = LPGPayBillResponse::create([
            'canumber'    => $request->canumber,
            'operator'    => $request->operator,
            'amount'      => $request->amount,
            'ad1'         => 22,
            'ad2'         => 458,
            'ad3'         => 16336200,
            'referenceid' => $request->referenceid,
            'latitude'    => 27.2232,
            'longitude'   => 78.26535,
            'operatorid'  => $responseData['operatorid'] ?? null,
            'status'      => $responseData['status'] ?? 'Failed',
            'ackno'       => $responseData['ackno'] ?? null,
            'message'     => $responseData['message'] ?? 'No response message',
        ]);
    
        // Return stored data as JSON
        return response()->json($billResponse);
    }
// In LPGController.php
public function getLpgBillHistory()
{
    $transactions = LPGPayBillResponse::orderBy('created_at', 'desc')->get();
    return response()->json($transactions);
}


    public function LPGStatus() {
        return Inertia::render('Admin/LPG/LPGStatus');
    }
    public function getLPGStatus(Request $request)
    {
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);
        try {
            // Validate the request
            $validated = $request->validate([
                'referenceid' => 'required|string|max:255'
            ]);

            $referenceId = $validated['referenceid'];

            // API configuration
            $apiUrl = "https://api.paysprint.in/api/v1/service/bill-payment/lpg/status";


            // Make API request
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Token' => $jwtToken,
                'Accept' => 'application/json',
                'User-Agent' => $this->partnerId
            ])->post($apiUrl, [
                'referenceid' => $referenceId
            ]);

            // Log the API response for debugging
            Log::info('LPG API Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            $responseData = $response->json();

            // Check if we have a valid response
            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . ($responseData['message'] ?? 'Unknown error'));
            }

            // Process and store the data
            $statusData = [
                'reference_id' => $referenceId,
                'txnid' => $responseData['data']['txnid'] ?? null,
                'operator_name' => $responseData['data']['operatorname'] ?? null,
                'customer_number' => $responseData['data']['canumber'] ?? null,
                'amount' => $responseData['data']['amount'] ?? 0,
                'tds' => $responseData['data']['tds'] ?? 0,
                'operator_id' => $responseData['data']['operatorid'] ?? null,
                'refid' => $responseData['data']['refid'] ?? null,
                'date_added' => $responseData['data']['dateadded'] ?? now(),
                'refunded' => isset($responseData['data']['refunded']) ? $responseData['data']['refunded'] === "1" : false,
                'date_refunded' => $responseData['data']['daterefunded'] ?? null,
                'message' => $responseData['message'] ?? null
            ];

            // Update or create the record
            LpgStatus::updateOrCreate(
                ['reference_id' => $referenceId],
                $statusData
            );

            return response()->json($responseData);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('LPG Status Validation Error', ['errors' => $e->errors()]);
            return response()->json([
                'status' => false,
                'message' => 'Invalid input provided',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('LPG Status Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while processing your request. Please try again.'
            ], 500);
        }
    }
   
    
    
}
