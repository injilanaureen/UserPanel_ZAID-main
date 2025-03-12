<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;
use App\Models\MunicipalityOperator;
use App\Models\MunicipalityBill;
use App\Models\MunicipalityPayBill;
use App\Http\Controllers\Jwt; 
use App\Models\MunicipalityTransaction;


class MunicipalityController extends Controller
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

    public function store(Request $request)
        {
            $request->validate([
                'id' => 'required|string', // ✅ ID ko string format me validate kiya
                'name' => 'required|string',
                'category' => 'nullable|string',
               'displayname' => 'required|string', // If displayname is mandatory
                'regex' => 'nullable|string',
                'viewbill' => 'nullable|string',
                'ad1_d_name' => 'nullable|string',
                'ad1_name' => 'nullable|string',
                'ad1_regex' => 'nullable|string',
            ]);
        
            $municipality = MunicipalityOperator::create($request->all());
        
            return response()->json(['message' => 'Saved successfully', 'data' => $municipality], 201);
        }

    public function showMunicipalityOperator()
        {
            try {
                // Fetch all municipality operators
                $municipalities = MunicipalityOperator::all();
        
                return response()->json([
                    'municipalities' => $municipalities,
                    'message' => 'Municipality operators fetched successfully!'
                ]);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Error fetching municipality operators', 'error' => $e->getMessage()], 500);
            }
        }   
        
    public function MunicipalityOperator()
    {
        $municipalities = MunicipalityOperator::select('id', 'name')->get(); // Fetch id & name

        return Inertia::render('Admin/Municipality/MunicipalityOperator', [
            'municipalities' => $municipalities
        ]);
    }

    
    public function fetchMunicipalityOperator(Request $request)
    {
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        $mode = $request->input('mode'); // Get mode from user input

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'accept'=>'application/json',
            'Token' => $jwtToken
        ])->post('https://api.paysprint.in/api/v1/service/bill-payment/municipality/getoperator', [
            'mode' => $mode
        ]);

        return response()->json($response->json());
    }

    public function FetchMunicipalityDetails()
    {
        return Inertia::render('Admin/Municipality/FetchMunicipalityDetails');
    }

    public function fetchBillDetails(Request $request)
    {
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);


        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Token' => $jwtToken,
                'accept' => 'application/json',
            ])->post('https://api.paysprint.in/api/v1/service/bill-payment/municipality/fetchbill', [
                'canumber' => $request->canumber,
                'operator' => $request->operator
            ]);

            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch bill details',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function storeBillDetails(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'amount' => 'required|integer',
            'response_code' => 'required|integer',
            'status' => 'required|boolean',
            'message' => 'required|string',
        ]);
    
        $bill = MunicipalityBill::create($validatedData);
    
        return response()->json([
            'message' => 'Bill details saved successfully!',
            'bill' => $bill
        ]);
    }

    public function showMunicipalityBill()
    {
        return Inertia::render('Admin/Municipality/MunicipalityBill');
    }

    
    public function PayMunicipalityBill(Request $request)
    {
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);
    
        // Validate user input
        $validatedData = $request->validate([
            'canumber' => 'required|numeric',
            'operator' => 'required',
            'amount' => 'required|numeric',
            'ad1' => 'required|integer',
            'ad2' => 'required|integer',
            'ad3' => 'required|numeric',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);
        
        // Inject dynamically generated referenceId
        $validatedData['referenceid'] = $referenceId;
        
        // Default coordinates if not provided
        $validatedData['latitude'] = $validatedData['latitude'] ?? 28.65521;
        $validatedData['longitude'] = $validatedData['longitude'] ?? 77.14343;
    
        // Make API request
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Token' => $jwtToken,
            'accept' => 'application/json',
        ])->post('https://api.paysprint.in/api/v1/service/bill-payment/municipality/paybill', $validatedData);
    
        $responseData = $response->json();
    
        // Save to database with all required fields
        MunicipalityPayBill::create([
            'canumber' => $validatedData['canumber'],
            'operator' => $validatedData['operator'],
            'amount' => $validatedData['amount'],
            'ad1' => $validatedData['ad1'],
            'ad2' => $validatedData['ad2'],
            'ad3' => $validatedData['ad3'],
            'referenceid' => $validatedData['referenceid'],
            'latitude' => $validatedData['latitude'],
            'longitude' => $validatedData['longitude'],
            'ackno' => $responseData['ackno'] ?? null,
            'operatorid' => $responseData['operatorid'] ?? null,
            'message' => $responseData['message'] ?? null,
            'response_code' => $responseData['response_code'] ?? null,
            'status' => $responseData['status'] ?? false,
        ]);
    
        // Return JSON response
        return response()->json([
            'message' => 'Payment processed successfully',
            'data' => $responseData
        ], 200);
    }
    
    public function MunicipalityStatus()
    {
        return Inertia::render('Admin/Municipality/MunicipalityStatus');
    }

    public function MunicipalityEnquiryStatus(Request $request)
    {
        // Validate input
        $request->validate([
            'referenceid' => 'required|string',
        ]);

        $referenceId = $request->input('referenceid');

        // API request
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
            'accept' => 'application/json',
            'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I='
        ])->post('https://sit.paysprint.in/service-api/api/v1/service/bill-payment/municipality/status', [
            'referenceid' => $referenceId,
        ]);
        $responseData = $response->json();

        // Check if response contains valid data
        if ($responseData['status'] && isset($responseData['data'])) {
            $data = $responseData['data'];
    
            // Save data to database
            MunicipalityTransaction::create([
                'txnid' => $data['txnid'],
                'operatorname' => $data['operatorname'],
                'canumber' => $data['canumber'],
                'amount' => $data['amount'],
                'comm' => isset($data['comm']) ? $data['comm'] : 0.00, // Default to 0 if null
                'tds' => $data['tds'],
                'status' => $data['status'],
                'refid' => $data['refid'],
                'operatorid' => $data['operatorid'],
                'dateadded' => $data['dateadded'],
                'refunded' => $data['refunded'],
                'refundtxnid' => isset($data['refundtxnid']) ? $data['refundtxnid'] : null,
                'daterefunded' => isset($data['daterefunded']) ? $data['daterefunded'] : null,
            ]);
            
        }
        return response()->json($response->json());
    }
}
