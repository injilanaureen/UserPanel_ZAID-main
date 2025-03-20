import React, { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import AdminLayout from '@/Layouts/AdminLayout';
import { Receipt, LoaderPinwheel, ShipWheel } from 'lucide-react';

const AvailableTrips = () => {
  const [formData, setFormData] = useState({
    source_id: "",
    destination_id: "",
    date_of_journey: "",
  });
  const [trips, setTrips] = useState([]); // Ensure trips is always an array
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

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

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
    setTrips([]); // Reset trips to an empty array

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

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Ensure availableTrips is an array, fallback to empty array if undefined
      const availableTrips = Array.isArray(data.data?.availableTrips) ? data.data.availableTrips : [];
      setTrips(availableTrips);

      if (availableTrips.length === 0) {
        setError("No trips found for the selected criteria.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch trips. Please try again.");
      setTrips([]); // Ensure trips is reset to an array on error
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTrips = () => {
    return trips.filter((trip) => {
      const matchBusType = !filters.busType || trip.busType === filters.busType;
      const seats = parseInt(trip.availableSeats) || 0; // Handle invalid seats
      const matchAvailability = !filters.availability || (
        (filters.availability === "1-5" && seats <= 5) ||
        (filters.availability === "6-10" && seats > 5 && seats <= 10) ||
        (filters.availability === "11-20" && seats > 10 && seats <= 20) ||
        (filters.availability === "21+" && seats > 20)
      );
      const fare = parseFloat(trip.fares) || 0; // Handle invalid fares
      const matchFare = !filters.fareRange || (
        (filters.fareRange === "low" && fare <= 50) ||
        (filters.fareRange === "medium" && fare > 50 && fare <= 200) ||
        (filters.fareRange === "high" && fare > 200)
      );

      return matchBusType && matchAvailability && matchFare;
    });
  };

  const getBusTypes = () => {
    return [...new Set(trips.map(trip => trip.busType).filter(Boolean))]; // Filter out undefined/null
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
          <h2 className="text-3xl font-semibold text-white">Search Available Bus Trips</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="flex gap-1">
                <Receipt size={20} className="text-green-500 animate-bounce" />
                <label className="block text-gray-700 font-medium mb-1">Source City:</label>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={(e) => {
                    setSourceSearch(e.target.value);
                    setShowSourceDropdown(true);
                  }}
                  onFocus={() => setShowSourceDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search source city..."
                  required
                />
                {showSourceDropdown && filteredSourceCities.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
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
              <div className="flex gap-1">
                <LoaderPinwheel size={20} className="text-yellow-500 animate-bounce" />
                <label className="block text-gray-700 font-medium mb-1">Destination City:</label>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={destSearch}
                  onChange={(e) => {
                    setDestSearch(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Search destination city..."
                  required
                />
                {showDestDropdown && filteredDestCities.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
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
              <div className="flex gap-1">
                <ShipWheel size={20} className="text-red-500 animate-bounce" />
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : trips.length > 0 ? (
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
                      <p className="font-medium">{trip.busType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available Seats</p>
                      <p className="font-medium">{trip.availableSeats || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fare</p>
                      <p className="font-medium">₹{trip.fares || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{trip.duration || "N/A"}</p>
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
                      <p className="font-medium">
                        {trip.boardingTimes?.bpName || "N/A"} - {trip.boardingTimes?.address || "N/A"} (Contact: {trip.boardingTimes?.contactNumber || "N/A"})
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Dropping Point:</p>
                    <p className="font-medium">
                      {trip.droppingTimes?.bpName || "N/A"} - {trip.droppingTimes?.address || "N/A"} (Contact: {trip.droppingTimes?.contactNumber || "N/A"})
                    </p>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Cancellation Policy:</p>
                    <p className="font-medium">{trip.cancellationPolicy || "N/A"}</p>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Fare Details:</p>
                    <div className="border-t pt-2">
                      <p className="font-medium">Base Fare: ₹{trip.fareDetails?.baseFare || "N/A"}</p>
                      <p className="font-medium">GST: ₹{trip.fareDetails?.gst || "N/A"}</p>
                      <p className="font-medium">Total Fare: ₹{trip.fareDetails?.totalFare || "N/A"}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Operator:</p>
                    <p className="font-medium">{trip.operator || "N/A"}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Travel Company:</p>
                    <p className="font-medium">{trip.travels || "N/A"}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Date of Journey:</p>
                    <p className="font-medium">{trip.doj ? new Date(trip.doj).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Departure Time:</p>
                    <p className="font-medium">{trip.departureTime || "N/A"}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Arrival Time:</p>
                    <p className="font-medium">{trip.arrivalTime || "N/A"}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Vehicle Type:</p>
                    <p className="font-medium">{trip.vehicleType || "N/A"}</p>
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
        ) : (
          !error && (
            <div className="text-gray-600 p-4">
              No trips available. Please search with different criteria.
            </div>
          )
        )}
      </div>
    </AdminLayout>
  );
};

export default AvailableTrips;