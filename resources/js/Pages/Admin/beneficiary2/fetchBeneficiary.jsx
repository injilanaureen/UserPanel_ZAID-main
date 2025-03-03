import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage, router } from '@inertiajs/react';

const FetchBeneficiary = () => {
  const { beneficiaryData, mobile } = usePage().props;
  const [mobileNumber, setMobileNumber] = useState(mobile || '');

  // Handle form submission to fetch beneficiary details
  const handleSubmit = (e) => {
    e.preventDefault();
    router.get('/admin/beneficiary2/fetch', { mobile: mobileNumber });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Fetch Beneficiary</h1>

        {/* Mobile Number Input Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter Mobile Number"
            className="border p-2 rounded-lg mr-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Fetch Beneficiary
          </button>
        </form>

        {/* Display Beneficiary Data from DB */}
        {beneficiaryData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Beneficiary ID</th>
                  <th className="p-2 border">Bank ID</th>
                  <th className="p-2 border">Bank Name</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Account Number</th>
                  <th className="p-2 border">IFSC</th>
                  <th className="p-2 border">Verified</th>
                  <th className="p-2 border">Bank Type</th>
                  <th className="p-2 border">Paytm Supported</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaryData.map((beneficiary) => (
                  <tr key={beneficiary.bene_id} className="hover:bg-gray-100">
                    <td className="p-2 border">{beneficiary.bene_id || 'N/A'}</td>
                    <td className="p-2 border">{beneficiary.bankid || 'N/A'}</td>
                    <td className="p-2 border">{beneficiary.bankname || 'N/A'}</td>
                    <td className="p-2 border">{beneficiary.name || 'N/A'}</td>
                    <td className="p-2 border">{beneficiary.accno || 'N/A'}</td>
                    <td className="p-2 border">{beneficiary.ifsc || 'N/A'}</td>
                    <td className="p-2 border">{beneficiary.verified ? 'Yes' : 'No'}</td>
                    <td className="p-2 border">{beneficiary.banktype || 'N/A'}</td>
                    <td className="p-2 border">{beneficiary.paytm ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-red-600">No beneficiaries found in the database.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default FetchBeneficiary;
