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

  const saveTripDetails = async (rawData) => {
    try {
      const boardingPoints = rawData.boardingTimes.map(point => ({
        location: point.location,
        address: point.address,
        city: point.bpName,
        time: parseInt(point.time),
        landmark: point.landmark,
        contact: point.contactNumber
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
          boarding_points: boardingPoints
        })
      });

      const result = await response.json();
      if (!result.status) {
        throw new Error(result.message || 'Failed to save trip details');
      }

      setSaveStatus({ type: 'success', message: 'Trip details saved successfully' });
    } catch (error) {
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

      setTripDetails(data.data);
      await saveTripDetails(data.data);
    } catch (error) {
      setError(error.message || 'Failed to load trip details');
    }

    setLoading(false);
  };

  const renderBoardingDroppingPoints = (points, title) => (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <p><strong>Name:</strong> {point.bpName}</p>
            <p><strong>Location:</strong> {point.location}</p>
            <p><strong>Address:</strong> {point.address}</p>
            <p><strong>Time:</strong> {point.time}</p>
            <p><strong>Contact:</strong> {point.contactNumber}</p>
            <p><strong>Landmark:</strong> {point.landmark}</p>
            <p><strong>BP ID:</strong> {point.bpId}</p>
            <p><strong>Identifier:</strong> {point.bpIdentifier}</p>
            <p><strong>Amenities:</strong> {point.bpAmenities || 'None'}</p>
            <p><strong>Prime:</strong> {point.prime}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFareDetails = (fares) => (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Fare Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fares.map((fare, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <p><strong>Total Fare:</strong> ₹{fare.totalFare}</p>
            <p><strong>Base Fare:</strong> ₹{fare.baseFare}</p>
            <p><strong>GST:</strong> ₹{fare.gst}</p>
            <p><strong>Service Tax:</strong> ₹{fare.serviceTaxAbsolute} ({fare.serviceTaxPercentage}%)</p>
            <p><strong>Bank Transaction Amount:</strong> ₹{fare.bankTrexAmt}</p>
            <p><strong>Booking Fee:</strong> ₹{fare.bookingFee}</p>
            <p><strong>Child Fare:</strong> ₹{fare.childFare}</p>
            <p><strong>Levy Fare:</strong> ₹{fare.levyFare}</p>
            <p><strong>Markup Fare:</strong> ₹{fare.markupFareAbsolute} ({fare.markupFarePercentage}%)</p>
            <p><strong>Operator Service Charge:</strong> ₹{fare.operatorServiceChargeAbsolute} ({fare.operatorServiceChargePercentage}%)</p>
            <p><strong>SRT Fee:</strong> ₹{fare.srtFee}</p>
            <p><strong>Toll Fee:</strong> ₹{fare.tollFee}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSeats = (seats) => (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Seat Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {seats.map((seat, index) => (
          <div key={index} className={`border p-4 rounded-lg ${seat.available === 'true' ? 'bg-green-50' : 'bg-red-50'}`}>
            <p><strong>Seat:</strong> {seat.name}</p>
            <p><strong>Available:</strong> {seat.available === 'true' ? 'Yes' : 'No'}</p>
            <p><strong>Fare:</strong> ₹{seat.fare}</p>
            <p><strong>Base Fare:</strong> ₹{seat.baseFare}</p>
            <p><strong>Position:</strong> Row {seat.row}, Col {seat.column}</p>
            <p><strong>Ladies Seat:</strong> {seat.ladiesSeat === 'true' ? 'Yes' : 'No'}</p>
            <p><strong>Males Seat:</strong> {seat.malesSeat === 'true' ? 'Yes' : 'No'}</p>
            <p><strong>Double Berth:</strong> {seat.doubleBirth === 'true' ? 'Yes' : 'No'}</p>
            <p><strong>Dimensions:</strong> {seat.length}x{seat.width}</p>
            <p><strong>Z-Index:</strong> {seat.zIndex}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
            <h2 className="text-2xl font-bold">Trip Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Available Seats:</strong> {tripDetails.availableSeats}</p>
              <p><strong>Available Single Seats:</strong> {tripDetails.availableSingleSeat}</p>
              <p><strong>Allow Ladies Double Seats:</strong> {tripDetails.allowLadiesToBookDoubleSeats}</p>
              <p><strong>Max Seats Per Ticket:</strong> {tripDetails.maxSeatsPerTicket}</p>
              <p><strong>No Seat Layout Seats:</strong> {tripDetails.noSeatLayoutAvailableSeats}</p>
              <p><strong>No Seat Layout Enabled:</strong> {tripDetails.noSeatLayoutEnabled}</p>
              <p><strong>Call Fare Breakup API:</strong> {tripDetails.callFareBreakUpAPI}</p>
              <p><strong>Is Aggregator:</strong> {tripDetails.isAggregator}</p>
              <p><strong>Primo:</strong> {tripDetails.primo}</p>
              <p><strong>Vaccinated Bus:</strong> {tripDetails.vaccinatedBus}</p>
              <p><strong>Vaccinated Staff:</strong> {tripDetails.vaccinatedStaff}</p>
            </div>

            {renderBoardingDroppingPoints(tripDetails.boardingTimes, "Boarding Points")}
            {renderBoardingDroppingPoints(tripDetails.droppingTimes, "Dropping Points")}
            {renderFareDetails(tripDetails.fareDetails)}
            {renderSeats(tripDetails.seats)}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GetCurrentTripDetails;