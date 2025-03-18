<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FastagOperatorList;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Http\Controllers\Jwt; 
class FastagRechargeController extends Controller
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


    public function getOperators()
{
    $operators = FastagOperatorList::all(['operator_id', 'name']);
    return response()->json($operators);
}

    public function fastagRechargeOperatorList()
    {
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);
        // Call the external API
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'accept' => 'application/json',
            'Token' => $jwtToken,
            'User-Agent' => $this->partnerId
        ])->post('https://api.paysprint.in/api/v1/service/fastag/Fastag/operatorsList');
    
        $apiResponse = $response->json();
    
        if (isset($apiResponse['data'])) {
            foreach ($apiResponse['data'] as $operator) {
                FastagOperatorList::updateOrCreate(
                    ['operator_id' => $operator['id']], // Check existing records based on operator_id
                    [
                        'operator_id' => $operator['id'], // Add operator_id field
                        'name' => $operator['name'],
                        'category' => $operator['category'],
                        'viewbill' => $operator['viewbill'] ?? null,
                        'displayname' => $operator['displayname'],
                        'regex' => $operator['regex'] ?? null,
                        'ad1_regex' => $operator['ad1_regex'] ?? null,
                    ]
                );
            }
        }
        $operators = FastagOperatorList::all();

        return Inertia::render('Admin/FastagRecharge/FastagOperatorList', [
            'operators' => FastagOperatorList::all()
        ]);
    }
    
    public function fetchConsumerDetails()
    {
        $operators = FastagOperatorList::all();
        return Inertia::render('Admin/FastagRecharge/FastagFetchConsumerDetails');
    }
    public function getConsumerDetails(Request $request)
    {
        $validated = $request->validate([
            'operator' => 'required|integer',
            'canumber' => 'required|string'
        ]);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=', 
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M' // Store securely
        ])->post('https://sit.paysprint.in/service-api/api/v1/service/fastag/Fastag/fetchConsumerDetails', [
            'operator' => $validated['operator'],
            'canumber' => $validated['canumber']
        ]);

        return response()->json($response->json());
    }




    public function FastagRecharge(){
        return Inertia::render('Admin/FastagRecharge/FastagRecharge');
    }



    public function FastagStatus(){
        return Inertia::render('Admin/FastagRecharge/FastagStatus');
    }
}
