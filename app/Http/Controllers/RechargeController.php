<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RechargeTransaction;
use App\Models\RechargeOperator;
use App\Models\ApiManagement;
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
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Generate reference ID using helper
            $referenceId = \App\Helpers\ApiHelper::generateReferenceId();

            // Prepare payload for dynamic API call
            $payload = [
                'operator' => (int)$request->operator,
                'canumber' => $request->canumber,
                'amount' => (int)$request->amount,
                'referenceid' => $referenceId
            ];

            // Call the API
            $responseData = $this->callDynamicApi('DoRecharge', $payload);

            // Store transaction in database
            $transaction = RechargeTransaction::create([
                'operator' => $request->operator,
                'canumber' => $request->canumber,
                'amount' => $request->amount,
                'referenceid' => $referenceId,
                'status' => $responseData['status'] ?? 'failed',
                'message' => $responseData['message'] ?? 'Transaction processed',
                'response_code' => $responseData['response_code'] ?? '',
                'operatorid' => $responseData['operatorid'] ?? '',
                'ackno' => $responseData['ackno'] ?? ''
            ]);

            Log::info('Transaction created successfully:', $transaction->toArray());

            return response()->json($responseData);
        } catch (\Exception $e) {
            Log::error('Recharge processing failed: ' . $e->getMessage());

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
    
            // Call the RechargeStatus API dynamically
            $responseData = $this->callDynamicApi('RechargeStatus', [
                'referenceid' => $request->referenceid
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
            // Call the GetOperator API dynamically
            $responseData = $this->callDynamicApi('GetOperator');

            // Save to database if the API call is successful
            if (isset($responseData['status']) && $responseData['status'] === true) {
                $this->saveOperatorsToDatabase($responseData['data']);
            }

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
