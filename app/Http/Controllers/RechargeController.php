<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RechargeTransaction;
use App\Models\RechargeOperator;
use App\Models\JwtToken;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Jwt; 
class RechargeController extends Controller
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

    public function dorecharge()
    {
        return Inertia::render('Admin/Recharge/dorecharge');
    }
    

    
    public function processRecharge(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'operator' => 'required|numeric',
                'canumber' => 'required|string',
                'amount' => 'required|numeric|min:1'
                // 'referenceid' => 'required|string',
            ]);
            
            if ($validator->fails()) {
                Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            // Generate unique reference ID
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);


            $apiResponse = Http::withHeaders([
                'Token' => $jwtToken,
                'accept' => 'text/plain',
                'Content-Type' => 'application/json',
                'User-Agent' => $this->partnerId
            ])->post('https://api.paysprint.in/api/v1/service/recharge/recharge/dorecharge', [
                'operator' => (int)$request->operator,
                'canumber' => $request->canumber,
                'amount' => (int)$request->amount,
                'referenceid' => $referenceId
            ]);
            
            $responseData = $apiResponse->json();
            
            // Store transaction in database
            $transaction = RechargeTransaction::create([
                'operator' => $request->operator,
                'canumber' => $request->canumber,
                'amount' => $request->amount,
                'referenceid' => $referenceId,
                'jwt_token' => $jwtToken,
                'status' => isset($responseData['status']) && $responseData['status'] ? 'success' : 'failed',
                'message' => $responseData['message'] ?? 'Transaction processed',
                'response_code' => $responseData['response_code'] ?? '',
                'operatorid' => $responseData['operatorid'] ?? '',
                'ackno' => $responseData['ackno'] ?? ''
            ]);
            // Store JWT token in the jwt_tokens table
        $jwtTokenRecord = JwtToken::create([
            'transaction_id' => $transaction->id,
            'jwt_token' => $jwtToken,
        ]);
        Log::info('Transaction created successfully:', $transaction->toArray());
        Log::info('JWT Token stored successfully:', $jwtTokenRecord->toArray());
            
            // Return API response to frontend
            return response()->json($responseData);
            
        } catch (\Exception $e) {
            Log::error('Recharge processing failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Failed to process recharge: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function updateTransaction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'referenceid' => 'required|string',
                'status' => 'required|string',
                'message' => 'required|string'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $transaction = RechargeTransaction::where('referenceid', $request->referenceid)
                ->first();
            
            if (!$transaction) {
                return response()->json([
                    'status' => false,
                    'message' => 'Transaction not found'
                ], 404);
            }
            
            $transaction->update([
                'status' => $request->status,
                'response_code' => $request->response_code ?? null,
                'message' => $request->message
            ]);
            
            return response()->json([
                'status' => true,
                'message' => 'Transaction updated successfully',
                'data' => $transaction
            ]);
        } catch (\Exception $e) {
            Log::error('Transaction update failed: ' . $e->getMessage());
            
            return response()->json([
                'status' => false,
                'message' => 'Failed to update transaction: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTransactions()
    {
        try {
            $transactions = RechargeTransaction::orderBy('created_at', 'desc')->paginate(10);
            
            return Inertia::render('Admin/Recharge/Transactions', [
                'transactions' => $transactions
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch transactions: ' . $e->getMessage());
            
            return back()->withErrors(['message' => 'Failed to fetch transactions']);
        }
    }
    //status
    public function recharge2()
    {
        return Inertia::render('Admin/Recharge/Recharge2');
    }
    public function fetchRechargeStatus(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'referenceid' => 'required|string'
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
    
            // Generate unique request ID and JWT token
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);
    
            $response = Http::withHeaders([
                'Token' => $jwtToken,
                'accept' => 'application/json',
                'content-type' => 'application/json',
                'User-Agent' => $this->partnerId
            ])->post('https://api.paysprint.in/api/v1/service/recharge/recharge/status', [
                'referenceid' => $request->referenceid
            ]);
    
            $responseData = $response->json();
    
            // Log the status check
            Log::info('Recharge status checked:', [
                'referenceid' => $request->referenceid,
                'jwt_token' => $jwtToken,
                'response' => $responseData
            ]);
    
            return response()->json($responseData);
    
        } catch (\Exception $e) {
            Log::error('Failed to fetch recharge status: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch recharge status: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getRechargeTransactions()
{
    try {
        // Fetch all transactions from the database
        $transactions = DB::table('recharge_transactions')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'transactions' => $transactions
        ]);
    } catch (\Exception $e) {
        Log::error('Failed to fetch recharge transactions: ' . $e->getMessage());
        return response()->json([
            'status' => false,
            'message' => 'Failed to fetch recharge transactions: ' . $e->getMessage()
        ], 500);
    }
}
  
    public function manageOperator()
    {
        return Inertia::render('Admin/Recharge/ManageOperator');
    }
    public function getOperators()
    {
        try {
            // Generate unique request ID and JWT token
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);
    
            $url = 'https://api.paysprint.in/api/v1/service/recharge/recharge/getoperator';
            $headers = [
                'Token: ' . $jwtToken,
                'accept: application/json',
                'User-Agent: ' . $this->partnerId,
                'Content-Type: application/json'
            ];
    
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_HTTPHEADER => $headers,
            ]);
    
            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);
    
            if ($err) {
                Log::error('Error fetching operators: ' . $err);
                return response()->json([
                    'success' => false,
                    'message' => 'Error fetching operators',
                    'error' => $err
                ], 500);
            }
    
            // Decode the response
            $responseData = json_decode($response, true);
    
            // Save to database if the API call is successful
            if (isset($responseData['status']) && $responseData['status'] === true) {
                $this->saveOperatorsToDatabase($responseData['data']);
            }
    
            Log::info('Operators fetched successfully', [
                'jwt_token' => $jwtToken,
                'response_status' => $responseData['status'] ?? 'unknown'
            ]);
    
            return response()->json($responseData);
    
        } catch (\Exception $e) {
            Log::error('Failed to fetch operators: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch operators: ' . $e->getMessage()
            ], 500);
        }
    }
private function saveOperatorsToDatabase($operators)  
{    
  // Clear existing records    
  \App\Models\RechargeOperator::truncate();        
       foreach ($operators as $operator) {       
   \App\Models\RechargeOperator::create([         
     'operator_name' => $operator['name'],        
      'service_name' => $operator['category'],   
           'date' => now()->format('Y-m-d')      
    ]); 
     }  
}
}
