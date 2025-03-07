<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LICBill;
use Illuminate\Support\Facades\Log;

class BillController extends Controller
{
    public function store(Request $request)
    {
        // Validate Input
        $validatedData = $request->validate([
            'canumber' => 'required|string|max:255',
            'mode' => 'required|string',
            'amount' => 'required|numeric',
            'ad1' => 'required|string|max:255',
            'ad2' => 'nullable|string|max:255',
            'ad3' => 'nullable|string|max:255',
            'message' => 'required|string',
            'response_code' => 'required|integer',
    
            // Bill Fetch Nested Data
            'bill_fetch.billAmount' => 'nullable|numeric',
            'bill_fetch.billnetamount' => 'nullable|numeric',
            'bill_fetch.dueDate' => 'nullable|date',
            'bill_fetch.maxBillAmount' => 'nullable|numeric',
            'bill_fetch.acceptPayment' => 'nullable|boolean',
            'bill_fetch.acceptPartPay' => 'nullable|boolean',
            'bill_fetch.cellNumber' => 'nullable|string',
            'bill_fetch.userName' => 'nullable|string',
    
            'duedate' => 'nullable|date',
            'name' => 'required|string',
        ]);
    
        // Store Data in Database
        $bill = new LICBill([
            'canumber' => $request->input('canumber'),
            'mode' => $request->input('mode'),
            'amount' => $request->input('amount'),
            'ad1' => $request->input('ad1'),
            'ad2' => $request->input('ad2') ?? '',
            'ad3' => $request->input('ad3') ?? '',
            'message' => $request->input('message'),
            'response_code' => $request->input('response_code'),
    
            // Bill Fetch Fields
            'billamount' => $request->input('bill_fetch.billAmount'),
            'billnetamount' => $request->input('bill_fetch.billnetamount'),
            'due_date' => $request->input('bill_fetch.dueDate'),
            'max_bill_amount' => $request->input('bill_fetch.maxBillAmount'),
            'accept_payment' => $request->input('bill_fetch.acceptPayment', false),
            'accept_part_pay' => $request->input('bill_fetch.acceptPartPay', false),
            'cell_number' => $request->input('bill_fetch.cellNumber'),
            'billusername' => $request->input('bill_fetch.userName'),
    
            'duedate' => $request->input('duedate'),
            'name' => $request->input('name'),
        ]);
    
        // Save to Database
        $bill->save();
    
        return response()->json([
            'status' => true,
            'message' => 'Bill Saved Successfully',
            'data' => $bill,
        ], 201);
    }
    
    
    

    
}

