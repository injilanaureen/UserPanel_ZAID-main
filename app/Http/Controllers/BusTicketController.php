<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Models\SourceCity;
use App\Models\AvailableTrip;
use App\Models\BusCurrentTrip;
use App\Models\BookBusTicket;
use App\Models\getboardingpointdetails;
use App\Models\getBookedTickets;
use App\Models\ApiManagement;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Jwt; 
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BusTicketController extends Controller
{
    private $partnerId = 'PS005962'; 
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

   
    private function callDynamicApi($apiName, $payload = [], $additionalHeaders = [])
    {
        try {
            $requestId = \App\Helpers\ApiHelper::generateRequestId();
            $jwtToken = \App\Helpers\ApiHelper::generateJwtToken($requestId, $this->partnerId, $this->secretKey);
            $headers = \App\Helpers\ApiHelper::getApiHeaders($jwtToken, $additionalHeaders, $this->partnerId);
            $apiUrl = \App\Helpers\ApiHelper::getApiUrl($apiName);

            $response = Http::withHeaders($headers)
                ->post($apiUrl, $payload);

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

    public function getSourceCity()
    {
        return Inertia::render('Admin/busTicket/getSourceCity');
    }

   public function fetchSourceCities()
    {
        try {
            $responseData = $this->callDynamicApi('BusBooking:GetSourceCity');

            if (isset($responseData['status']) && $responseData['status'] && isset($responseData['data']['cities'])) {
                SourceCity::truncate();

                foreach ($responseData['data']['cities'] as $city) {
                    SourceCity::create([
                        'id' => $city['id'],
                        'city' => $city['name'],
                        'state' => $city['state'],
                        'location_type' => $city['locationType'],
                        'coordinates' => ($city['latitude'] ?? '') . ',' . ($city['longitude'] ?? '')
                    ]);
                }

                $cities = SourceCity::all()->map(function ($city) {
                    $coordinates = explode(',', $city->coordinates);
                    return [
                        'id' => $city->id,
                        'name' => $city->city,
                        'state' => $city->state,
                        'locationType' => $city->location_type,
                        'latitude' => $coordinates[0] ?? '',
                        'longitude' => $coordinates[1] ?? ''
                    ];
                });

                return response()->json([
                    'status' => true,
                    'data' => [
                        'cities' => $cities,
                        'count' => $cities->count()
                    ]
                ]);
            }

            throw new \Exception($responseData['message'] ?? 'Invalid data structure');
        } catch (\Exception $e) {
            Log::error('Failed to fetch cities: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch or store cities',
                'error' => $e->getMessage()
            ], 500);
        }
    }




    public function getAvailableTrip()
    {
        return Inertia::render('Admin/busTicket/getAvailableTrip');
    }
    public function fetchAndStoreAvailableTrips(Request $request)
    {
        try {
            $responseData = $this->callDynamicApi('BusBooking:GetAvailableTrips', $request->all());

            if (!isset($responseData['status']) || !$responseData['status']) {
                throw new \Exception($responseData['message'] ?? 'Failed to fetch trips');
            }

            return response()->json($responseData);
        } catch (\Exception $e) {
            Log::error('Bus API Error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch trips: ' . $e->getMessage()
            ], 500);
        }
    }

    //Current Trip
    
    public function getCurrentTripDetails()
    {
        return Inertia::render('Admin/busTicket/getCurrentTripDetails');
    }

    public function fetchTripDetails(Request $request)
    {
        try {
            $request->validate([
                'trip_id' => 'required|string',
            ]);

            $responseData = $this->callDynamicApi('BusBooking:TripDetails', [
                'trip_id' => $request->trip_id
            ]);

            if (!isset($responseData['status']) || !$responseData['status']) {
                throw new \Exception($responseData['message'] ?? 'API returned error status');
            }

            return response()->json([
                'status' => true,
                'data' => $responseData['data'] ?? null,
                'message' => $responseData['message'] ?? 'Success'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch trip details: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch trip details: ' . $e->getMessage()
            ], 500);
        }
    }

    public function storeTripDetails(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'trip_id' => 'required',
                'boarding_points' => 'required|array',
                'boarding_points.*.location' => 'required|string',
                'boarding_points.*.address' => 'required|string',
                'boarding_points.*.city' => 'required|string',
                'boarding_points.*.time' => 'required|integer',
                'boarding_points.*.landmark' => 'nullable|string',
                'boarding_points.*.contact' => 'nullable|string',
            ]);

            // Clear existing records for this trip
            BusCurrentTrip::where('trip_id', $request->trip_id)->delete();

            // Store boarding points in the database
            foreach ($request->boarding_points as $point) {
                BusCurrentTrip::create([
                    'trip_id' => $request->trip_id,
                    'location' => $point['location'],
                    'address' => $point['address'],
                    'city' => $point['city'],
                    'time' => $point['time'],
                    'landmark' => $point['landmark'],
                    'contact' => $point['contact']
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Trip details stored successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error storing trip details: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error storing trip details: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getbookTicket()
    {
        return Inertia::render('Admin/busTicket/bookTicket');
    }
    public function bookandstorebookticket(Request $request)
    {
        try {
            $request->validate([
                'refid' => 'required|integer',
                'amount' => 'required|integer',
                'base_fare' => 'required|string',
                'blockKey' => 'required|string',
                'passenger_phone' => 'required|string',
                'passenger_email' => 'required|email'
            ]);

            $payload = [
                'refid' => $request->refid,
                'amount' => $request->amount,
                'base_fare' => $request->base_fare,
                'blockKey' => $request->blockKey,
                'passenger_phone' => $request->passenger_phone,
                'passenger_email' => $request->passenger_email
            ];

            $responseData = $this->callDynamicApi('BusBooking:BookTicket', $payload);

            $ticket = BookBusTicket::create([
                'refid' => $request->refid,
                'amount' => $request->amount,
                'base_fare' => $request->base_fare,
                'blockKey' => $request->blockKey,
                'passenger_phone' => $request->passenger_phone,
                'passenger_email' => $request->passenger_email,
                'status' => $responseData['status'] ?? false,
                'response_code' => $responseData['response_code'] ?? null,
                'message' => $responseData['message'] ?? null
            ]);

            return response()->json([
                'success' => $responseData['status'] ?? false,
                'message' => $responseData['message'] ?? 'Ticket booking failed',
                'data' => $ticket
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function blockTicket(){
        return Inertia::render('Admin/busTicket/blockTicket');
    }
  public function blockTicketApi(Request $request)
    {
        try {
            $validated = $request->validate([
                'availableTripId' => 'required|numeric',
                'boardingPointId' => 'required|numeric',
                'droppingPointId' => 'required|numeric',
                'source' => 'required|string',
                'destination' => 'required|string',
                'bookingType' => 'required|string|in:ONLINE,OFFLINE,STANDARD',
                'serviceCharge' => 'required|numeric',
                'paymentMode' => 'required|string|in:CASH,CARD,UPI,NETBANKING',
                'inventoryItems' => 'required|array',
                'inventoryItems.0.seatName' => 'required|string',
                'inventoryItems.0.fare' => 'required|numeric',
                'inventoryItems.0.serviceTax' => 'required|numeric',
                'inventoryItems.0.operatorServiceCharge' => 'required|numeric',
                'inventoryItems.0.ladiesSeat' => 'required|string|in:true,false',
                'inventoryItems.0.passenger.name' => 'required|string',
                'inventoryItems.0.passenger.mobile' => 'required|numeric',
                'inventoryItems.0.passenger.title' => 'required|string|in:Mr,Ms,Mrs',
                'inventoryItems.0.passenger.email' => 'required|email',
                'inventoryItems.0.passenger.age' => 'required|numeric',
                'inventoryItems.0.passenger.gender' => 'required|string|in:MALE,FEMALE',
                'inventoryItems.0.passenger.address' => 'required|string',
                'inventoryItems.0.passenger.idType' => 'required|string',
                'inventoryItems.0.passenger.idNumber' => 'required|string',
                'inventoryItems.0.passenger.primary' => 'required|string|in:0,1',
            ]);

            $responseData = $this->callDynamicApi('BusBooking:BlockTicket', $validated);

            if (!isset($responseData['status']) || !$responseData['status']) {
                return response()->json([
                    'status' => 'FAILED',
                    'message' => $responseData['message'] ?? 'Failed to block ticket',
                    'external_data' => $responseData,
                ], 400);
            }

            return response()->json([
                'status' => 'SUCCESS',
                'message' => 'Ticket blocked successfully',
                'data' => $responseData['data'] ?? $validated,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'FAILED',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Block Ticket API Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'FAILED',
                'message' => 'Error processing request: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function getboardingpointdetails()
    {
        return Inertia::render('Admin/busTicket/getBoardingPointDetails');
    }   

    public function fetchandstoreboardingpointdetails(Request $request)
    {
        try {
            $request->validate([
                'bpId' => 'required|integer',
                'trip_id' => 'required|string',
            ]);

            $payload = [
                'bpId' => (int) $request->bpId,
                'trip_id' => $request->trip_id,
            ];

            $responseData = $this->callDynamicApi('BusBooking:GetBoardingPointDetails', $payload);

            if (!isset($responseData['data']) || !isset($responseData['status'])) {
                return response()->json([
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Invalid response from API',
                    'api_response' => $responseData
                ], 400);
            }

            $ticket = getboardingpointdetails::create([
                'bpId' => $request->bpId,
                'trip_id' => $request->trip_id,
                'response_code' => $responseData['response_code'] ?? null,
                'status' => $responseData['status'],
                'address' => $responseData['data']['address'] ?? '',
                'contactnumber' => $responseData['data']['contactnumber'] ?? '',
                'id' => $responseData['data']['id'] ?? '',
                'landmark' => $responseData['data']['landmark'] ?? '',
                'locationName' => $responseData['data']['locationName'] ?? '',
                'name' => $responseData['data']['name'] ?? '',
                'rbMasterId' => $responseData['data']['rbMasterId'] ?? ''
            ]);

            return response()->json([
                'success' => true,
                'api_response' => $responseData
            ]);
        } catch (\Exception $e) {
            Log::error('Error in fetchandstoreboardingpointdetails: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getcheckBookedTickets()
    {
        return Inertia::render('Admin/busTicket/checkBookedTickets');
    }
    
    public function fetchBookedTickets(Request $request)
    {
        try {
            $request->validate([
                'refid' => 'required|integer',
            ]);

            $responseData = $this->callDynamicApi('BusBooking:CheckBookedTicket', [
                'refid' => $request->refid,
            ]);

            if (!isset($responseData['data']) || !isset($responseData['status'])) {
                return response()->json([
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Invalid response from API',
                ], 400);
            }

            $data = $responseData['data'];
            $inventory = $data['inventoryItems'] ?? null;
            $passenger = $inventory['passenger'] ?? null;

            if (!$inventory || !$passenger) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing inventory or passenger data',
                ], 400);
            }

            getBookedTickets::updateOrCreate(
                ['pnr' => $data['pnr']],
                [
                    'tin' => $data['tin'],
                    'status' => $data['status'],
                    'bus_type' => $data['busType'],
                    'source_city' => $data['sourceCity'],
                    'source_city_id' => $data['sourceCityId'],
                    'destination_city' => $data['destinationCity'],
                    'destination_city_id' => $data['destinationCityId'],
                    'date_of_issue' => $data['dateOfIssue'],
                    'doj' => $data['doj'],
                    'pickup_location' => $data['pickupLocation'],
                    'pickup_location_id' => $data['pickupLocationId'],
                    'pickup_location_address' => $data['pickUpLocationAddress'],
                    'pickup_location_landmark' => $data['pickupLocationLandmark'],
                    'drop_location' => $data['dropLocation'],
                    'drop_location_id' => $data['dropLocationId'],
                    'drop_location_address' => $data['dropLocationAddress'],
                    'drop_location_landmark' => $data['dropLocationLandmark'],
                    'pickup_time' => $data['pickupTime'],
                    'drop_time' => $data['dropTime'],
                    'prime_departure_time' => $data['primeDepartureTime'],
                    'fare' => $inventory['fare'],
                    'seat_name' => $inventory['seatName'],
                    'passenger_name' => $passenger['name'],
                    'passenger_mobile' => $passenger['mobile'],
                    'passenger_email' => $passenger['email'],
                    'passenger_id_type' => $passenger['idType'],
                    'passenger_id_number' => $passenger['idNumber'],
                    'mticket_enabled' => filter_var($data['MTicketEnabled'], FILTER_VALIDATE_BOOLEAN),
                    'partial_cancellation_allowed' => filter_var($data['partialCancellationAllowed'], FILTER_VALIDATE_BOOLEAN),
                    'has_special_template' => filter_var($data['hasSpecialTemplate'], FILTER_VALIDATE_BOOLEAN),
                    'has_rtc_breakup' => filter_var($data['hasRTCBreakup'], FILTER_VALIDATE_BOOLEAN),
                    'cancellation_policy' => $data['cancellationPolicy'],
                    'cancellation_message' => $data['cancellationMessage'],
                    'cancellation_calculation_timestamp' => $data['cancellationCalculationTimestamp'],
                    'primo_booking' => filter_var($data['primoBooking'], FILTER_VALIDATE_BOOLEAN),
                    'vaccinated_bus' => filter_var($data['vaccinatedBus'], FILTER_VALIDATE_BOOLEAN),
                    'vaccinated_staff' => filter_var($data['vaccinatedStaff'], FILTER_VALIDATE_BOOLEAN),
                    'service_charge' => $data['serviceCharge'],
                    'operator_service_charge' => $inventory['operatorServiceCharge'],
                    'service_tax' => $inventory['serviceTax'],
                    'travels' => $data['travels'],
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Ticket details saved successfully!',
                'data' => $responseData['data']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
public function ticketCancellation()
{
    return Inertia::render('Admin/busTicket/ticketCancellation');
}

public function cancelTicket(Request $request)
    {
        try {
            $request->validate([
                'refId' => 'required',
                'seatNumber' => 'required|string',
            ]);

            $payload = [
                'refid' => $request->refId,
                'seatsToCancel' => [
                    '0' => $request->seatNumber
                ]
            ];

            $responseData = $this->callDynamicApi('BusBooking:TicketCancellation', $payload);

            return response()->json($responseData);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

}

