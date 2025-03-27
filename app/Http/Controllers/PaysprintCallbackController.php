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

        // Get event type
        $event = $request->input('event');
        
        // Process based on event type
        if ($event === 'BUS_TICKET_BOOKING_DEBIT_CONFIRMATION') {
            return $this->handleDebitTransaction($request->input('param'));
        } elseif ($event === 'BUS_TICKET_BOOKING_CREDIT_CONFIRMATION') {
            return $this->handleCreditTransaction($request->input('param'));
        } elseif ($event === 'BUS_TICKET_BOOKING_CONFIRMATION') {
            // No validation, just process the ticket confirmation
            return $this->handleTicketConfirmation($request->input('param'));
        }elseif ($event === 'CMS_BALANCE_INQUIRY') {
            return $this->handleBalanceInquiry($request->input('param'));
        }  elseif ($event === 'CMS_BALANCE_DEBIT') {
            return $this->handleBalanceDebit($request->input('param'));
        } elseif ($event === 'CMS_LOW_BALANCE_INQUIRY') {
            return $this->handleLowBalanceInquiry($request->input('param'));
        } elseif ($event === 'CMS_POSTING') {
            return $this->handleMsPosting($request->input('param'));
        }

        return response()->json(['status' => 400, 'message' => 'Invalid event type'], 400);
    }

    private function handleDebitTransaction($params)
    {
        // Log the transaction
        Log::info('Processing Debit Transaction:', $params);

        try {
            // Your debit transaction logic here
            
            return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
        } catch (\Exception $e) {
            Log::error('Debit Transaction Error: ' . $e->getMessage(), ['params' => $params]);
            return response()->json(['status' => 500, 'message' => 'Transaction processing failed'], 500);
        }
    }

    private function handleCreditTransaction($params)
    {
        // Log the transaction
        Log::info('Processing Credit Transaction:', $params);

        try {
            // Your credit transaction logic here
            
            return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
        } catch (\Exception $e) {
            Log::error('Credit Transaction Error: ' . $e->getMessage(), ['params' => $params]);
            return response()->json(['status' => 500, 'message' => 'Transaction processing failed'], 500);
        }
    }

    private function handleTicketConfirmation($params)
    {
        // Log the transaction
        Log::info('Processing Ticket Confirmation:', $params);

        try {
            // You can still process the data if needed
            // But no validation is performed
            
            // Just return success response
            return response()->json(['status' => 200, 'message' => 'Ticket confirmed successfully']);
        } catch (\Exception $e) {
            Log::error('Ticket Confirmation Error: ' . $e->getMessage(), ['params' => $params]);
            return response()->json(['status' => 500, 'message' => 'Ticket confirmation failed'], 500);
        }
    }
    private function handleBalanceInquiry($params)
    {
        // Log the balance inquiry
        Log::info('Processing Balance Inquiry:', $params);
        
        // Simply return success response without any validation
        return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
    }
    private function handleBalanceDebit($params)
    {
        // Log the balance debit
        Log::info('Processing Balance Debit:', $params);
        
        // Simply return success response
        return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
    }
    private function handleLowBalanceInquiry($params)
    {
        // Log the low balance inquiry
        Log::info('Processing Low Balance Inquiry:', $params);
        
        // Simply return success response
        return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
    }
    private function handleMsPosting($params)
    {
        // Log the MS Posting
        Log::info('Processing MS Posting:', $params);
        
        // Simply return success response
        return response()->json(['status' => 200, 'message' => 'Transaction completed successfully']);
    }
}