<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaysprintCallbackController extends Controller
{
    public function handleCallback(Request $request)
    {
        // Log request for debugging
        Log::info('Paysprint Callback Received:', $request->all());

        // Validate request structure
        $request->validate([
            'event' => 'required|string',
            'param' => 'required|array',
            'param.amount' => 'required|string',
            'param.refid' => 'required|string',
            'param.customer_mobile' => 'required|string',
        ]);

        // Get event type
        $event = $request->input('event');
        $params = $request->input('param');

        // Process based on event type
        if ($event === 'BUS_TICKET_BOOKING_DEBIT_CONFIRMATION') {
            return $this->handleDebitTransaction($params);
        } elseif ($event === 'BUS_TICKET_BOOKING_CREDIT_CONFIRMATION') {
            return $this->handleCreditTransaction($params);
        }

        return response()->json(['status' => 400, 'message' => 'Invalid event type'], 400);
    }

    private function handleDebitTransaction($params)
    {
        // Log the transaction
        Log::info('Processing Debit Transaction:', $params);

        // Example: Save booking details (uncomment if you have a database)
        // Booking::create([
        //     'ref_id' => $params['refid'],
        //     'amount' => $params['amount'],
        //     'customer_mobile' => $params['customer_mobile'],
        //     'status' => 'confirmed'
        // ]);

        return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
    }

    private function handleCreditTransaction($params)
    {
        // Log the transaction
        Log::info('Processing Credit Transaction:', $params);

        // Example: Mark booking as canceled (uncomment if using a database)
        // Booking::where('ref_id', $params['refid'])->update(['status' => 'canceled']);

        return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
    }
}
