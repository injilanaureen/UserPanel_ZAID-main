<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\UtilityOperator;
use App\Models\UtilityBillPayment;
use App\Models\UtilityStatusEnquiry;
use App\Models\BillDetail;
use App\Models\JwtToken;
use App\Models\ApiManagement;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
class UtilitybillPaymentController extends Controller
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

    return Jwt::encode(
        $payload,
        $this->secretKey,
        'HS256' // Using HMAC SHA-256 algorithm
    );
}
private function callDynamicApi($apiName, $payload = [], $additionalHeaders = [])
{
    try {
        $apiDetails = ApiManagement::where('api_name', $apiName)->first();

        if (!$apiDetails) {
            throw new \Exception("API not found for name: {$apiName}");
        }

        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        $headers = array_merge([
            'Token' => $jwtToken,
            'accept' => 'application/json',
            'Content-Type' => 'application/json',
            'User-Agent' => $this->partnerId
        ], $additionalHeaders);

        $response = Http::withHeaders($headers)
            ->post($apiDetails->api_url, $payload);

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

public function operatorList()
{
    return Inertia::render('Admin/UtilityBillPayment/OperatorList');
}
public function fetchOperators()
{
    try {
        $responseData = $this->callDynamicApi('BillPaymentOperatorList', [
            'mode' => 'online'
        ]);

        return response()->json([
            'success' => $responseData['status'] ?? false,
            'operators' => $responseData['data'] ?? []
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while fetching operators',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function fetchBillDetails(Request $request)
{
    if (!$request->isMethod('post')) {
        return Inertia::render('Admin/UtilityBillPayment/FetchBillDetails');
    }

    $validated = $request->validate([
        'operator' => 'required|numeric',
        'canumber' => 'required|numeric',
        'mode' => 'required|in:online,offline',
    ]);

    try {
        $responseData = $this->callDynamicApi('BillPaymentFetchBillDetails', $validated);

        $billDetail = BillDetail::create([
            'operator' => $validated['operator'],
            'canumber' => $validated['canumber'],
            'mode' => $validated['mode'],
            'response_code' => $responseData['response_code'] ?? null,
            'status' => $responseData['status'] ?? null,
            'amount' => $responseData['amount'] ?? null,
            'name' => $responseData['name'] ?? null,
            'duedate' => $responseData['duedate'] ?? null,
            'ad2' => $responseData['ad2'] ?? null,
            'ad3' => $responseData['ad3'] ?? null,
            'message' => $responseData['message'] ?? null,
        ]);

        return Inertia::render('Admin/UtilityBillPayment/FetchBillDetails', [
            'billData' => $responseData,
            'savedRecord' => $billDetail
        ]);

    } catch (\Exception $e) {
        return Inertia::render('Admin/UtilityBillPayment/FetchBillDetails', [
            'billData' => null,
            'errors' => ['api' => 'Failed to fetch bill details: ' . $e->getMessage()]
        ]);
    }
}

    public function payBill()
    {
        return Inertia::render('Admin/UtilityBillPayment/PayBill');
    }

    public function processBillPayment(Request $request)
    {
        $validated = $request->validate([
            'canumber' => 'required|string|min:5',
            'amount' => 'required|numeric|min:1',
            'operator' => 'required|string'
        ]);
    
        try {
            $referenceId = 'REF' . time() . rand(1000, 9999);
            $formattedAmount = number_format($validated['amount'], 2, '.', '');
    
            $payload = [
                "operator" => $validated['operator'],
                "canumber" => $validated['canumber'],
                "amount" => $formattedAmount,
                "referenceid" => $referenceId,
                "latitude" => "27.2232",
                "longitude" => "78.26535",
                "mode" => "offline",
                "bill_fetch" => [
                    "billAmount" => $formattedAmount,
                    "billnetamount" => $formattedAmount,
                    "billdate" => date('d-M-Y'),
                    "dueDate" => date('Y-m-d', strtotime('+7 days')),
                    "acceptPayment" => true,
                    "acceptPartPay" => false,
                    "cellNumber" => $validated['canumber'],
                    "userName" => "SALMAN"
                ]
            ];
    
            $responseData = $this->callDynamicApi('UtilityPayBill', $payload);
    
            $billPayment = UtilityBillPayment::create([
                'consumer_number' => $validated['canumber'],
                'amount' => $validated['amount'],
                'operator_id' => $responseData['operatorid'] ?? null,
                'ack_no' => $responseData['ackno'] ?? null,
                'reference_id' => $referenceId,
                'response_code' => $responseData['response_code'] ?? null,
                'status' => $responseData['status'] ?? false,
                'message' => $responseData['message'] ?? null,
            ]);
    
            return response()->json($responseData);
    
        } catch (\Exception $e) {
            Log::error('Bill payment error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'error' => 'Payment processing failed: ' . $e->getMessage()
            ], 500);
        }
    }


    public function utilityStatusEnquiry()
{
    return Inertia::render('Admin/UtilityBillPayment/UtilityStatusEnquiry');
}
public function fetchUtilityStatus(Request $request)
{
    $validated = $request->validate([
        'referenceid' => 'required|string',
    ]);

    try {
        $responseData = $this->callDynamicApi('BillPaymentStatusEnquiry', [
            'referenceid' => $validated['referenceid']
        ]);

        if (isset($responseData['status']) && $responseData['status'] && isset($responseData['data'])) {
            $data = $responseData['data'];
            UtilityStatusEnquiry::updateOrCreate(
                ['reference_id' => $data['refid']],
                [
                    'transaction_id' => $data['txnid'] ?? null,
                    'operator_name' => $data['operatorname'] ?? null,
                    'customer_number' => $data['canumber'] ?? null,
                    'amount' => $data['amount'] ?? 0,
                    'additional_data_1' => $data['ad1'] ?? null,
                    'additional_data_2' => $data['ad2'] ?? null,
                    'additional_data_3' => $data['ad3'] ?? null,
                    'commission' => $data['comm'] ?? 0,
                    'tds' => $data['tds'] ?? 0,
                    'transaction_status' => $data['status'] ?? null,
                    'operator_id' => $data['operatorid'] ?? null,
                    'date_added' => $data['dateadded'] ?? null,
                    'refunded' => $data['refunded'] !== "0",
                    'refund_transaction_id' => $data['refunded'] !== "0" ? ($data['refundtxnid'] ?? null) : null,
                    'date_refunded' => $data['refunded'] !== "0" ? ($data['daterefunded'] ?? null) : null
                ]
            );
        }

        return response()->json($responseData);

    } catch (\Exception $e) {
        Log::error('Status enquiry error: ' . $e->getMessage());
        return response()->json([
            'status' => false,
            'message' => 'An error occurred while processing your request'
        ], 500);
    }
}
}
