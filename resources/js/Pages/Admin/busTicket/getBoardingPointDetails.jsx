import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Landmark, Hash, Map, User, AlertCircle, CheckCircle, Code } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BoardingPoint = () => {
  const [bpId, setBpId] = useState('');
  const [tripId, setTripId] = useState('');
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [boardingPointsList, setBoardingPointsList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  // Fetch boarding points when tripId changes
  useEffect(() => {
    if (tripId) {
      fetchTripBoardingPoints();
    }
  }, [tripId]);

  const fetchTripBoardingPoints = async () => {
    try {
      const response = await axios.post('/admin/busTicket/fetchTripDetails', {
        trip_id: tripId,
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (data.status && data.data?.boardingTimes) {
        setBoardingPointsList(data.data.boardingTimes);
      }
    } catch (err) {
      console.error('Error fetching trip boarding points:', err);
    }
  };

  const fetchBoardingPoint = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setBoardingPoint(null);
    setApiResponse(null);

    try {
      const response = await axios.post('/admin/busTicket/fetchboardingpointdetails', {
        bpId: parseInt(bpId, 10),
        trip_id: tripId,
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      console.log('API Response:', data);

      setApiResponse(data);

      if (data.success && data.api_response?.data && typeof data.api_response.data === 'object') {
        setBoardingPoint(data.api_response.data);
        setSuccess('Boarding point fetched successfully!');
      } else {
        setError(data.message || 'Failed to fetch boarding point');
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.errors || 
                         'Failed to fetch boarding point';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const selectedAddr = e.target.value;
    setSelectedAddress(selectedAddr);
    
    // Find the corresponding bpId for the selected address
    const selectedPoint = boardingPointsList.find(point => point.address === selectedAddr);
    if (selectedPoint) {
      setBpId(selectedPoint.bpId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bpId && tripId) {
      fetchBoardingPoint();
    } else {
      setError('Both BP ID and Trip ID are required');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Boarding Point Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="tripId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Map size={20} className="mr-2 text-blue-500" />
                  Trip ID
                </label>
                <input
                  id="tripId"
                  type="text"
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  placeholder="Enter Trip ID"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <MapPin size={20} className="mr-2 text-blue-500" />
                  Select Boarding Point Address
                </label>
                <select
                  id="address"
                  value={selectedAddress}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  disabled={!tripId || boardingPointsList.length === 0}
                  required
                >
                  <option value="">Select an address</option>
                  {boardingPointsList.map((point, index) => (
                    <option key={index} value={point.address}>
                      {point.address} (BP ID: {point.bpId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="bpId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                <Hash size={20} className="mr-2 text-blue-500" />
                Selected BP ID
              </label>
              <input
                id="bpId"
                type="number"
                value={bpId}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching...
                </span>
              ) : "Fetch Boarding Point"}
            </button>
          </form>

          {/* Response and error handling */}
          <div className="px-6 pb-6">
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-600 text-sm flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  {success}
                </p>
              </div>
            )}

            {boardingPoint && (
              <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{boardingPoint.name}</h3>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-center">
                    <Hash size={16} className="mr-2 text-blue-500" />
                    ID: {boardingPoint.id}
                  </p>
                  <p className="flex items-center">
                    <Map size={16} className="mr-2 text-blue-500" />
                    Location: {boardingPoint.locationName}
                  </p>
                  <p className="flex items-center">
                    <MapPin size={16} className="mr-2 text-blue-500" />
                    Address: {boardingPoint.address}
                  </p>
                  <p className="flex items-center">
                    <Phone size={16} className="mr-2 text-blue-500" />
                    Contact: {boardingPoint.contactnumber
                      ?.split(',')
                      .map((num) => num.trim())
                      .filter((num, index, arr) => arr.indexOf(num) === index)
                      .join(', ')}
                  </p>
                  <p className="flex items-center">
                    <Landmark size={16} className="mr-2 text-blue-500" />
                    Landmark: {boardingPoint.landmark}
                  </p>
                  <p className="flex items-center">
                    <User size={16} className="mr-2 text-blue-500" />
                    Name: {boardingPoint.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BoardingPoint;