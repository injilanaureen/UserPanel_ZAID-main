import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const PayInsuranceBill = () => {
  const [formData, setFormData] = useState({
    canumber: "",
    amount: "",
    referenceid: "",
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/pay-insurance-bill", formData);
      setApiResponse(response.data);
    } catch (error) {
      setError("Failed to fetch API response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Pay Insurance Bill</h1>
        
        {/* Form to input user-defined values */}
        <form onSubmit={handleSubmit} className="mb-4 space-y-4">
          <div>
            <label className="block font-medium">Customer Number (canumber)</label>
            <input
              type="text"
              name="canumber"
              value={formData.canumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Reference ID</label>
            <input
              type="text"
              name="referenceid"
              value={formData.referenceid}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        {/* Display API Response in a Table */}
        {error && <p className="text-red-500">{error}</p>}
        {apiResponse && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">API Response:</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Response Code</th>
                  <th className="border p-2">Operator ID</th>
                  <th className="border p-2">Acknowledgment No.</th>
                  <th className="border p-2">Reference ID</th>
                  <th className="border p-2">Message</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{apiResponse.status ? "Success" : "Failed"}</td>
                  <td className="border p-2">{apiResponse.response_code}</td>
                  <td className="border p-2">{apiResponse.operatorid}</td>
                  <td className="border p-2">{apiResponse.ackno}</td>
                  <td className="border p-2">{apiResponse.refid}</td>
                  <td className="border p-2">{apiResponse.message}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PayInsuranceBill;
