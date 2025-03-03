import React, { useState } from 'react';
import { MapPin, Phone, Landmark, Hash, Map, User, Building } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';


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
        trip_id: parseInt(tripId, 10),
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      console.log('API Response:', data);

      setResponseInfo({
        status: data?.status ?? false,
        responseCode: data?.response_code ?? 'No response code',
        errorMsg: typeof data?.data === 'string' ? data.data : 'No specific error',
      });

      if (data.status && data.response_code === 1 && typeof data.data === 'object') {
        setBoardingPoint(data.data);
      } else {
        throw new Error(
          `Error: ${typeof data.data === 'string' ? data.data : 'Unknown error'}`
        );
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch boarding point');
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
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Boarding Point Details</h1>

        <form onSubmit={handleSubmit} className="mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">BP ID:</label>
            <input
              type="number"
              value={bpId}
              onChange={(e) => setBpId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Trip ID:</label>
            <input
              type="number"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded transition-colors ${
              loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Loading...' : 'Fetch Boarding Point'}
          </button>
        </form>

        {/* {responseInfo && (
          <div className={`mt-4 p-4 rounded-lg ${responseInfo.status ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <p><strong>Status:</strong> {responseInfo.status ? 'Success' : 'Failure'}</p>
            <p><strong>Response Code:</strong> {responseInfo.responseCode}</p>
            {!responseInfo.status && <p><strong>Error Message:</strong> {responseInfo.errorMsg}</p>}
          </div>
        )} */}

        {boardingPoint && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-800">{boardingPoint.name}</h2>
            <p><Hash className="inline-block w-5 h-5 text-gray-500" /> ID: {boardingPoint.id}</p>
            <p><Map className="inline-block w-5 h-5 text-gray-500" /> Location: {boardingPoint.locationName}</p>
            <p><MapPin className="inline-block w-5 h-5 text-gray-500" /> Address: {boardingPoint.address}</p>
            <p><Phone className="inline-block w-5 h-5 text-gray-500" /> Contact: {boardingPoint.contactnumber}</p>
            <p><Landmark className="inline-block w-5 h-5 text-gray-500" /> Landmark: {boardingPoint.landmark}</p>
            <p><User className="inline-block w-5 h-5 text-gray-500" /> Name: {boardingPoint.name}</p>
            <p><Building className="inline-block w-5 h-5 text-gray-500" /> RB Master ID: {boardingPoint.rbMasterId}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BoardingPoint;