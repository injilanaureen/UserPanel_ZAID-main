import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const QueryRemitter = () => {
    const [mobile, setMobile] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    const handleSearch = async () => {
        try {
            setError(null);
            setLoading(true);
            setSaveStatus(null);

            const response = await axios.post('/admin/remitter2/queryRemitter', { mobile });
            
            if (response.data.success) {
                setData(response.data.data);
                // After successful fetch, attempt to store the data
                await handleStoreData(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch data');
                setData(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleStoreData = async (remitterData) => {
        try {
            // Extract relevant data from the API response
            const storeResponse = await axios.post('/admin/remitter2/storeRemitter', {
                mobile: mobile,
                limit: remitterData.limit || 0, // Assuming the API returns a limit field
            });

            if (storeResponse.data.success) {
                setSaveStatus({
                    type: 'success',
                    message: 'Remitter data saved successfully'
                });
            }
        } catch (err) {
            setSaveStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to save remitter data'
            });
        }
    };

    // Function to check if value is an object and return a string representation
    const formatValue = (value) => {
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return value;
    };

    return (
        <AdminLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-semibold mb-4">Query Remitter</h1>
                <p className="mb-4">This page is used for querying remitter information.</p>

                <div className="my-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="border rounded p-2 flex-grow"
                        maxLength={10}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading || !mobile}
                        className={`px-4 py-2 rounded text-white ${
                            loading || !mobile 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {error && (
                    <div className="text-red-500 p-4 bg-red-50 rounded mb-4">
                        {error}
                    </div>
                )}

                {saveStatus && (
                    <div className={`p-4 rounded mb-4 ${
                        saveStatus.type === 'success' 
                        ? 'text-green-700 bg-green-50' 
                        : 'text-red-700 bg-red-50'
                    }`}>
                        {saveStatus.message}
                    </div>
                )}

                {data && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2">Remitter Information</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border p-2 text-left">Field</th>
                                        <th className="border p-2 text-left">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="border p-2 font-semibold">{key}</td>
                                            <td className="border p-2">{formatValue(value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!data && !error && !loading && (
                    <p className="text-gray-500 italic">
                        Enter a mobile number and click search to view remitter details
                    </p>
                )}
            </div>
        </AdminLayout>
    );
};

export default QueryRemitter;