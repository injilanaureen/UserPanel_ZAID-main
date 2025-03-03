import React, { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

const FetchLPGDetails = ({ lpgData }) => {
  const { data, setData, post, processing } = useForm({
    operator: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('LPG.FetchLPGDetails'));
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Fetch LPG Bill Details</h1>

      {/* Form to enter operator ID */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded">
        <div className="mb-3">
          <label className="block font-medium">Operator ID:</label>
          <input
            type="text"
            name="operator"
            value={data.operator}
            onChange={(e) => setData("operator", e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={processing}
        >
          {processing ? "Fetching..." : "Fetch Details"}
        </button>
      </form>

      {/* Display API Response in Table Format */}
      {lpgData && (
        <div className="bg-gray-100 p-4 mt-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">Bill Details</h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Response Code</td>
                <td className="border px-4 py-2">{lpgData.response_code}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {lpgData.status ? "Success ✅" : "Failed ❌"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Amount</td>
                <td className="border px-4 py-2">₹{lpgData.amount}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{lpgData.name}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Message</td>
                <td className="border px-4 py-2">{lpgData.message}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default FetchLPGDetails;
