import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

const TransactionStatus = ({ transactionData }) => {
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/transaction-status', { referenceid: referenceId });
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Transaction Status</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <label className="block mb-2 text-lg font-medium">Reference ID:</label>
          <input
            type="text"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            placeholder="Enter Reference ID"
            required
            className="p-2 border border-gray-300 rounded-md w-full mb-4"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Check Status
          </button>
        </form>

        {transactionData && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <tbody>
                {Object.entries(transactionData).map(([key, value]) => (
                  <tr key={key} className="border-t">
                    <td className="px-4 py-2 font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-2 text-gray-600">{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TransactionStatus;
