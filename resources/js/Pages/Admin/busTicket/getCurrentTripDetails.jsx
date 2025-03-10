import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

const GetCurrentTripDetails = () => {
  const [tripId, setTripId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const getCsrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  };

  const transformApiResponse = (apiData) => {
    // Fix for the map error - ensure boardingTimes is an array before mapping
    let boardingPoints = [];
    
    // Check if boardingTimes exists and convert to array if needed
    if (apiData.boardingTimes) {
      // If it's an object with numeric keys, convert to array
      if (typeof apiData.boardingTimes === 'object' && !Array.isArray(apiData.boardingTimes)) {
        boardingPoints = Object.values(apiData.boardingTimes);
      } 
      // If it's already an array, use it directly
      else if (Array.isArray(apiData.boardingTimes)) {
        boardingPoints = apiData.boardingTimes;
      }
      // If it's a string (possibly JSON), try to parse it
      else if (typeof apiData.boardingTimes === 'string') {
        try {
          boardingPoints = JSON.parse(apiData.boardingTimes);
          // Check if parsed result is an object with numeric keys
          if (typeof boardingPoints === 'object' && !Array.isArray(boardingPoints)) {
            boardingPoints = Object.values(boardingPoints);
          }
        } catch (e) {
          console.error('Failed to parse boardingTimes:', e);
          boardingPoints = [];
        }
      }
    }

    // Now map the array of boarding points
    boardingPoints = boardingPoints.map(bp => ({
      id: bp.bpId,
      name: bp.bpName || bp.name || 'Unknown Location',
      address: bp.address || 'No address provided',
      city: bp.city || 'Unknown City',
      contactNumber: bp.contactNumber || bp.contact || null,
      landmark: bp.landmark || null,
      time: parseInt(bp.time) || 0,
      isPrime: bp.prime === 'true'
    })).sort((a, b) => a.time - b.time);

    const primaryBoardingPoint = boardingPoints.find(bp => bp.isPrime) || boardingPoints[0];

    // Similar fix for passengers
    let passengers = [];
    if (apiData.passengers) {
      // If it's an object with numeric keys, convert to array
      if (typeof apiData.passengers === 'object' && !Array.isArray(apiData.passengers)) {
        passengers = Object.values(apiData.passengers);
      } 
      // If it's already an array, use it directly
      else if (Array.isArray(apiData.passengers)) {
        passengers = apiData.passengers;
      }
      // If it's a string (possibly JSON), try to parse it
      else if (typeof apiData.passengers === 'string') {
        try {
          passengers = JSON.parse(apiData.passengers);
          // Check if parsed result is an object with numeric keys
          if (typeof passengers === 'object' && !Array.isArray(passengers)) {
            passengers = Object.values(passengers);
          }
        } catch (e) {
          console.error('Failed to parse passengers:', e);
          passengers = [];
        }
      }
    }

    // Now map the array of passengers
    passengers = passengers.map(passenger => ({
      name: passenger.name || 'Unknown',
      age: passenger.age || '0',
      gender: passenger.gender || 'Not Specified',
      seatNumber: passenger.seatNumber || 'Not Assigned',
      fare: passenger.fare || '0',
      status: passenger.status || 'Confirmed',
      idType: passenger.idType || null,
      idNumber: passenger.idNumber || null
    }));

    return {
      pnrNumber: apiData.pnrNumber || 'N/A',
      bookingId: apiData.bookingId || 'N/A',
      travelDate: apiData.travelDate || 'N/A',
      status: apiData.status || 'Unknown',
      operatorName: apiData.operatorName || 'Unknown Operator',
      busType: apiData.busType || 'Standard',
      source: apiData.source || 'N/A',
      destination: apiData.destination || 'N/A',
      departureTime: primaryBoardingPoint?.time || 0,
      boardingTime: primaryBoardingPoint?.time || 0,
      boardingPoint: primaryBoardingPoint?.name || 'N/A',
      duration: apiData.duration || '0',
      totalFare: apiData.totalFare || '0',
      boardingPoints: boardingPoints,
      passengers: passengers,
      additionalInfo: apiData.additionalInfo || null,
      cancellationPolicy: apiData.cancellationPolicy || null,
      partialCancellationAllowed: apiData.partialCancellationAllowed || false,
      operatorContact: apiData.operatorContact || null,
      operatorAddress: apiData.operatorAddress || null
    };
  };

  const saveTripDetails = async (transformedData) => {
    try {
      // Validate and ensure all required fields are present for each boarding point
      const boardingPointsData = transformedData.boardingPoints.map(point => {
        // Ensure each required field has a value, even if just a placeholder
        return {
          location: point.name || 'Unknown Location',
          address: point.address || 'No address provided',
          city: point.city || 'Unknown City',
          time: point.time || 0,
          landmark: point.landmark || 'No landmark',
          contact: point.contactNumber || 'No contact'
        };
      });
      
      // Log the data being sent to help with debugging
      console.log('Sending trip details:', {
        trip_id: tripId,
        boarding_points: boardingPointsData
      });

      const response = await fetch('/admin/busTicket/storeTripDetails', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify({
          trip_id: tripId,
          boarding_points: boardingPointsData
        })
      });

      const result = await response.json();
      console.log('Store trip details response:', result);
      
      if (!result.status) {
        throw new Error(result.message || 'Failed to save trip details');
      }

      setSaveStatus({ type: 'success', message: 'Trip details saved successfully' });
    } catch (error) {
      console.error('Error storing trip details:', error);
      setSaveStatus({ 
        type: 'error', 
        message: `Error storing trip details: ${error.message || 'Unknown error'}` 
      });
    }
  };

  const getCurrentTripDetails = async () => {
    if (!tripId) {
      setError('Please enter a Trip ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setTripDetails(null);
    setSaveStatus(null);

    try {
      // Updated endpoint to match the new route
      const response = await fetch('/admin/busTicket/fetchTripDetails', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify({
          trip_id: tripId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to fetch trip details');
      }

      // Add debugging
      console.log('API Response:', data);
      console.log('API Data:', data.data);
      console.log('Boarding Times Type:', typeof data.data.boardingTimes);
      if (data.data.boardingTimes) {
        console.log('Boarding Times Value:', data.data.boardingTimes);
      }

      const transformedData = transformApiResponse(data.data);
      console.log('Transformed Data:', transformedData);
      setTripDetails(transformedData);
      
      // Save the trip details after successful fetch
      await saveTripDetails(transformedData);
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message || 'Failed to load trip details');
    }

    setLoading(false);
  };

  const formatTime = (time) => {
    if (time === null || time === undefined) return 'N/A';
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6 mb-4">
            <h2 className="text-3xl font-semibold text-white">Enter Trip ID</h2>
          </div>
        
          <div className="flex space-x-4">
            <input
              type="text"
              className="border rounded-lg px-4 py-2 w-full"
              placeholder="Enter Trip ID..."
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              onClick={getCurrentTripDetails}
            >
              Fetch Details
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center min-h-64">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {saveStatus && (
          <div className={`p-4 border rounded-lg ${
            saveStatus.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <p className={saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}>
              {saveStatus.message}
            </p>
          </div>
        )}

        {tripDetails && (
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold">Current Trip Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Journey Information</h3>
                <p><span className="font-medium">PNR:</span> {tripDetails.pnrNumber}</p>
                <p><span className="font-medium">Booking ID:</span> {tripDetails.bookingId}</p>
                <p><span className="font-medium">Travel Date:</span> {tripDetails.travelDate}</p>
                <p><span className="font-medium">Status:</span> {tripDetails.status}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Bus Details</h3>
                <p><span className="font-medium">Operator:</span> {tripDetails.operatorName}</p>
                <p><span className="font-medium">Bus Type:</span> {tripDetails.busType}</p>
                <p><span className="font-medium">From:</span> {tripDetails.source}</p>
                <p><span className="font-medium">To:</span> {tripDetails.destination}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Timing Details</h3>
                <p><span className="font-medium">Departure:</span> {formatTime(tripDetails.departureTime)}</p>
                <p><span className="font-medium">Duration:</span> {tripDetails.duration} mins</p>
                <p><span className="font-medium">Boarding Point:</span> {tripDetails.boardingPoint}</p>
                <p><span className="font-medium">Boarding Time:</span> {formatTime(tripDetails.boardingTime)}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Fare Details</h3>
                <p><span className="font-medium">Total Fare:</span> ₹{tripDetails.totalFare}</p>
              </div>
            </div>

            {tripDetails.passengers?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Passenger Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tripDetails.passengers.map((passenger, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <p><span className="font-medium">Name:</span> {passenger.name}</p>
                      <p><span className="font-medium">Age:</span> {passenger.age}</p>
                      <p><span className="font-medium">Gender:</span> {passenger.gender}</p>
                      <p><span className="font-medium">Seat Number:</span> {passenger.seatNumber}</p>
                      <p><span className="font-medium">Status:</span> {passenger.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tripDetails.boardingPoints?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">All Boarding Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tripDetails.boardingPoints.map((point, index) => (
                    <div key={point.id || index} className="p-4 border rounded-lg">
                      <p><span className="font-medium">Location:</span> {point.name}</p>
                      <p><span className="font-medium">Address:</span> {point.address}</p>
                      <p><span className="font-medium">City:</span> {point.city}</p>
                      <p><span className="font-medium">Time:</span> {formatTime(point.time)}</p>
                      {point.landmark && (
                        <p><span className="font-medium">Landmark:</span> {point.landmark}</p>
                      )}
                      {point.contactNumber && (
                        <p><span className="font-medium">Contact:</span> {point.contactNumber}</p>
                      )}
                      {point.isPrime && (
                        <p className="text-blue-600 font-medium">Primary Boarding Point</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tripDetails.additionalInfo && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <p>{tripDetails.additionalInfo}</p>
              </div>
            )}

            {tripDetails.cancellationPolicy && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Cancellation Policy</h3>
                <p>{tripDetails.cancellationPolicy}</p>
                <p><span className="font-medium">Partial Cancellation:</span> {
                  tripDetails.partialCancellationAllowed ? 'Allowed' : 'Not Allowed'
                }</p>
              </div>
            )}

            {(tripDetails.operatorContact || tripDetails.operatorAddress) && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Operator Details</h3>
                {tripDetails.operatorContact && (
                  <p><span className="font-medium">Contact:</span> {tripDetails.operatorContact}</p>
                )}
                {tripDetails.operatorAddress && (
                  <p><span className="font-medium">Address:</span> {tripDetails.operatorAddress}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GetCurrentTripDetails;