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
      const response = await fetch('/admin/busTicket/storeTripDetails', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify({
          trip_id: tripId,
          raw_data: rawData // Sending raw API data instead of transformed boarding points
        })
      });

      const result = await response.json();
      console.log('Store trip details response:', result);

      if (!result.status) {
        throw new Error(result.message || 'Failed to save trip details');
      }

      setSaveStatus({ type: 'success', message: 'Trip details saved successfully' });
    } catch (error) {
      // console.error('Error storing trip details:', error);
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

      console.log('API Response:', data);
      setTripDetails(data.data); // Store raw data directly
      await saveTripDetails(data.data); // Save raw data
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message || 'Failed to load trip details');
    }

    setLoading(false);
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
            <h2 className="text-2xl font-bold">Raw Trip Details</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(tripDetails, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GetCurrentTripDetails;