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
    public function fetchInsuranceBillDetails()
    {
        return Inertia::render('Admin/InsurancePremiumPayment/FetchInsuranceBillDetails');
    }
    public function fetchLICBill(Request $request)
{
    $referenceId = 'RECH' . time() . rand(1000, 9999); 
    $requestId = time() . rand(1000, 9999);
    $jwtToken = $this->generateJwtToken($requestId);

    $request->validate([
        'canumber' => 'required|numeric',
        'ad1' => 'required|email',
        'ad2' => 'required|regex:/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/', // Validates dd/mm/yyyy format
        'mode' => 'required|in:online,offline'
    ]);

    try {

        $apiFormattedDate = \DateTime::createFromFormat('d/m/Y', $request->ad2)->format('d/m/Y');


        $response = Http::withHeaders([
            'Token' => $jwtToken,
            'accept' => 'application/json',
            'content-type' => 'application/json',
            'User-Agent' => $this->partnerId
        ])->post('https://api.paysprint.in/api/v1/service/bill-payment/bill/fetchlicbill', [
            'canumber' => $request->canumber,
            'ad1' => $request->ad1,
            'ad2' => $apiFormattedDate, // Use converted date if API expects yyyy-mm-dd
            'mode' => $request->mode
        ]);

        $data = $response->json();

        if ($data['response_code'] == 1 && $data['status'] === true) {
            InsuranceBillDetail::create([
                'canumber' => $request->canumber,
                'ad1' => $request->ad1,
                'ad2' => $request->ad2, // Store in dd/mm/yyyy as received from frontend
                'mode' => $request->mode,
                'status' => $data['status'],
                'amount' => $data['amount'],
                'name' => $data['name'],
                'duedate' => $data['duedate'],
                'bill_fetch' => json_encode($data['bill_fetch']),
                'ad3' => $data['ad3'] ?? null,
                'message' => $data['message'],
                'billAmount' => $data['bill_fetch']['billAmount'],
                'billnetamount' => $data['bill_fetch']['billnetamount'],
                'bill_dueDate' => $data['bill_fetch']['dueDate'],
                'maxBillAmount' => $data['bill_fetch']['maxBillAmount'],
                'acceptPayment' => $data['bill_fetch']['acceptPayment'],
                'acceptPartPay' => $data['bill_fetch']['acceptPartPay'],
                'cellNumber' => $data['bill_fetch']['cellNumber'],
                'userName' => $data['bill_fetch']['userName'],
            ]);
        }

        return response()->json($data);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to fetch bill details',
            'message' => $e->getMessage()
        ], 500);
    }
}


    public function payInsuranceBill(Request $request)
    {
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        if ($request->isMethod('get')) {
            return Inertia::render('Admin/InsurancePremiumPayment/PayInsuranceBill');
        }

        $response = Http::withHeaders([

            'Token' => $jwtToken,
            'User-Agent' => $this->partnerId,
            'accept' => 'application/json',
            'content-type' => 'application/json',
        ])->post('https://api.paysprint.in/api/v1/service/bill-payment/bill/paylicbill', [
            'canumber' => $request->canumber,
            'mode' => 'online',
            'amount' => $request->amount,
            'ad1' => "nitesh@rnfiservices.com",
            'ad2' => "DD/MM/YYYY",
            'ad3' => "HGAYV15E560507155",
            'referenceid' => $request->referenceid,
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
        ]);

        return response()->json($response->json());
    }

    public function insuranceStatusEnquiry()
    {
        return Inertia::render('Admin/InsurancePremiumPayment/InsuranceStatusEnquiry');
    }
    public function fetchInsuranceStatus(Request $request)
    {
        $referenceId = 'RECH' . time() . rand(1000, 9999); // Example format: RECH16776543211234
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);
        // Validate input
        
        $request->validate([
            'referenceid' => 'required|string',
        ]);

        $referenceId = $request->input('referenceid');

        // API request
        $response = Http::withHeaders([
           'Token' => $jwtToken,
           'User-Agent' => $this->partnerId,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post('https://api.paysprint.in/api/v1/service/bill-payment/bill/licstatus', [
            'referenceid' => $referenceId,
        ]);

        return response()->json($response->json());
    }
}
