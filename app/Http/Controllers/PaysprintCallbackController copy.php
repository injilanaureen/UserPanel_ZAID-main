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

        // Validate common fields first
        $this->validateCommonFields($request);

        // Get event type
        $event = $request->input('event');
        $params = $request->input('param');

        // Process based on event type
        if ($event === 'BUS_TICKET_BOOKING_DEBIT_CONFIRMATION') {
            // Additional validation for debit confirmation
            $this->validateDebitFields($request);
            return $this->handleDebitTransaction($params);
        } elseif ($event === 'BUS_TICKET_BOOKING_CREDIT_CONFIRMATION') {
            // Additional validation for credit confirmation
            $this->validateCreditFields($request);
            return $this->handleCreditTransaction($params);
        } elseif ($event === 'BUS_TICKET_BOOKING_CONFIRMATION') {
            // Additional validation for ticket confirmation
            $this->validateTicketConfirmation($request);
            return $this->handleTicketConfirmation($params);
        }

        return response()->json(['status' => 400, 'message' => 'Invalid event type'], 400);
    }

    /**
     * Validate common fields for all event types
     */
    private function validateCommonFields(Request $request)
    {
        $request->validate([
            'event' => 'required|string',
            'param' => 'required|array',
            'param.amount' => 'required|string',
            'param.base_fare' => 'required|string',
            'param.comm' => 'required|string',
            'param.tds' => 'required|string',
            'param.total_deduction' => 'required|string',
            'param.customer_mobile' => 'required|string',
            'param.refid' => 'required|string',
            'param.customer_email' => 'required|email',
        ]);
    }

    /**
     * Validate additional fields for debit confirmation
     */
    private function validateDebitFields(Request $request)
    {
        $request->validate([
            'param.block_id' => 'required|string',
        ]);
    }

    /**
     * Validate additional fields for credit confirmation
     */
    private function validateCreditFields(Request $request)
    {
        $request->validate([
            'param.block_id' => 'required|string',
        ]);
    }

    /**
     * Validate additional fields for ticket confirmation
     */
    private function validateTicketConfirmation(Request $request)
    {
        $request->validate([
            'param.blockKey' => 'required|string',
            'param.pnr_no' => 'required|string',
            'param.seat_details' => 'required|array',
            
            // Seat details - main information
            'param.seat_details.sourceCity' => 'required|string',
            'param.seat_details.sourceCityId' => 'required|string',
            'param.seat_details.destinationCity' => 'required|string',
            'param.seat_details.destinationCityId' => 'required|string',
            'param.seat_details.busType' => 'required|string',
            'param.seat_details.travels' => 'required|string',
            'param.seat_details.doj' => 'required|string',
            'param.seat_details.pickupLocation' => 'required|string',
            'param.seat_details.dropLocation' => 'required|string',
            'param.seat_details.pnr' => 'required|string',
            'param.seat_details.status' => 'required|string',
            
            // Additional seat details
            'param.seat_details.bookingFee' => 'required|string',
            'param.seat_details.cancellationCalculationTimestamp' => 'required|string',
            'param.seat_details.cancellationMessage' => 'present|string',
            'param.seat_details.cancellationPolicy' => 'required|string',
            'param.seat_details.dateOfIssue' => 'required|string',
            'param.seat_details.dropLocationAddress' => 'required|string',
            'param.seat_details.dropLocationId' => 'required|string',
            'param.seat_details.dropLocationLandmark' => 'required|string',
            'param.seat_details.dropTime' => 'required|string',
            'param.seat_details.firstBoardingPointTime' => 'required|string',
            'param.seat_details.hasRTCBreakup' => 'required|string',
            'param.seat_details.hasSpecialTemplate' => 'required|string',
            'param.seat_details.inventoryId' => 'required|string',
            'param.seat_details.MTicketEnabled' => 'required|string',
            'param.seat_details.partialCancellationAllowed' => 'required|string',
            'param.seat_details.pickUpContactNo' => 'required|string',
            'param.seat_details.pickUpLocationAddress' => 'required|string',
            'param.seat_details.pickupLocationId' => 'required|string',
            'param.seat_details.pickupLocationLandmark' => 'required|string',
            'param.seat_details.pickupTime' => 'required|string',
            'param.seat_details.primeDepartureTime' => 'required|string',
            'param.seat_details.primoBooking' => 'required|string',
            'param.seat_details.tin' => 'required|string',
            'param.seat_details.vaccinatedBus' => 'required|string',
            'param.seat_details.vaccinatedStaff' => 'required|string',
            'param.seat_details.serviceCharge' => 'required|string',
            
            // Rescheduling policy
            'param.seat_details.reschedulingPolicy' => 'required|array',
            'param.seat_details.reschedulingPolicy.reschedulingCharge' => 'required|string',
            'param.seat_details.reschedulingPolicy.windowTime' => 'required|string',
            
            // Inventory items
            'param.seat_details.inventoryItems' => 'required|array',
            'param.seat_details.inventoryItems.*.fare' => 'required|string',
            'param.seat_details.inventoryItems.*.ladiesSeat' => 'required|string',
            'param.seat_details.inventoryItems.*.malesSeat' => 'required|string',
            'param.seat_details.inventoryItems.*.operatorServiceCharge' => 'required|string',
            'param.seat_details.inventoryItems.*.seatName' => 'required|string',
            'param.seat_details.inventoryItems.*.serviceTax' => 'required|string',
            
            // Passenger details
            'param.seat_details.inventoryItems.*.passenger' => 'required|array',
            'param.seat_details.inventoryItems.*.passenger.name' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.address' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.age' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.email' => 'required|email',
            'param.seat_details.inventoryItems.*.passenger.gender' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.idNumber' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.idType' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.mobile' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.primary' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.singleLadies' => 'required|string',
            'param.seat_details.inventoryItems.*.passenger.title' => 'required|string',
        ]);
    }

    private function handleDebitTransaction($params)
    {
        // Log the transaction
        Log::info('Processing Debit Transaction:', $params);

        try {
            // Example: Save booking details in the database
            // Booking::create([
            //     'ref_id' => $params['refid'],
            //     'amount' => $params['amount'],
            //     'customer_mobile' => $params['customer_mobile'],
            //     'block_id' => $params['block_id'],
            //     'status' => 'confirmed'
            // ]);

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
            // Example: Mark booking as canceled in the database
            // Booking::where('ref_id', $params['refid'])
            //     ->where('block_id', $params['block_id'])
            //     ->update(['status' => 'canceled']);

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
            $seatDetails = $params['seat_details'];
            $inventoryItems = $seatDetails['inventoryItems'];
            
            // Example: Save ticket details in the database
            // $ticket = Ticket::create([
            //     'pnr_no' => $params['pnr_no'],
            //     'block_id' => $params['blockKey'],  // Note: using blockKey here
            //     'ref_id' => $params['refid'],
            //     'amount' => $params['amount'],
            //     'source_city' => $seatDetails['sourceCity'],
            //     'source_city_id' => $seatDetails['sourceCityId'],
            //     'destination_city' => $seatDetails['destinationCity'],
            //     'destination_city_id' => $seatDetails['destinationCityId'],
            //     'bus_type' => $seatDetails['busType'],
            //     'travels' => $seatDetails['travels'],
            //     'travel_date' => $seatDetails['doj'],
            //     'pickup_location' => $seatDetails['pickupLocation'],
            //     'pickup_location_id' => $seatDetails['pickupLocationId'],
            //     'pickup_location_address' => $seatDetails['pickUpLocationAddress'],
            //     'pickup_location_landmark' => $seatDetails['pickupLocationLandmark'],
            //     'pickup_contact_no' => $seatDetails['pickUpContactNo'],
            //     'pickup_time' => $seatDetails['pickupTime'],
            //     'drop_location' => $seatDetails['dropLocation'],
            //     'drop_location_id' => $seatDetails['dropLocationId'],
            //     'drop_location_address' => $seatDetails['dropLocationAddress'],
            //     'drop_location_landmark' => $seatDetails['dropLocationLandmark'],
            //     'drop_time' => $seatDetails['dropTime'],
            //     'status' => $seatDetails['status'],
            //     'pnr' => $seatDetails['pnr'],
            //     'tin' => $seatDetails['tin'],
            //     'booking_fee' => $seatDetails['bookingFee'],
            //     'cancellation_policy' => $seatDetails['cancellationPolicy'],
            //     'date_of_issue' => $seatDetails['dateOfIssue'],
            //     'service_charge' => $seatDetails['serviceCharge'],
            //     'partial_cancellation_allowed' => $seatDetails['partialCancellationAllowed'],
            //     'm_ticket_enabled' => $seatDetails['MTicketEnabled'],
            //     'rescheduling_charge' => $seatDetails['reschedulingPolicy']['reschedulingCharge'],
            //     'rescheduling_window_time' => $seatDetails['reschedulingPolicy']['windowTime'],
            //     'vaccinated_bus' => $seatDetails['vaccinatedBus'],
            //     'vaccinated_staff' => $seatDetails['vaccinatedStaff']
            // ]);
            //
            // // Save passenger details
            // foreach ($inventoryItems as $item) {
            //     $passenger = $item['passenger'];
            //     TicketPassenger::create([
            //         'ticket_id' => $ticket->id,
            //         'name' => $passenger['name'],
            //         'address' => $passenger['address'],
            //         'age' => $passenger['age'],
            //         'email' => $passenger['email'],
            //         'gender' => $passenger['gender'],
            //         'id_number' => $passenger['idNumber'],
            //         'id_type' => $passenger['idType'],
            //         'mobile' => $passenger['mobile'],
            //         'title' => $passenger['title'],
            //         'seat_name' => $item['seatName'],
            //         'fare' => $item['fare'],
            //         'service_tax' => $item['serviceTax'],
            //         'is_primary' => $passenger['primary'] === 'true',
            //     ]);
            // }

            return response()->json(['status' => 200, 'message' => 'Ticket confirmed successfully']);
        } catch (\Exception $e) {
            Log::error('Ticket Confirmation Error: ' . $e->getMessage(), ['params' => $params]);
            return response()->json(['status' => 500, 'message' => 'Ticket confirmation failed'], 500);
        }
    }
}