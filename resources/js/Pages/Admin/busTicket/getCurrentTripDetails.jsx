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
    const boardingPoints = apiData.boardingTimes?.map(bp => ({
      id: bp.bpId,
      name: bp.bpName,
      address: bp.address,
      city: bp.city,
      contactNumber: bp.contactNumber,
      landmark: bp.landmark,
      time: parseInt(bp.time),
      isPrime: bp.prime === 'true'
    })).sort((a, b) => a.time - b.time) || [];

    const primaryBoardingPoint = boardingPoints.find(bp => bp.isPrime) || boardingPoints[0];

    const passengers = apiData.passengers?.map(passenger => ({
      name: passenger.name,
      age: passenger.age,
      gender: passenger.gender,
      seatNumber: passenger.seatNumber,
      fare: passenger.fare,
      status: passenger.status,
      idType: passenger.idType,
      idNumber: passenger.idNumber
    })) || [];

    return {
      pnrNumber: apiData.pnrNumber,
      bookingId: apiData.bookingId,
      travelDate: apiData.travelDate,
      status: apiData.status,
      operatorName: apiData.operatorName,
      busType: apiData.busType,
      source: apiData.source,
      destination: apiData.destination,
      departureTime: primaryBoardingPoint?.time,
      boardingTime: primaryBoardingPoint?.time,
      boardingPoint: primaryBoardingPoint?.name,
      duration: apiData.duration,
      totalFare: apiData.totalFare,
      boardingPoints: boardingPoints,
      passengers: passengers,
      additionalInfo: apiData.additionalInfo,
      cancellationPolicy: apiData.cancellationPolicy,
      partialCancellationAllowed: apiData.partialCancellationAllowed,
      operatorContact: apiData.operatorContact,
      operatorAddress: apiData.operatorAddress
    };
  };

  const saveTripDetails = async (transformedData) => {
    try {
      const boardingPointsData = transformedData.boardingPoints.map(point => ({
        location: point.name,
        address: point.address,
        city: point.city,
        time: point.time,
        landmark: point.landmark || null,
        contact: point.contactNumber || null
      }));

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
      
      if (!result.status) {
        throw new Error(result.message || 'Failed to save trip details');
      }

      setSaveStatus({ type: 'success', message: 'Trip details saved successfully' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message || 'Failed to save trip details' });
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

      const transformedData = transformApiResponse(data.data);
      setTripDetails(transformedData);
      
      // Save the trip details after successful fetch
      await saveTripDetails(transformedData);
    } catch (error) {
      setError(error.message || 'Failed to load trip details');
    }

    setLoading(false);
};

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Enter Trip ID</h2>
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