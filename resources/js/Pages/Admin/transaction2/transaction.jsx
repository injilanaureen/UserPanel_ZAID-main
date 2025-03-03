import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const Transaction = ({ transactionData }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    referenceid: '',
    pincode: '',
    address: '',
    amount: '',
    txntype: 'imps',
    dob: '',
    gst_state: '',
    bene_id: '',
    otp: '',
    stateresp: '',
    lat: '28.7041',
    long: '77.1025',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Data:', formData);

    // Make POST request to Laravel route
    router.post('/admin/transaction2/transact', formData);
  };

  const handleSendOtp = () => {
    console.log('Sending OTP for bene_id:', formData.bene_id);
    // Implement OTP sending logic here
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Transaction</h1>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Field</th>
              <th className="border p-2 text-left">Input</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(formData).map((key) => (
              (key !== 'lat' && key !== 'long') && (
                <tr key={key}>
                  <td className="border p-2 font-semibold capitalize">{key}</td>
                  <td className="border p-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        required
                        className="border rounded-lg p-2 w-full"
                      />
                      {key === 'bene_id' && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="bg-green-600 text-white px-3 py-1  rounded-lg"
                        >
                          Send OTP
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4">
          Submit
        </button>
      </form>

      {/* API Response Debug */}
      {transactionData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">API Response:</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Key</th>
                <th className="border p-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(transactionData).map(([key, value]) => (
                <tr key={key}>
                  <td className="border p-2 font-semibold capitalize">{key}</td>
                  <td className="border p-2">{JSON.stringify(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Transaction;
