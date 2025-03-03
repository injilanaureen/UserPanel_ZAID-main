import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setSaveStatus('');

    try {
      const response = await axios.post('/admin/beneficiary2/fetch-beneficiary-data', formData);
      setResponse(response.data);
      setSaveStatus('Data successfully fetched and stored in database');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Fetch Beneficiary by BeneID</h2>

        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="beneid" className="block text-sm font-medium text-gray-700">
              BeneID
            </label>
            <input
              type="text"
              id="beneid"
              name="beneid"
              value={formData.beneid}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {saveStatus && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
            {saveStatus}
          </div>
        )}

        {response?.data && response.data.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Beneficiary Details:</h3>
            <div className="overflow-auto">
              {response.data.map((item, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <p><strong>Bene ID:</strong> {item.bene_id}</p>
                  <p><strong>Bank ID:</strong> {item.bankid}</p>
                  <p><strong>Bank Name:</strong> {item.bankname}</p>
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Account Number:</strong> {item.accno}</p>
                  <p><strong>IFSC:</strong> {item.ifsc}</p>
                  <p><strong>Verified:</strong> {item.verified === '1' ? 'Yes' : 'No'}</p>
                  <p><strong>Bank Type:</strong> {item.banktype}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FetchbyBenied;