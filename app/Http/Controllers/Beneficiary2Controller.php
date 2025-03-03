<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RegisterBeneficiary2;
use App\Models\FetchBeneficiary;
use App\Models\BeneficiaryDeletion;
use App\Models\fetchbyBenied;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class Beneficiary2Controller extends Controller
{
   private function getBeneficiaries()
{
    return RegisterBeneficiary2::latest()->get();
}

public function registerBeneficiary(Request $request)
{
    if ($request->isMethod('post')) {
        $response = Http::withHeaders([
            'AuthorisedKey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
            'Token' => 'your_api_token',
            'accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post('https://sit.paysprint.in/service-api/api/v1/service/dmt-v2/beneficiary/registerbeneficiary', [
            'mobile' => $request->mobile,
            'benename' => $request->benename,
            'bankid' => $request->bankid,
            'accno' => $request->accno,
            'ifsccode' => $request->ifsccode,
            'verified' => $request->verified,
        ]);

        $responseData = $response->json();

        if ($response->successful() && isset($responseData['data'])) {
            try {
                RegisterBeneficiary2::create([
                    'bene_id' => $responseData['data']['bene_id'],
                    'bankid' => $responseData['data']['bankid'],
                    'bankname' => $responseData['data']['bankname'],
                    'name' => $responseData['data']['name'],
                    'accno' => $responseData['data']['accno'],
                    'ifsc' => $responseData['data']['ifsc'],
                    'verified' => $responseData['data']['verified'] === '1',
                    'banktype' => $responseData['data']['banktype'],
                    'status' => $responseData['data']['status'],
                    'bank3' => $responseData['data']['bank3'] ?? false,
                    'message' => $responseData['message'],
                ]);
            } catch (\Exception $e) {
                return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
                    'success' => false,
                    'response' => $responseData,
                    'error' => 'Failed to save beneficiary details: ' . $e->getMessage(),
                    'beneficiaries' => $this->getBeneficiaries(),
                ]);
            }
        }

        return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
            'success' => $response->successful(),
            'response' => $responseData,
            'error' => !$response->successful() ? 'Failed to register beneficiary.' : null,
            'beneficiaries' => $this->getBeneficiaries(),
        ]);
    }

    return Inertia::render('Admin/beneficiary2/registerBeneficiary', [
        'beneficiaries' => $this->getBeneficiaries(),
    ]);
}



