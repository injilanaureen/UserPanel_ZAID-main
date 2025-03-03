import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const LPGStatus = () => {
  const [referenceId, setReferenceId] = useState("");
  const [statusResponse, setStatusResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLPGStatus = async () => {
    setLoading(true);
    setError("");
    setStatusResponse(null);

    try {
      const response = await axios.post("/lpg-status", 
        { referenceid: referenceId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
          }
        }
      );
      
      if (response.data) {
        setStatusResponse(response.data);
      } else {
        setError("Invalid response received from server");
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || "Failed to fetch status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!referenceId.trim()) {
      setError("Please enter a Reference ID");
      return;
    }
    fetchLPGStatus();
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">LPG Status Check</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700">
              Reference ID
            </label>
            <input
              id="referenceId"
              type="text"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="Enter Reference ID"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Display API Response */}
        {statusResponse && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold">Transaction Details</h2>

            {/* Message */}
            <p className={`mt-2 font-semibold ${statusResponse.status ? "text-green-600" : "text-red-600"}`}>
              {statusResponse.message}
            </p>

            {statusResponse.data && (
              <div className="mt-3 bg-white p-4 rounded shadow">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                  <tr>
                      <td className="border px-4 py-2 font-semibold">Transaction ID</td>
                      <td className="border px-4 py-2">{statusResponse.data.txnid}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Operator Name</td>
                      <td className="border px-4 py-2">{statusResponse.data.operatorname}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Customer Number</td>
                      <td className="border px-4 py-2">{statusResponse.data.canumber}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Amount</td>
                      <td className="border px-4 py-2">₹{statusResponse.data.amount}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">TDS</td>
                      <td className="border px-4 py-2">₹{statusResponse.data.tds}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Reference ID</td>
                      <td className="border px-4 py-2">{statusResponse.data.refid}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Operator ID</td>
                      <td className="border px-4 py-2">{statusResponse.data.operatorid}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Date Added</td>
                      <td className="border px-4 py-2">{statusResponse.data.dateadded}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Refunded</td>
                      <td className="border px-4 py-2">
                        {statusResponse.data.refunded === "0" ? "No" : "Yes"}
                      </td>
                    </tr>
                    {statusResponse.data.daterefunded && (
                      <tr>
                        <td className="border px-4 py-2 font-semibold">Date Refunded</td>
                        <td className="border px-4 py-2">{statusResponse.data.daterefunded}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LPGStatus;