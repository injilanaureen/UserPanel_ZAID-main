<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\InsuranceBillDetail;
use App\Models\PayInsuranceBill;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use App\Models\JwtToken;
use Illuminate\Support\Facades\Http;

class InsurancePremiumPaymentController extends Controller
{
    private $partnerId = 'PS005962';
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

    private function callDynamicApi($apiName, $payload = [], $additionalHeaders = [])
    {
        try {
            // Fetch API URL from database
            $apiUrl = \App\Helpers\ApiHelper::getApiUrl($apiName);

            // Generate unique request ID and JWT token
            $requestId = time() . rand(1000, 9999);
            $jwtToken = \App\Helpers\ApiHelper::generateJwtToken($requestId, $this->partnerId, $this->secretKey);

            // Prepare headers
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

    public function fetchInsuranceBillDetails()
    {
        return Inertia::render('Admin/InsurancePremiumPayment/FetchInsuranceBillDetails');
    }

    public function fetchLICBill(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'canumber' => 'required|numeric',
            'ad1' => 'required|email',
            'ad2' => 'required|regex:/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/',
            'mode' => 'required|in:online,offline'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $apiFormattedDate = \DateTime::createFromFormat('d/m/Y', $request->ad2)->format('d/m/Y');
            $referenceId = 'RECH' . time() . rand(1000, 9999);

            $payload = [
                'canumber' => $request->canumber,
                'ad1' => $request->ad1,
                'ad2' => $apiFormattedDate,
                'mode' => $request->mode
            ];

            $responseData = $this->callDynamicApi('Fetch Bill Details', $payload);

            if ($responseData['response_code'] == 1 && $responseData['status'] === true) {
                $billFetch = $responseData['bill_fetch'] ?? [];

                InsuranceBillDetail::create([
                    'canumber' => $request->canumber,
                    'ad1' => $request->ad1,
                    'ad2' => $request->ad2,
                    'mode' => $request->mode,
                    'status' => $responseData['status'],
                    'amount' => $responseData['amount'] ?? null,
                    'name' => $responseData['name'] ?? null,
                    'duedate' => $responseData['duedate'] ?? null,
                    'bill_fetch' => json_encode($responseData['bill_fetch']),
                    'ad3' => $responseData['ad3'] ?? null,
                    'message' => $responseData['message'] ?? null,
                    'billAmount' => $billFetch['billAmount'] ?? null,
                    'billnetamount' => $billFetch['billnetamount'] ?? null,
                    'bill_dueDate' => $billFetch['dueDate'] ?? null,
                    'maxBillAmount' => $billFetch['maxBillAmount'] ?? null,
                    'acceptPayment' => $billFetch['acceptPayment'] ?? false,
                    'acceptPartPay' => $billFetch['acceptPartPay'] ?? false,
                    'cellNumber' => $billFetch['cellNumber'] ?? null,
                    'userName' => $billFetch['userName'] ?? null,
                ]);
            }

            return response()->json($responseData);
        } catch (\Exception $e) {
            Log::error('Fetch LIC Bill Failed: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch bill details: ' . $e->getMessage()
            ], 500);
        }
    }

    public function payInsuranceBill(Request $request)
    {
        if ($request->isMethod('get')) {
            return Inertia::render('Admin/InsurancePremiumPayment/PayInsuranceBill');
        }

        try {
            $referenceId = 'RECH' . time() . rand(1000, 9999);

            $payload = [
                'canumber' => $request->canumber,
                'mode' => 'online',
                'amount' => $request->amount,
                'ad1' => "nitesh@rnfiservices.com",
                'ad2' => "DD/MM/YYYY",
                'ad3' => "HGAYV15E560507155",
                'referenceid' => $referenceId,
                'latitude' => 27.2232,
                'longitude' => 78.26535,
                'bill_fetch' => [
                    'billNumber' => "LICI2122000037468013",
                    'billAmount' => "1548.00",
                    'billnetamount' => "1548.00",
                    'billdate' => "25-05-2021 00:44:29",
                    'acceptPayment' => true,
                    'acceptPartPay' => false,
                    'cellNumber' => "905514651",
                    'dueFrom' => "11/05/2021",
                    'dueTo' => "11/05/2021",
                    'validationId' => "HGA8V00A110382264047",
                    'billId' => "HGA8V00A110382264047B"
                ]
            ];

            $responseData = $this->callDynamicApi('Pay Bill', $payload);
            return response()->json($responseData);

        } catch (\Exception $e) {
            Log::error('Pay Insurance Bill Failed: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to process payment: ' . $e->getMessage()
            ], 500);
        }
    }

    public function insuranceStatusEnquiry()
    {
        return Inertia::render('Admin/InsurancePremiumPayment/InsuranceStatusEnquiry');
    }

    public function fetchInsuranceStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'referenceid' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $payload = [
                'referenceid' => $request->referenceid
            ];

            $responseData = $this->callDynamicApi('Lic Status', $payload);
            return response()->json($responseData);

        } catch (\Exception $e) {
            Log::error('Fetch Insurance Status Failed: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch status: ' . $e->getMessage()
            ], 500);
        }
    }
}