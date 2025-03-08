import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import AdminLayout from '@/Layouts/AdminLayout';
import { Receipt,LoaderPinwheel ,ShipWheel  } from 'lucide-react';


const AvailableTrips = () => {
  const [formData, setFormData] = useState({
    source_id: "",
    destination_id: "",
    date_of_journey: "",
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    busType: "",
    availability: "",
    fareRange: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTrips([]);

    try {
      const response = await fetch("/admin/busTicket/fetchAvailableTrips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setTrips(data.data.availableTrips);
    } catch (err) {
      setError(err.message || "Failed to fetch trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTrips = () => {
    if (!trips) return [];

    return trips.filter((trip) => {
      const matchBusType = !filters.busType || trip.busType === filters.busType;

      const seats = parseInt(trip.availableSeats);
      const matchAvailability = !filters.availability || (
        (filters.availability === "1-5" && seats <= 5) ||
        (filters.availability === "6-10" && seats > 5 && seats <= 10) ||
        (filters.availability === "11-20" && seats > 10 && seats <= 20) ||
        (filters.availability === "21+" && seats > 20)
      );

      const fare = parseFloat(trip.fares);
      const matchFare = !filters.fareRange || (
        (filters.fareRange === "low" && fare <= 50) ||
        (filters.fareRange === "medium" && fare > 50 && fare <= 200) ||
        (filters.fareRange === "high" && fare > 200)
      );

      return matchBusType && matchAvailability && matchFare;
    });
  };

  const getBusTypes = () => {
    if (!trips) return [];
    return [...new Set(trips.map(trip => trip.busType))];
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
          <h2 className="text-3xl font-semibold text-white">Search Available Bus Trips</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
            <div className="flex gap-1">
          <Receipt size={20} className="text-green-500 animate-bounce"/>
          <label className="block text-gray-700 font-medium mb-1">Source ID:</label>
          </div>
              <input
                type="number"
                name="source_id"
                value={formData.source_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
            <div className="flex gap-1">
          <LoaderPinwheel size={20} className="text-yellow-500 animate-bounce"/>
          <label className="block text-gray-700 font-medium mb-1">Destination ID:</label>
          </div>
              <input
                type="number"
                name="destination_id"
                value={formData.destination_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>

            <div>
            <div className="flex gap-1">
          <ShipWheel size={20} className="text-red-500 animate-bounce"/>
          <label className="block text-gray-700 font-medium mb-1">Date of Journey:</label>
          </div>
              <input
                type="date"
                name="date_of_journey"
                value={formData.date_of_journey}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Searching...
              </>
            ) : (
              "Search Trips"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {trips.length > 0 && !loading && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Trips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <select
                name="busType"
                value={filters.busType}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Bus Types</option>
                {getBusTypes().map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Availabilities</option>
                <option value="1-5">1-5 Seats</option>
                <option value="6-10">6-10 Seats</option>
                <option value="11-20">11-20 Seats</option>
                <option value="21+">21+ Seats</option>
              </select>

              <select
                name="fareRange"
                value={filters.fareRange}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Fare Ranges</option>
                <option value="low">Low Fare (≤₹50)</option>
                <option value="medium">Medium Fare (₹51-₹200)</option>
                <option value="high">High Fare (Above ₹200)</option>
              </select>
            </div>

            <div className="space-y-4">
              {getFilteredTrips().map((trip) => (
                <div key={trip.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Bus Type</p>
                      <p className="font-medium">{trip.busType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available Seats</p>
                      <p className="font-medium">{trip.availableSeats}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fare</p>
                      <p className="font-medium">₹{trip.fares}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{trip.duration}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Boarding Points:</p>
                    {Array.isArray(trip.boardingTimes) ? (
                      trip.boardingTimes.map((point, index) => (
                        <p key={index} className="font-medium">
                          {point.bpName} - {point.address} (Contact: {point.contactNumber})
                        </p>
                      ))
                    ) : (
                      <p className="font-medium">{trip.boardingTimes.bpName} - {trip.boardingTimes.address} (Contact: {trip.boardingTimes.contactNumber})</p>
                    )}
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Dropping Point:</p>
                    <p className="font-medium">{trip.droppingTimes.bpName} - {trip.droppingTimes.address} (Contact: {trip.droppingTimes.contactNumber})</p>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Cancellation Policy:</p>
                    <p className="font-medium">{trip.cancellationPolicy}</p>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Fare Details:</p>
                    <div className="border-t pt-2">
                      <p className="font-medium">Base Fare: ₹{trip.fareDetails.baseFare}</p>
                      <p className="font-medium">GST: ₹{trip.fareDetails.gst}</p>
                      <p className="font-medium">Total Fare: ₹{trip.fareDetails.totalFare}</p>
                    </div>
                  </div>

                  {/* New Fields */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Operator:</p>
                    <p className="font-medium">{trip.operator}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Travel Company:</p>
                    <p className="font-medium">{trip.travels}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Date of Journey:</p>
                    <p className="font-medium">{new Date(trip.doj).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Departure Time:</p>
                    <p className="font-medium">{trip.departureTime}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Arrival Time:</p>
                    <p className="font-medium">{trip.arrivalTime}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Vehicle Type:</p>
                    <p className="font-medium">{trip.vehicleType}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Vaccinated Bus:</p>
                    <p className="font-medium">{trip.vaccinatedBus ? "Yes" : "No"}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Vaccinated Staff:</p>
                    <p className="font-medium">{trip.vaccinatedStaff ? "Yes" : "No"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AvailableTrips;