import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { Phone, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { router } from '@inertiajs/react';

const QueryRemitter = () => {
  const [mobile, setMobile] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      setSaveStatus(null);

      const response = await axios.post('/admin/remitter2/queryRemitter', { mobile });
      
      if (response.data.success) {
        setData(response.data.data);
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
      const storeResponse = await axios.post('/admin/remitter2/storeRemitter', {
        mobile: mobile,
        limit: remitterData.limit || 0,
      });

      if (storeResponse.data.success) {
        setSaveStatus('Remitter data saved successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save remitter data');
    }
  };

  const handleNextStep = () => {
    router.visit('/admin/remitter2/remitter-adhaar-verify', {
      method: 'get',
      data: {
        mobile: mobile,
        queryData: data,
      },
      preserveState: true,
      preserveScroll: true,
    });
  };

  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Query Remitter</h2>
          </div>

          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="mobile" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter mobile number"
                  maxLength={10}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !mobile}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : "Search Remitter"}
            </button>
          </form>

          <div className="px-6 pb-6">
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            {saveStatus && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-600 text-sm flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  {saveStatus}
                </p>
              </div>
            )}

            {data && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  Remitter Information:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-gray-100 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Field</TableHead>
                        <TableHead className="px-4 py-2 text-left">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(data).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                          <TableCell className="px-4 py-2">{formatValue(value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <button
                  onClick={handleNextStep}
                  className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Next Step: Verify Aadhaar →
                </button>
              </div>
            )}

            {!data && !error && !loading && (
              <p className="text-gray-500 text-sm italic">
                Enter a mobile number and click search to view remitter details
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QueryRemitter;