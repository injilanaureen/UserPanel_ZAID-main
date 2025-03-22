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
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BusTicketController extends Controller
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

    public function getSourceCity()
    {
        return Inertia::render('Admin/busTicket/getSourceCity');
    }

    public function fetchSourceCities()
    {
        try {
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);

            // Fetch from API
            $response = Http::withHeaders([
                'accept' => 'application/json',
                'User-Agent' => $this->partnerId,
                'Token' => $jwtToken,
            ])->post('https://api.paysprint.in/api/v1/service/bus/ticket/source');
            
            if (!$response->successful()) {
                \Log::error('API Error: ' . $response->status() . ' - ' . $response->body());
                throw new \Exception('API request failed with status: ' . $response->status());
            }
            
            $data = $response->json();
            
            if (isset($data['status']) && $data['status'] && isset($data['data']['cities'])) {
                // Clear existing data
                SourceCity::truncate();
                
                // Store all cities, including the id field
                foreach ($data['data']['cities'] as $city) {
                    SourceCity::create([
                        'id' => $city['id'], // Add the id field
                        'city' => $city['name'],
                        'state' => $city['state'],
                        'location_type' => $city['locationType'],
                        'coordinates' => ($city['latitude'] ?? '') . ',' . ($city['longitude'] ?? '')
                    ]);
                }
                
                // Fetch all cities from the database to confirm they were saved
                $cities = SourceCity::all()->map(function ($city) {
                    $coordinates = explode(',', $city->coordinates);
                    return [
                        'id' => $city->id, // Include id in the response
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
                        'count' => $cities->count() // Add count for debugging
                    ]
                ]);
            } else {
                \Log::error('Invalid data structure: ' . json_encode($data));
                throw new \Exception('Invalid data structure received from API');
            }
        } catch (\Exception $e) {
            \Log::error('Failed to fetch cities: ' . $e->getMessage());
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
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        try {

            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);
    
            $response = Http::withHeaders([
                'accept' => 'application/json',
                'content-type' => 'application/json',
                'User-Agent' => $this->partnerId,
                'Token' => $jwtToken,
            ])->post('https://api.paysprint.in/api/v1/service/bus/ticket/availabletrips', $request->all());
    
            $jsonResponse = $response->json();
            
            // Add additional error checking
            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . ($jsonResponse['message'] ?? 'Unknown error'));
            }
    
            return response()->json($jsonResponse);
    
        } catch (\Exception $e) {
            \Log::error('Bus API Error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch trips: ' . $e->getMessage(),
                'error' => $e->getMessage()
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
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        try {
            $request->validate([
                'trip_id' => 'required|string',
            ]);
    
            \Log::info('Fetching trip details for trip_id: ' . $request->trip_id);
    
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'User-Agent' => $this->partnerId,
                'Token' => $jwtToken,
            ])->post('https://api.paysprint.in/api/v1/service/bus/ticket/tripdetails', [
                'trip_id' => $request->trip_id
            ]);
    
            \Log::info('API Response:', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);
    
            if (!$response->successful()) {
                \Log::error('API request failed', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                throw new \Exception('API request failed: ' . $response->status());
            }
    
            $data = $response->json();
    
            if (!isset($data['status'])) {
                throw new \Exception('Invalid response format from API');
            }
    
            if (!$data['status']) {
                throw new \Exception($data['message'] ?? 'API returned error status');
            }
    
            return response()->json([
                'status' => true,
                'data' => $data['data'] ?? null,
                'message' => $data['message'] ?? 'Success'
            ]);
    
        } catch (\Exception $e) {
            \Log::error('Failed to fetch trip details: ' . $e->getMessage());
            
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
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);

        try {
            // Validate input
            $request->validate([
                'refid' => 'required|integer',
                'amount' => 'required|integer',
                'base_fare' => 'required|string',
                'blockKey' => 'required|string',
                'passenger_phone' => 'required|string',
                'passenger_email' => 'required|email'
            ]);

            // API call
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'User-Agent' => $this->partnerId,
                'Token' => $jwtToken,
            ])->post('https://api.paysprint.in/api/v1/service/bus/ticket/bookticket', [
                'refid' => $request->refid,
                'amount' => $request->amount,
                'base_fare' => $request->base_fare,
                'blockKey' => $request->blockKey,
                'passenger_phone' => $request->passenger_phone,
                'passenger_email' => $request->passenger_email
            ]);

            // Convert response to JSON
            $responseData = $response->json();

            // Store data in database
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
                'success' => $responseData['status'] ?? false, // Use actual booking status
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
            // Validate the incoming request
            $request->validate([
                'availableTripId' => 'required|numeric',
                'boardingPointId' => 'required|numeric',
                'droppingPointId' => 'required|numeric',
                'source' => 'required|string',
                'destination' => 'required|string',
                'bookingType' => 'required|string|in:ONLINE,OFFLINE,STANDARD', // Adjust options as needed
                'serviceCharge' => 'required|numeric',
                'paymentMode' => 'required|string|in:CASH,CARD,UPI,NETBANKING', // Adjust options as needed
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

            // Example API call to an external service (replace with your actual API endpoint)
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=', // Your API key
                'token' => 'your-auth-token-here', // Replace with actual token
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/bus/ticket/block', $request->all());

            // Check if the request was successful
            if (!$response->successful()) {
                return response()->json([
                    'status' => 'FAILED',
                    'message' => $response->json('message', 'Failed to block ticket'),
                ], $response->status());
            }

            $data = $response->json();

            if ($data['status'] !== true) { // Adjust based on your API's success indicator
                return response()->json([
                    'status' => 'FAILED',
                    'message' => $data['message'] ?? 'Failed to block ticket',
                ], 400);
            }

            return response()->json([
                'status' => 'SUCCESS',
                'message' => 'Ticket blocked successfully',
                'data' => $data['data'] ?? $request->all(), // Return API data or request data
            ]);

        } catch (\Exception $e) {
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

    public function fetchandstoreboardingpointdetails(Request $request) {
        try {
            $requestId = time() . rand(1000, 9999);
            $jwtToken = $this->generateJwtToken($requestId);
            // Validate input
            $request->validate([
                'bpId' => 'required|integer',
                'trip_id' => 'required|integer',
            ]);
    
            // API call
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'User-Agent' => $this->partnerId,
                'Token' => $jwtToken,
            ])->post('https://api.paysprint.in/api/v1/service/bus/ticket/boardingPoint', [
                'bpId' => $request->bpId, 
                'trip_id' => $request->trip_id,
            ]);
    
            // Convert response to JSON
            $responseData = $response->json();
    
            // Check if response is successful and contains 'data'
            if (!isset($responseData['data']) || !isset($responseData['status'])) {
                return response()->json([
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Invalid response from API',
                ], 400);
            }
    
            // Store data in database
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
    
                'api_response' => $responseData // Sending full response for debugging
            ]);
        } catch (\Exception $e) {
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
    
            // API Call
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzkzNDM0NDIsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5MzQzNDQyIn0.oenxjDuLp4lPTB_fCDZL98ENr6I-ULmw0u9XkGgWZI4'
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/bus/ticket/check_booked_ticket', [
                'refid' => $request->refid,
            ]);
    
            $responseData = $response->json();
    
            if (!isset($responseData['data']) || !isset($responseData['status'])) {
                return response()->json([
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Invalid response from API',
                ], 400);
            }
    
            // Extract data
            $data = $responseData['data'];
            $inventory = $data['inventoryItems'];
            $passenger = $inventory['passenger'];
    
            // Save to database
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
                'data' => $responseData
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error occurred: ' . $e->getMessage()
            ], 500);
        }

    }
    public function getCancelationData(Request $request)
{
    if ($request->isMethod('post')) {
        $referenceId = $request->input('referenceId');

        $url = 'https://sit.paysprint.in/service-api/api/v1/service/bus/ticket/get_cancellation_data';

        $headers = [
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzkyNTM1MzcsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5MjUzNTM3In0.RSV5uUuUgx5XdD2h6rdAR5Kbh6DZVCE7mb85JLCTFP0',
            'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];

        try {
            $response = Http::withHeaders($headers)
                ->post($url, [
                    'refid' => $referenceId // ✅ Updated key to match API expectation
                ]);

            $data = $response->json();

            return response()->json([
                'status' => $response->successful(),
                'data' => $data,
                'message' => $response->successful() ? 'Cancellation data retrieved successfully' : ($data['message'] ?? 'Failed to retrieve cancellation data')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error connecting to the service: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    return Inertia::render('Admin/busTicket/getCancelationData');
}

}

