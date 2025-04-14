<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RechargeTransaction;
use App\Models\RechargeOperator;
use App\Models\ApiManagement;
use App\Models\FundRequest;
use App\Models\JwtToken;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Jwt; 
use App\Helpers\ApiHelper;
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
    
            $user = $request->user();
            $amount = $request->input('amount');
            $referenceId = ApiHelper::generateReferenceId();
    
            // Calculate available balance
            $totalApproved = FundRequest::getAvailableBalance($user->id);
            $spentAmount = Transaction::where('user_id', $user->id)
                ->where('status', 'completed')
                ->where('type', 'debit')
                ->sum('amount');
            $remainingBalance = $totalApproved - $spentAmount;
    
            if ($amount > $remainingBalance) {
                return response()->json([
                    'status' => false,
                    'message' => 'Insufficient funds'
                ], 403);
            }
    
            // Prepare payload for API call
            $payload = [
                'operator' => (int)$request->operator,
                'canumber' => $request->canumber,
                'amount' => (int)$amount,
                'referenceid' => $referenceId
            ];
    
            // Call the DoRecharge API dynamically
            $apiName = 'DoRecharge';
            $requestId = ApiHelper::generateRequestId();
            $jwtToken = ApiHelper::generateJwtToken($requestId, $this->partnerId, $this->secretKey);
            
            // Get API URL from the database
            try {
                $apiUrl = ApiHelper::getApiUrl($apiName);
                
                // Validate URL format
                if (!filter_var($apiUrl, FILTER_VALIDATE_URL)) {
                    throw new \Exception("Invalid API URL format: $apiUrl");
                }
                
                // Log the URL for debugging
                Log::info("API URL being used:", ['url' => $apiUrl]);
                
            } catch (\Exception $e) {
                Log::error("API URL error: " . $e->getMessage());
                return response()->json([
                    'status' => false,
                    'message' => 'API configuration error: ' . $e->getMessage()
                ], 500);
            }
            
            // Prepare headers
            $headers = ApiHelper::getApiHeaders($jwtToken, [], $this->partnerId);
            
            // Convert headers array to cURL format
            $curlHeaders = [];
            foreach ($headers as $key => $value) {
                $curlHeaders[] = "$key: $value";
            }
    
            // Initialize cURL request
            $curl = curl_init();
            
            if ($curl === false) {
                throw new \Exception("Failed to initialize cURL");
            }
            
            $jsonPayload = json_encode($payload);
            
            if ($jsonPayload === false) {
                throw new \Exception("Failed to encode payload as JSON");
            }
            
            curl_setopt_array($curl, [
                CURLOPT_URL => trim($apiUrl), // Trim any whitespace from URL
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $jsonPayload,
                CURLOPT_HTTPHEADER => $curlHeaders,
                CURLOPT_SSL_VERIFYPEER => false, // Only use this in development
                CURLOPT_VERBOSE => true // For debugging
            ]);
    
            $response = curl_exec($curl);
            $info = curl_getinfo($curl);
            $err = curl_error($curl);
            $errno = curl_errno($curl);
            curl_close($curl);
    
            // Log detailed cURL information for debugging
            Log::info('cURL Request Details', [
                'info' => $info,
                'errno' => $errno,
                'error' => $err
            ]);
    
            if ($err) {
                throw new \Exception("cURL Error ($errno): $err");
            }
    
            // Log API response
            Log::info('Recharge API Response', [
                'reference_id' => $referenceId,
                'response' => $response
            ]);
    
            $responseData = json_decode($response, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON response from API: ' . json_last_error_msg());
            }
    
            // Store the recharge transaction regardless of status
            $rechargeTransaction = RechargeTransaction::create([
                'user_id' => $user->id,
                'operator' => $request->operator,
                'canumber' => $request->canumber,
                'amount' => $amount,
                'referenceid' => $referenceId,
                'status' => isset($responseData['status']) && $responseData['status'] ? 'success' : 'failed',
                'response_code' => $responseData['response_code'] ?? '',
                'operatorid' => $responseData['operatorid'] ?? '',
                'ackno' => $responseData['ackno'] ?? '',
                'message' => $responseData['message'] ?? ''
            ]);
    
            if (isset($responseData['status']) && $responseData['status'] === true) {
                // Deduct the amount from user's balance using the calculations helper
                $deductionSuccess = ApiHelper::calculations($user->id, $amount, $referenceId);
                
                if (!$deductionSuccess) {
                    Log::error('Failed to deduct amount from user balance', [
                        'user_id' => $user->id,
                        'amount' => $amount,
                        'reference_id' => $referenceId
                    ]);
                }
            }
    
            return response()->json($responseData);
    
        } catch (\Exception $e) {
            Log::error('Recharge processing failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'Failed to process recharge: ' . $e->getMessage()
            ], 500);
        }
    }

// public function processRecharge(Request $request)
// {
//     try {
//         // Validate the request
//         $validator = Validator::make($request->all(), [
//             'operator' => 'required|numeric',
//             'canumber' => 'required|string',
//             'amount' => 'required|numeric|min:1'
//         ]);

//         if ($validator->fails()) {
//             return response()->json([
//                 'status' => false,
//                 'message' => 'Validation failed',
//                 'errors' => $validator->errors()
//             ], 422);
//         }

//         $user = $request->user();
//         $amount = $request->input('amount');
//         $referenceId = ApiHelper::generateReferenceId();

//         // Calculate available balance
//         $totalApproved = FundRequest::getAvailableBalance($user->id);
//         $spentAmount = Transaction::where('user_id', $user->id)
//             ->where('status', 'completed')
//             ->where('type', 'debit')
//             ->sum('amount');
//         $remainingBalance = $totalApproved - $spentAmount;

//         if ($amount > $remainingBalance) {
//             return response()->json([
//                 'status' => false,
//                 'message' => 'Insufficient funds'
//             ], 403);
//         }

//         // Prepare payload for the API
//         $payload = [
//             'operator' => (int)$request->operator,
//             'canumber' => $request->canumber,
//             'amount' => (int)$amount,
//             'referenceid' => $referenceId
//         ];

//         // Call the dynamic API using the database-stored API name
//         $apiName = 'DoRecharge'; 
//         $responseData = $this->callDynamicApi($apiName, $payload);

//         // Check if the API call failed
//         if (isset($responseData['status']) && $responseData['status'] === false) {
//             throw new \Exception($responseData['message'] ?? 'Unknown error from API');
//         }

//         // Store the recharge transaction regardless of status
//         $rechargeTransaction = RechargeTransaction::create([
//             'operator' => $request->operator,
//             'canumber' => $request->canumber,
//             'amount' => $amount,
//             'referenceid' => $referenceId,
//             'status' => $responseData['status'] ? 'success' : 'failed',
//             'response_code' => $responseData['response_code'] ?? '',
//             'operatorid' => $responseData['operatorid'] ?? '',
//             'ackno' => $responseData['ackno'] ?? '',
//             'message' => $responseData['message'] ?? ''
//         ]);

//         // Record the debit transaction only if recharge is successful
//         if (isset($responseData['status']) && $responseData['status'] === true) {
//             Transaction::create([
//                 'user_id' => $user->id,
//                 'amount' => $amount,
//                 'type' => 'debit',
//                 'status' => 'completed'
//             ]);
//         }

//         return response()->json($responseData);

//     } catch (\Exception $e) {
//         Log::error('Recharge processing failed: ' . $e->getMessage());
//         return response()->json([
//             'status' => false,
//             'message' => 'Failed to process recharge: ' . $e->getMessage()
//         ], 500);
//     }
// }
    
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
