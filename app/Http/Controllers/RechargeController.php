<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RechargeTransaction;
use App\Models\RechargeOperator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
class RechargeController extends Controller
{
    
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
                'amount' => 'required|numeric|min:1',
                'referenceid' => 'required|string',
            ]);
            
            if ($validator->fails()) {
                Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Call PaySprint API
            $apiResponse = Http::withHeaders([
                'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/recharge/recharge/dorecharge', [
                'operator' => (int)$request->operator,
                'canumber' => $request->canumber,
                'amount' => (int)$request->amount,
                'referenceid' => $request->referenceid
            ]);
            
            $responseData = $apiResponse->json();
            
            // Store transaction in database
            $transaction = RechargeTransaction::create([
                'operator' => $request->operator,
                'canumber' => $request->canumber,
                'amount' => $request->amount,
                'referenceid' => $request->referenceid,
                'status' => isset($responseData['status']) && $responseData['status'] ? 'success' : 'failed',
                'message' => $responseData['message'] ?? 'Transaction processed',
                'response_code' => $responseData['response_code'] ?? '',
                'operatorid' => $responseData['operatorid'] ?? '',
                'ackno' => $responseData['ackno'] ?? ''
            ]);
            
            Log::info('Transaction created successfully:', $transaction->toArray());
            
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
    public function recharge2()
    {
        return Inertia::render('Admin/Recharge/Recharge2');
    }
    public function fetchRechargeStatus(Request $request)
    {
        $request->validate([
            'referenceid' => 'required|string'
        ]);
        
        try {
            $response = Http::withHeaders([
                'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzg5MjE3NzcsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM4OTIxNzc3In0.6vhPb1SE1p3yvAaK_GAEz-Y0Ai1ibCbN85adKW_1Xzg',
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/recharge/recharge/status', [
                'referenceid' => $request->referenceid
            ]);
            
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to fetch data'], 500);
        }
    }
  
    public function manageOperator()
    {
        return Inertia::render('Admin/Recharge/ManageOperator');
    }
    public function getOperators()
     {  
       $url = 'https://api.paysprint.in/api/v1/service/recharge/recharge/getoperator';     
             $headers = [ 
            // 'Authorisedkey: Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=', 
            'Token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3NDEwMDYxMDcsInBhcnRuZXJJZCI6IlBTMDA1OTYyIiwicmVxaWQiOiIxNzQxMDA2MTA3In0.eL4XDZ3P6KDJoo8vrW8prFBpXkBULy5-pD5iGPY9UMc',   
          'accept: application/json'    
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
    return response()->json(['success' => false, 'message' => 'Error fetching operators', 'error' => $err], 500); 
        }     
             // Decode the response         
$responseData = json_decode($response, true);    
              // Save to database if the API call is successful    
     if (isset($responseData['status']) && $responseData['status'] === true) { 
            $this->saveOperatorsToDatabase($responseData['data']);    
     }                
  return response()->json($responseData);  
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
