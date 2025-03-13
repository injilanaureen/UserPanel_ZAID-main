import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { Phone, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FetchbyBenied = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    beneid: ''
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSaveStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setSaveStatus('');

    try {
      const result = await axios.post('/admin/beneficiary2/fetch-beneficiary-data', formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
          'Accept': 'application/json'
        }
      });
      
      console.log('API Response:', result.data);
      
      setResponse(result.data);
      
      if (result.data && (result.data.data || []).length > 0) {
        setSaveStatus('Data successfully fetched and stored in database');
      } else if (result.data && result.data.status === 0) {
        setError(result.data.message || 'No beneficiary found with these details');
      } else {
        setSaveStatus('Request successful, but no beneficiary data returned');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.errors || 
                         'An error occurred while fetching data';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderResponseData = () => {
    if (!response) return null;

    // Convert response to key-value pairs for table display
    const getTableRows = () => {
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Handle array of beneficiary data
        return response.data.map((item, index) => (
          <TableRow key={`item-${index}`} className="border-b border-gray-200">
            {Object.entries(item).map(([key, value], idx) => (
              <React.Fragment key={`${index}-${idx}`}>
                {idx === 0 && (
                  <TableCell 
                    className="px-4 py-2 font-medium" 
                    rowSpan={Object.keys(item).length}
                  >
                    Beneficiary {index + 1}
                  </TableCell>
                )}
                <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                <TableCell className="px-4 py-2">{String(value)}</TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        ));
      } else {
        // Handle non-array response (like status/message objects)
        return Object.entries(response).map(([key, value], index) => (
          <TableRow key={`response-${index}`} className="border-b border-gray-200">
            <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
            <TableCell className="px-4 py-2">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </TableCell>
          </TableRow>
        ));
      }
    };

    return (
      <div className="mt-4">
        <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
          <Code size={16} className="mr-2" />
          API Response:
        </h3>
        <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-sky-500 text-white">
              <TableRow>
                {Array.isArray(response.data) && response.data.length > 0 && (
                  <TableHead className="px-4 py-2 text-left">Beneficiary</TableHead>
                )}
                <TableHead className="px-4 py-2 text-left">Key</TableHead>
                <TableHead className="px-4 py-2 text-left">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getTableRows()}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Fetch Beneficiary by BeneID</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="mobile" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Mobile Number"
                />
              </div>

              <div>
                <label htmlFor="beneid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Code size={20} className="mr-2 text-blue-500" />
                  BeneID
                </label>
                <input
                  type="text"
                  id="beneid"
                  name="beneid"
                  value={formData.beneid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Beneficiary ID"
                />
              </div>
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
                  Processing...
                </span>
              ) : "Fetch Data"}
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

            {renderResponseData()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FetchbyBenied;