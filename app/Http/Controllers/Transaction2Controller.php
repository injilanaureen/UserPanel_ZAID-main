<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PennyDrop;
use App\Models\TransactionSentOtp;
use App\Models\DMTTransaction2;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

use Inertia\Inertia;
class Transaction2Controller extends Controller
{
    private $partnerId = 'PS005962';
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

    private function callDynamicApi($apiName, $payload = [], $additionalHeaders = [])
    {
        try {
            $apiUrl = \App\Helpers\ApiHelper::getApiUrl($apiName);

            $requestId = \App\Helpers\ApiHelper::generateRequestId();
            $jwtToken = \App\Helpers\ApiHelper::generateJwtToken($requestId, $this->partnerId, $this->secretKey);

            $headers = \App\Helpers\ApiHelper::getApiHeaders($jwtToken, $additionalHeaders, $this->partnerId);

            $response = Http::withHeaders($headers)
                ->post($apiUrl, $payload);

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

  public function pennyDrop(Request $request)
    {
        $referenceId = \App\Helpers\ApiHelper::generateReferenceId('TRAN');

        if ($request->isMethod('post')) {
            $validatedData = $request->validate([
                'mobile' => 'required|digits:10',
                'accno' => 'required|string',
                'bankid' => 'required|integer',
                'benename' => 'required|string',
                'pincode' => 'required|digits:6',
                'address' => 'required|string',
                'dob' => 'required|date_format:d-m-Y',
                'gst_state' => 'required|string|max:2',
                'bene_id' => 'required|integer',
            ]);
            $validatedData['referenceid'] = $referenceId;

            Log::info('Sending API request for penny drop', [
                'request_data' => $validatedData,
                'referenceid' => $referenceId
            ]);

            $responseData = $this->callDynamicApi('Dmt2PennyDrop', $validatedData);

            PennyDrop::create([
                'mobile' => $validatedData['mobile'],
                'accno' => $validatedData['accno'],
                'bankid' => $validatedData['bankid'],
                'benename' => $validatedData['benename'],
                'referenceid' => $referenceId,
                'pincode' => $validatedData['pincode'],
                'address' => $validatedData['address'],
                'dob' => date('Y-m-d', strtotime($validatedData['dob'])),
                'gst_state' => $validatedData['gst_state'],
                'bene_id' => $validatedData['bene_id'],
                'status' => $responseData['status'] ?? 0,
                'response_code' => $responseData['response_code'] ?? null,
                'utr' => $responseData['utr'] ?? null,
                'ackno' => $responseData['ackno'] ?? null,
                'txn_status' => $responseData['txn_status'] ?? null,
                'message' => $responseData['message'] ?? null,
                'balance' => $responseData['balance'] ?? null,
            ]);

            return Inertia::render('Admin/transaction2/pennyDrop', [
                'apiResponse' => $responseData,
            ]);
        }

        return Inertia::render('Admin/transaction2/pennyDrop', [
            'apiResponse' => null,
        ]);
    }


    public function transactionSentOtp(Request $request)
    {
        $referenceId = \App\Helpers\ApiHelper::generateReferenceId('TRAN');

        if ($request->isMethod('post')) {
            $request->validate([
                'mobile' => 'required|digits:10',
                'bene_id' => 'required|string',
                'txntype' => 'required|string',
                'amount' => 'required|numeric',
                'pincode' => 'required|string',
                'address' => 'required|string',
                'gst_state' => 'required|string',
                'dob' => 'required|date_format:d-m-Y',
                'lat' => 'nullable|string',
                'long' => 'nullable|string',
            ]);

            $dob = \Carbon\Carbon::createFromFormat('d-m-Y', $request->dob)->format('Y-m-d');

            $payload = [
                'mobile' => $request->mobile,
                'referenceid' => $referenceId,
                'bene_id' => $request->bene_id,
                'txntype' => $request->txntype,
                'amount' => $request->amount,
                'pincode' => $request->pincode,
                'address' => $request->address,
                'gst_state' => $request->gst_state,
                'dob' => $dob,
                'lat' => $request->lat,
                'long' => $request->long,
            ];

            $apiResponse = $this->callDynamicApi('Dmt2TransactionSentOtp', $payload);

            TransactionSentOtp::create([
                'mobile' => $request->mobile,
                'referenceid' => $referenceId,
                'bene_id' => $request->bene_id,
                'txntype' => $request->txntype,
                'amount' => $request->amount,
                'pincode' => $request->pincode,
                'address' => $request->address,
                'gst_state' => $request->gst_state,
                'dob' => $dob,
                'lat' => $request->lat,
                'long' => $request->long,
                'status' => $apiResponse['status'] ?? null,
                'response_code' => $apiResponse['response_code'] ?? null,
                'message' => $apiResponse['message'] ?? null,
                'txn_id' => $apiResponse['data']['txn_id'] ?? null,
                'ackno' => $apiResponse['data']['ackno'] ?? null,
                'utr' => $apiResponse['data']['utr'] ?? null,
            ]);

            return Inertia::render('Admin/transaction2/transactionSentOtp', [
                'response' => $apiResponse
            ]);
        }

        return Inertia::render('Admin/transaction2/transactionSentOtp');
    }



public function transaction()
{
    return Inertia::render('Admin/transaction2/transaction');
}
public function transact(Request $request)
    {
        $referenceId = \App\Helpers\ApiHelper::generateReferenceId('TRAN');

        $validated = $request->validate([
            'mobile' => 'required|string',
            'referenceid' => 'required|string',
            'pincode' => 'required|string',
            'address' => 'required|string',
            'amount' => 'required|string',
            'txntype' => 'required|string|in:imps,neft',
            'dob' => 'required|date_format:d-m-Y',
            'gst_state' => 'required|string',
            'bene_id' => 'required|string',
            'otp' => 'required|string',
            'stateresp' => 'required|string',
            'lat' => 'required|string',
            'long' => 'required|string',
        ]);

        // Override the validated referenceid with the generated one
        $validated['referenceid'] = $referenceId;

        Log::info('Request Payload:', $validated);

        $responseData = $this->callDynamicApi('Dmt2Transaction', $validated);

        return Inertia::render('Admin/transaction2/transaction', [
            'transactionData' => $responseData,
        ]);
    }

    public function transactionStatus(Request $request)
    {
        if ($request->filled('referenceid')) {
            $referenceId = $request->input('referenceid');

            $payload = ['referenceid' => $referenceId];
            $responseData = $this->callDynamicApi('Dmt2TransactionStatus', $payload);

            return Inertia::render('Admin/transaction2/transactionStatus', [
                'transactionData' => $responseData,
                'referenceId' => $referenceId,
            ]);
        }

        return Inertia::render('Admin/transaction2/transactionStatus', [
            'transactionData' => null,
            'referenceId' => '',
        ]);
    }
}
