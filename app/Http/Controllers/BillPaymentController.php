<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BillPayment;

class BillPaymentController extends Controller 
{
    public function store(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'canumber' => 'required',
                'mode' => 'required|string',
                'amount' => 'required|numeric',
                'ad1' => 'required|string',
                'ad2' => 'required|string',
                'ad3' => 'required|string',
                'referenceid' => 'required',
                'latitude' => 'required',
                'longitude' => 'required',
                'bill_fetch.billNumber' => 'required|string',
                'bill_fetch.billAmount' => 'required',
                'bill_fetch.billnetamount' => 'required',
                'bill_fetch.billdate' => 'required',
                'bill_fetch.cellNumber' => 'required',
                'bill_fetch.validationId' => 'required|string',
                'bill_fetch.billId' => 'required|string',
                'response_code' => 'required',
                'operatorid' => 'required',
                'ackno' => 'required',
                'refid' => 'required',
                'message' => 'required|string',
            ]);

            // Prepare data for saving
            $billPaymentData = [
                'canumber' => $request->canumber,
                'mode' => $request->mode,
                'amount' => $request->amount,
                'ad1' => $request->ad1,
                'ad2' => $request->ad2,
                'ad3' => $request->ad3,
                'referenceid' => $request->referenceid,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'bill_fetch' => json_encode($request->bill_fetch), // Convert to JSON string
                'response_code' => $request->response_code,
                'operatorid' => $request->operatorid,
                'ackno' => $request->ackno,
                'refid' => $request->refid,
                'message' => $request->message,
            ];

            // Save data
            $billPayment = BillPayment::create($billPaymentData);

            return response()->json([
                'status' => true,
                'message' => 'Data saved successfully!',
                'data' => $billPayment
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}