import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

const TransactionSentOtp = ({ response }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    referenceid: '',
    bene_id: '',
    txntype: 'IMPS',
    amount: '',
    pincode: '',
    address: '',
    gst_state: '',
    dob: '',
    lat: '28.7041',
    long: '77.1025',
  });

  const [apiResponse, setApiResponse] = useState(response || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    router.post('/transaction-sent-otp', formData, {
      preserveState: true,
      onSuccess: (page) => {
        setLoading(false);
        setApiResponse(page.props.response);
      },
      onError: (errors) => {
        setLoading(false);
        setError('Something went wrong. Please try again.');
      },
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Transaction Sent OTP</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => (
              key !== 'lat' && key !== 'long' && (
                <div key={key}>
                  <label htmlFor={key} className="block font-semibold capitalize mb-1">
                    {key.replace('_', ' ')}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="border p-3 w-full rounded-lg focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
              )
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        {/* Display API Response */}
        {apiResponse && (
          <div className="mt-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">API Response:</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border p-3">Field</th>
                    <th className="border p-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(apiResponse).map(([key, value]) => (
                    <tr key={key} className="odd:bg-gray-50 even:bg-white">
                      <td className="border p-3 font-medium capitalize">{key.replace('_', ' ')}</td>
                      <td className="border p-3">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Display Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-center">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TransactionSentOtp;