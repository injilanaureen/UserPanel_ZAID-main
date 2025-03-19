<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaysprintCallbackController extends Controller
{
    public function handleCallback(Request $request)
    {
        Log::info('Paysprint Callback Received:', $request->all());


        $request->validate([
            'event' => 'required|string',
            'param' => 'required|array',
        ]);

        $event = $request->input('event');
        $params = $request->input('param');

        switch ($event) {
            case 'BUS_TICKET_BOOKING_DEBIT_CONFIRMATION':
                return $this->handleDebitCallback($params);
            case 'BUS_TICKET_BOOKING_CREDIT_CONFIRMATION':
                return $this->handleCreditCallback($params);
            case 'BUS_TICKET_BOOKING_CONFIRMATION':
                return $this->handleTicketConfirmation($params);
            default:
                return response()->json(['status' => 400, 'message' => 'Invalid event type'], 400);
        }
    }

    private function handleDebitCallback($params) 
    {
        Log::info('Handling Debit Callback:', $params);
        

        return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
    }

    private function handleCreditCallback($params)
    {
        // Process credit confirmation logic
        Log::info('Handling Credit Callback:', $params);
        
        return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
    }

    private function handleTicketConfirmation($params)
    {
        // Process ticket confirmation logic
        Log::info('Handling Ticket Confirmation:', $params);
        
        return response()->json(['status' => 200, 'message' => 'Ticket confirmed successfully']);
    }
}
