import React, { useState, useEffect } from "react";
import { Loader2, Search, ChevronDown, ChevronUp } from "lucide-react";
import AdminLayout from '@/Layouts/AdminLayout';
import { Receipt, LoaderPinwheel, ShipWheel } from 'lucide-react';

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
  const [sourceCities, setSourceCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [sourceSearch, setSourceSearch] = useState("");
  const [destSearch, setDestSearch] = useState("");
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [expandedTrip, setExpandedTrip] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/admin/busTicket/fetchSourceCities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.status && data.data.cities) {
          setSourceCities(data.data.cities);
          setDestinationCities(data.data.cities);
        } else {
          throw new Error('Failed to fetch cities data');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCities();
  }, []);

  const filteredSourceCities = sourceCities.filter(city =>
    city.name.toLowerCase().includes(sourceSearch.toLowerCase())
  ).slice(0, 10);

  const filteredDestCities = destinationCities.filter(city =>
    city.name.toLowerCase().includes(destSearch.toLowerCase())
  ).slice(0, 10);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCitySelect = (type, city) => {
    if (type === "source") {
      setFormData((prev) => ({ ...prev, source_id: city.id }));
      setSourceSearch(city.name);
      setShowSourceDropdown(false);
    } else {
      setFormData((prev) => ({ ...prev, destination_id: city.id }));
      setDestSearch(city.name);
      setShowDestDropdown(false);
    }
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
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);
      const availableTrips = Array.isArray(data.data?.availableTrips) ? data.data.availableTrips : [];
      setTrips(availableTrips);
      if (availableTrips.length === 0) setError("No trips found for the selected criteria.");
    } catch (err) {
      setError(err.message || "Failed to fetch trips. Please try again.");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTrips = () => {
    return trips.filter((trip) => {
      const matchBusType = !filters.busType || trip.busType === filters.busType;
      const seats = parseInt(trip.availableSeats) || 0;
      const matchAvailability = !filters.availability || (
        (filters.availability === "1-5" && seats <= 5) ||
        (filters.availability === "6-10" && seats > 5 && seats <= 10) ||
        (filters.availability === "11-20" && seats > 10 && seats <= 20) ||
        (filters.availability === "21+" && seats > 20)
      );
      const fare = parseFloat(Array.isArray(trip.fares) ? trip.fares[0] : trip.fares) || 0; // Handle fare as array or single value
      const matchFare = !filters.fareRange || (
        (filters.fareRange === "low" && fare <= 2000) ||
        (filters.fareRange === "medium" && fare > 2000 && fare <= 4000) ||
        (filters.fareRange === "high" && fare > 4000)
      );

      return matchBusType && matchAvailability && matchFare;
    });
  };

  const getBusTypes = () => {
    return [...new Set(trips.map(trip => trip.busType).filter(Boolean))];
  };

  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${mins < 10 ? "0" + mins : mins} ${period}`;
  };

  const toggleTripDetails = (tripId) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  return (
    <AdminLayout>
      <div className="max-w-full mx-auto p-6">
        <div className="bg-gradient-to-r from-gray-700 to-black py-4 px-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-white">Search Bus Trips</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <Receipt size={18} className="text-green-500" /> Source City
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={(e) => {
                    setSourceSearch(e.target.value);
                    setShowSourceDropdown(true);
                  }}
                  onFocus={() => setShowSourceDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Search source city..."
                  required
                />
                {showSourceDropdown && filteredSourceCities.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredSourceCities.map((city) => (
                      <li
                        key={city.id}
                        onClick={() => handleCitySelect("source", city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city.name}, {city.state} (ID: {city.id})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <LoaderPinwheel size={18} className="text-yellow-500" /> Destination City
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={destSearch}
                  onChange={(e) => {
                    setDestSearch(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="Search destination city..."
                  required
                />
                {showDestDropdown && filteredDestCities.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredDestCities.map((city) => (
                      <li
                        key={city.id}
                        onClick={() => handleCitySelect("destination", city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city.name}, {city.state} (ID: {city.id})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <ShipWheel size={18} className="text-red-500" /> Date of Journey
              </label>
              <input
                type="date"
                name="date_of_journey"
                value={formData.date_of_journey}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Searching...
              </>
            ) : (
              "Search Trips"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        ) : trips.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Trips ({getFilteredTrips().length})</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <select
                name="busType"
                value={filters.busType}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
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
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
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
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
              >
                <option value="">All Fare Ranges</option>
                <option value="low">Low (≤₹2000)</option>
                <option value="medium">Medium (₹2001-₹4000)</option>
                <option value="high">High (≥₹4000)</option>
              </select>
            </div>

            <div className="space-y-6">
              {getFilteredTrips().map((trip) => (
                <div key={trip.id} className="border rounded-lg shadow-md bg-white p-4 hover:shadow-lg transition">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Travels</p>
                      <p className="font-semibold text-gray-800">{trip.travels || "N/A"}</p>
                      <p className="text-sm text-gray-600">{trip.busType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Departure</p>
                      <p className="font-semibold text-gray-800">{formatTime(trip.departureTime)}</p>
                      <p className="text-sm text-gray-600">{trip.boardingTimes?.[0]?.location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="font-semibold text-gray-800">{formatTime(trip.arrivalTime)}</p>
                      <p className="text-sm text-gray-600">{trip.droppingTimes?.[0]?.location || trip.droppingTimes?.location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-800">{trip.duration || "N/A"}</p>
                      <p className="text-sm text-gray-600">Seats: {trip.availableSeats || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fare</p>
                      <p className="font-semibold text-green-600">
                        ₹{Array.isArray(trip.fares) ? trip.fares[0] : trip.fares || "N/A"}
                      </p>
                      <button
                        onClick={() => toggleTripDetails(trip.id)}
                        className="text-blue-600 text-sm flex items-center gap-1 mt-1"
                      >
                        {expandedTrip === trip.id ? "Hide Details" : "Show Details"}
                        {expandedTrip === trip.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {expandedTrip === trip.id && (
                    <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Trip Information</h4>
                        <p><span className="text-gray-500">ID:</span> {trip.id || "N/A"}</p>
                        <p><span className="text-gray-500">Service ID:</span> {trip.busServiceId || "N/A"}</p>
                        <p><span className="text-gray-500">Route ID:</span> {trip.routeId || "N/A"}</p>
                        <p><span className="text-gray-500">Date of Journey:</span> {trip.doj ? new Date(trip.doj).toLocaleDateString() : "N/A"}</p>
                        <p><span className="text-gray-500">Bus Routes:</span> {trip.busRoutes || "N/A"}</p>
                        <p><span className="text-gray-500">Vehicle Type:</span> {trip.vehicleType || "N/A"}</p>
                        <p><span className="text-gray-500">Sub Bus Type:</span> {trip.subBusType || "N/A"}</p>
                        <p><span className="text-gray-500">Bus Type ID:</span> {trip.busTypeId || "N/A"}</p>
                        <p><span className="text-gray-500">Operator:</span> {trip.operator || "N/A"}</p>
                        <p><span className="text-gray-500">AC:</span> {trip.AC === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Non-AC:</span> {trip.nonAC === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Seater:</span> {trip.seater === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Sleeper:</span> {trip.sleeper === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Available Single Seats:</span> {trip.availableSingleSeat || "N/A"}</p>
                        <p><span className="text-gray-500">Window Seats:</span> {trip.avlWindowSeats || "N/A"}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Boarding & Dropping Points</h4>
                        <p className="text-gray-500">Boarding Points:</p>
                        {Array.isArray(trip.boardingTimes) ? (
                          trip.boardingTimes.map((point, idx) => (
                            <p key={idx} className="text-sm">
                              {point.bpName} - {point.address} ({formatTime(point.time)})
                            </p>
                          ))
                        ) : (
                          <p>{trip.boardingTimes?.bpName || "N/A"} - {trip.boardingTimes?.address || "N/A"} ({formatTime(trip.boardingTimes?.time)})</p>
                        )}
                        <p className="text-gray-500 mt-2">Dropping Points:</p>
                        {Array.isArray(trip.droppingTimes) ? (
                          trip.droppingTimes.map((point, idx) => (
                            <p key={idx} className="text-sm">
                              {point.bpName} - {point.address} ({formatTime(point.time)})
                            </p>
                          ))
                        ) : (
                          <p>{trip.droppingTimes?.bpName || "N/A"} - {trip.droppingTimes?.address || "N/A"} ({formatTime(trip.droppingTimes?.time)})</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Fare Details</h4>
                        {Array.isArray(trip.fareDetails) && trip.fareDetails.length > 0 ? (
                          trip.fareDetails.map((fare, idx) => (
                            <div key={idx} className="mb-2">
                              <p><span className="text-gray-500">Base Fare:</span> ₹{fare.baseFare || "N/A"}</p>
                              <p><span className="text-gray-500">GST:</span> ₹{fare.gst || "N/A"}</p>
                              <p><span className="text-gray-500">Total Fare:</span> ₹{fare.totalFare || "N/A"}</p>
                              <p><span className="text-gray-500">Service Charge:</span> ₹{fare.serviceCharge || "N/A"}</p>
                              <p><span className="text-gray-500">Booking Fee:</span> ₹{fare.bookingFee || "N/A"}</p>
                              <p><span className="text-gray-500">Child Fare:</span> ₹{fare.childFare || "N/A"}</p>
                            </div>
                          ))
                        ) : (
                          <p>No fare details available</p>
                        )}
                        <p>
                          <span className="text-gray-500">Fares List:</span>{" "}
                          {Array.isArray(trip.fares)
                            ? trip.fares.join(", ")
                            : trip.fares
                            ? trip.fares.toString()
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Policies & Features</h4>
                        <p><span className="text-gray-500">Cancellation Policy:</span> {trip.cancellationPolicy || "N/A"}</p>
                        <p><span className="text-gray-500">Partial Cancellation:</span> {trip.partialCancellationAllowed === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Primary Pax Cancellable:</span> {trip.primaryPaxCancellable === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Zero Cancellation Time:</span> {trip.zeroCancellationTime || "N/A"}</p>
                        <p><span className="text-gray-500">Tatkal Time:</span> {trip.tatkalTime || "N/A"}</p>
                        <p><span className="text-gray-500">mTicket Enabled:</span> {trip.mTicketEnabled === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Live Tracking:</span> {trip.liveTrackingAvailable === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Vaccinated Bus:</span> {trip.vaccinatedBus === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Vaccinated Staff:</span> {trip.vaccinatedStaff === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Social Distancing:</span> {trip.socialDistancing === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">ID Proof Required:</span> {trip.idProofRequired === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Max Seats/Ticket:</span> {trip.maxSeatsPerTicket || "N/A"}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Additional Information</h4>
                        <p><span className="text-gray-500">Agent Service Charge:</span> ₹{trip.agentServiceCharge || "N/A"}</p>
                        <p><span className="text-gray-500">Agent Service Charge Allowed:</span> {trip.agentServiceChargeAllowed === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Additional Commission:</span> ₹{trip.additionalCommission || "N/A"}</p>
                        <p><span className="text-gray-500">BO Commission:</span> ₹{trip.boCommission || "N/A"}</p>
                        <p><span className="text-gray-500">Partner Base Commission:</span> ₹{trip.partnerBaseCommission || "N/A"}</p>
                        <p><span className="text-gray-500">GDS Commission:</span> ₹{trip.gdsCommission || "N/A"}</p>
                        <p><span className="text-gray-500">Bus Cancelled:</span> {trip.busCancelled === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Bookable:</span> {trip.bookable === "true" ? "Yes" : "No"}</p>
                        <p><span className="text-gray-500">Images Count:</span> {trip.busImageCount || "N/A"}</p>
                        <p><span className="text-gray-500">Images Metadata URL:</span> {trip.imagesMetadataUrl || "N/A"}</p>
                        <p><span className="text-gray-500">Via Route:</span> {trip.viaRt || "N/A"}</p>
                        <p><span className="text-gray-500">Next Day:</span> {trip.nextDay === "true" ? "Yes" : "No"}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Bus Information</h4>
                        <p><span className="text-gray-500">Bus Number:</span> {trip.businfo?.busNumber || "N/A"}</p>
                        <p><span className="text-gray-500">Driver Name:</span> {trip.businfo?.driverName || "N/A"}</p>
                        <p><span className="text-gray-500">Driver Mobile:</span> {trip.businfo?.driverMobile || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          !error && (
            <div className="text-gray-600 p-4 text-center">
              No trips available. Please search with different criteria.
            </div>
          )
        )}
      </div>
    </AdminLayout>
  );
};

export default AvailableTrips;