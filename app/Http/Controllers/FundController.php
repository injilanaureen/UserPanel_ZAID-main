<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FundRequest;
use App\Models\AddAccount;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class FundController extends Controller
{
    public function fundrequest()
    {
        $bankAccounts = AddAccount::where('status', 1)
            ->select('id', 'bank', 'account_name', 'account_number', 'ifsc_code')
            ->get();

        return Inertia::render('Admin/fundrequest/fundrequest', [  // Fixed component path
            'bankAccounts' => $bankAccounts
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Validate request data
            $validatedData = $request->validate([
                'transactionType' => 'required|in:NEFT,RTGS,IMPS',
                'amount' => 'required|numeric|min:1',
                'transactionId' => 'required|string|unique:fund_requests,transaction_id',
                'depositedDate' => 'required|date',
                'bankId' => 'required|exists:addaccount,id', 
                'image_path' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ]);

            // Handle file upload
            $filePath = null;
            if ($request->hasFile('image_path')) {
                $filePath = $request->file('image_path')->store('fund_requests', 'public');
            }

            // Create fund request
            $fundRequest = FundRequest::create([
                'transaction_type' => $validatedData['transactionType'],
                'amount' => $validatedData['amount'],
                'transaction_id' => $validatedData['transactionId'],
                'deposited_date' => $validatedData['depositedDate'],
                'bank_id' => $validatedData['bankId'],
                // 'file_path' => $filePath,
                'image_path' => $filePath,  
                'status' => 'pending',
                'user_id' => auth()->id() ?? 1,
            ]);

            return redirect()->back()
                ->with('success', 'Fund request submitted successfully.');
        } catch (\Exception $e) {
            Log::error('Fund Request Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return redirect()->back()
                ->withErrors(['error' => 'Failed to submit fund request: ' . $e->getMessage()])
                ->withInput();
        }
    }
}