public function fetchBeneficiary(Request $request)
{
    $mobile = $request->input('mobile');

    // Fetch data from API if mobile is provided
    if ($mobile) {
        $response = Http::withHeaders([
            'AuthorisedKey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
            'Content-Type' => 'application/json',
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk5NDQ3MTksInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5OTQ0NzE5In0.1bNrePHYUe-0FodOCdAMpPhL3Ivfpi7eVTT9V7xXsGI',
            'accept' => 'application/json',
        ])->post('https://sit.paysprint.in/service-api/api/v1/service/dmt-v2/beneficiary/registerbeneficiary/fetchbeneficiary', [
            'mobile' => $mobile,
        ]);

        $responseData = $response->json();

        // Store the beneficiary data if the API call was successful
        if ($responseData['status'] === true && !empty($responseData['data'])) {
            foreach ($responseData['data'] as $beneficiary) {
                FetchBeneficiary::updateOrCreate(
                    ['bene_id' => $beneficiary['bene_id']], // Unique identifier
                    [
                        'bankid' => $beneficiary['bankid'],
                        'bankname' => $beneficiary['bankname'],
                        'name' => $beneficiary['name'],
                        'accno' => $beneficiary['accno'],
                        'ifsc' => $beneficiary['ifsc'],
                        'verified' => $beneficiary['verified'] === "1",
                        'banktype' => $beneficiary['banktype'],
                        'paytm' => $beneficiary['paytm'] ?? false,
                    ]
                );
            }
        }
    }

    // Fetch saved beneficiaries from the database
    $beneficiaries = FetchBeneficiary::all();

    return Inertia::render('Admin/beneficiary2/fetchBeneficiary', [
        'beneficiaryData' => $beneficiaries,
        'mobile' => $mobile,
    ]);
}

    public function deleteBeneficiary()
    {
        return Inertia::render('Admin/beneficiary2/deleteBeneficiary');
    }

    public function destroyBeneficiary(Request $request)
    {
        $validated = $request->validate([
            'mobile' => 'required|digits:10',
            'bene_id' => 'required|string'
        ]);

        try {
            $response = Http::withHeaders([
                'AuthorisedKey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'Content-Type' => 'application/json',
                'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk5NDQ3MTksInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5OTQ0NzE5In0.1bNrePHYUe-0FodOCdAMpPhL3Ivfpi7eVTT9V7xXsGI',
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/dmt-v2/beneficiary/registerbeneficiary/deletebeneficiary', [
                'mobile' => $validated['mobile'],
                'bene_id' => $validated['bene_id']
            ]);

            $responseData = $response->json();
            
            // Store the response in database
            BeneficiaryDeletion::create([
                'mobile' => $validated['mobile'],
                'bene_id' => $validated['bene_id'],
                'status' => $responseData['status'] ?? false,
                'response_code' => $responseData['response_code'] ?? null,
                'message' => $responseData['message'] ?? 'No message provided'
            ]);

            // Instead of redirecting, return an Inertia response
            return Inertia::render('Admin/beneficiary2/deleteBeneficiary', [
                'flash' => [
                    'status' => $responseData['status'] ?? false,
                    'response_code' => $responseData['response_code'] ?? null,
                    'message' => $responseData['message'] ?? 'No message provided'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error in deleteBeneficiary', ['error' => $e->getMessage()]);
            
            return Inertia::render('Admin/beneficiary2/deleteBeneficiary', [
                'flash' => [
                    'status' => false,
                    'message' => 'An error occurred: ' . $e->getMessage()
                ]
            ]);
        }
    }

    public function getDeletionHistory()
    {
        $history = BeneficiaryDeletion::latest()->get();
        return response()->json($history);
    }
    public function fetchbyBenied()
    {
        return Inertia::render('Admin/beneficiary2/fetchbyBenied');
    }

    public function fetchBeneficiaryData(Request $request)
    {
        $request->validate([
            'mobile' => 'required|string|size:10',
            'beneid' => 'required|string'
        ]);

        try {
            $response = Http::withHeaders([
                'AuthorisedKey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'Content-Type' => 'application/json',
                'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk5NDQ3MTksInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5OTQ0NzE5In0.1bNrePHYUe-0FodOCdAMpPhL3Ivfpi7eVTT9V7xXsGI',
                'accept' => 'application/json'
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/dmt-v2/beneficiary/registerbeneficiary/fetchbeneficiarybybeneid', [
                'mobile' => $request->mobile,
                'beneid' => $request->beneid
            ]);

            $responseData = $response->json();

            // Store data in database if the API call was successful
            if (isset($responseData['data']) && is_array($responseData['data'])) {
                foreach ($responseData['data'] as $beneficiary) {
                    FetchbyBenied::updateOrCreate(
                        [
                            'mobile' => $request->mobile,
                            'bene_id' => $beneficiary['bene_id']
                        ],
                        [
                            'bank_id' => $beneficiary['bankid'] ?? null,
                            'bank_name' => $beneficiary['bankname'] ?? null,
                            'name' => $beneficiary['name'] ?? null,
                            'account_number' => $beneficiary['accno'] ?? null,
                            'ifsc' => $beneficiary['ifsc'] ?? null,
                            'verified' => $beneficiary['verified'] === '1',
                            'bank_type' => $beneficiary['banktype'] ?? null
                        ]
                    );
                }
            }

            return response()->json($responseData);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch beneficiary data',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
