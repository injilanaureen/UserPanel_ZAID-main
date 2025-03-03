import { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import axios from "axios";

const InsuranceStatusEnquiry = () => {
  const [referenceId, setReferenceId] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/admin/InsurancePremiumPayment/fetchInsuranceStatus", {
        referenceid: referenceId,
      });
      setResponseData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Insurance Status Enquiry</h1>

        {/* Input Section */}
        <div className="mb-4">
          <input
            type="text"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            placeholder="Enter Reference ID"
            className="border p-2 rounded w-1/2"
          />
          <button
            onClick={fetchStatus}
            className="bg-blue-500 text-white p-2 ml-2 rounded"
            disabled={loading || !referenceId}
          >
            {loading ? "Fetching..." : "Check Status"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Table Display */}
        {responseData && responseData.data && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">API Response</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Field</th>
                  <th className="border p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(responseData.data).map(([key, value]) => (
                  <tr key={key} className="border">
                    <td className="border p-2 font-semibold capitalize">{key.replace(/_/g, " ")}</td>
                    <td className="border p-2">{value || "N/A"}</td>
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

export default InsuranceStatusEnquiry;
