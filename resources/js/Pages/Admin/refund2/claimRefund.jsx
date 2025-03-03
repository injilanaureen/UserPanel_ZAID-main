import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

const ClaimRefund = ({ apiResponse }) => {
  const [ackno, setAckno] = useState('');
  const [referenceid, setReferenceid] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(route('transaction2.processRefund'), {
      ackno,
      referenceid,

    });
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Claim Refund</h1>

        {/* Form to collect input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Ackno:</label>
            <input
              type="text"
              value={ackno}
              onChange={(e) => setAckno(e.target.value)}
              required
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Reference ID:</label>
            <input
              type="text"
              value={referenceid}
              onChange={(e) => setReferenceid(e.target.value)}
              required
              className="border p-2 w-full rounded"
            />
          </div>

    

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {/* API Response Table */}
        {apiResponse && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">API Response:</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Field</th>
                  <th className="border p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(apiResponse).map(([key, value]) => (
                  <tr key={key} className="hover:bg-gray-100">
                    <td className="border p-2 font-medium">{key}</td>
                    <td className="border p-2">{String(value)}</td>
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

export default ClaimRefund;
