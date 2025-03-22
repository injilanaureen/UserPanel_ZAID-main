import React, { useState } from 'react';
import { MapPin, Phone, Landmark, Hash, Map, User, Building } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const BoardingPoint = () => {
  const [bpId, setBpId] = useState('');
  const [tripId, setTripId] = useState('');
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseInfo, setResponseInfo] = useState(null);

  const fetchBoardingPoint = async () => {
    setLoading(true);
    setError(null);
    setBoardingPoint(null);
    setResponseInfo(null);

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

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response format');
      }

      setResponseInfo({
        success: data.success,
        message: data.message || 'No message',
      });

      if (data.success && data.api_response?.data && typeof data.api_response.data === 'object') {
        setBoardingPoint(data.api_response.data);
      } else {
        throw new Error(data.message || 'Unknown error from API');
      }
    } catch (err) {
      console.error('Error:', err.response?.data || err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch boarding point');
    } finally {
      setLoading(false);
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Header */}
          <h1 className="text-3xl font-semibold text-gray-800 text-center">
            Boarding Point Details
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BP ID</label>
              <input
                type="number"
                value={bpId}
                onChange={(e) => setBpId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter BP ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip ID</label>
              <input
                type="text"
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter Trip ID"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                loading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                'Fetch Boarding Point'
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 animate-fade-in">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Response Info (without JSON) */}
          {responseInfo && !boardingPoint && (
            <div
              className={`p-4 rounded-lg border-l-4 ${
                responseInfo.success
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-red-50 border-red-500 text-red-700'
              } animate-fade-in`}
            >
              <p className="font-medium">
                Status: {responseInfo.success ? 'Success' : 'Failure'}
              </p>
              <p>Message: {responseInfo.message}</p>
            </div>
          )}

          {/* Boarding Point Details */}
          {boardingPoint && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{boardingPoint.name}</h2>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-blue-500" />
                  <span>ID: {boardingPoint.id}</span>
                </p>
                <p className="flex items-center">
                  <Map className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Location: {boardingPoint.locationName}</span>
                </p>
                <p className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Address: {boardingPoint.address}</span>
                </p>
                <p className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-500" />
                <span>
                  Contact: {boardingPoint.contactnumber
                    ?.split(',')
                    .map((num) => num.trim())
                    .filter((num, index, arr) => arr.indexOf(num) === index) // Remove duplicates
                    .join(', ')}
                </span>
              </p>              

                <p className="flex items-center">
                  <Landmark className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Landmark: {boardingPoint.landmark}</span>
                </p>
                <p className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Name: {boardingPoint.name}</span>
                </p>
                {/* <p className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-500" />
                  <span>RB Master ID: {boardingPoint.rbMasterId}</span>
                </p> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Add this to your Tailwind config or CSS file for the fade-in animation
const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;

export default BoardingPoint;