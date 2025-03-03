import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const FetchInsuranceBillDetails = () => {
  const [formData, setFormData] = useState({
    canumber: "",
    ad1: "",
    ad2: "",
    mode: "online",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billDetails, setBillDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/admin/InsurancePremiumPayment/fetch-lic-bill",
        formData
      );
      setBillDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bill details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Fetch Insurance Bill Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CA Number
                </label>
                <input
                  type="number"
                  name="canumber"
                  value={formData.canumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email 
                </label>
                <input
                  type="email"
                  name="ad1"
                  value={formData.ad1}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="ad2"
                  value={formData.ad2}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Fetch Bill Details"}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {billDetails && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200 text-left">
                        <th className="border px-4 py-2">Customer Name</th>
                        <th className="border px-4 py-2">Bill Amount</th>
                        <th className="border px-4 py-2">Net Amount</th>
                        <th className="border px-4 py-2">Due Date</th>
                        <th className="border px-4 py-2">Max Bill Amount</th>
                        <th className="border px-4 py-2">Accept Payment</th>
                        <th className="border px-4 py-2">Accept Part Pay</th>
                        <th className="border px-4 py-2">Cell Number</th>
                        <th className="border px-4 py-2">Email (ad1)</th>
                        <th className="border px-4 py-2">Additional Field (ad2)</th>
                        <th className="border px-4 py-2">Status Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="border px-4 py-2">{billDetails.name || "N/A"}</td>
                        <td className="border px-4 py-2">{billDetails.bill_fetch?.billAmount || "N/A"}</td>
                        <td className="border px-4 py-2">{billDetails.bill_fetch?.billnetamount || "N/A"}</td>
                        <td className="border px-4 py-2">{billDetails.bill_fetch?.dueDate || "N/A"}</td>
                        <td className="border px-4 py-2">{billDetails.bill_fetch?.maxBillAmount || "N/A"}</td>
                        <td className={`border px-4 py-2 ${billDetails.bill_fetch?.acceptPayment ? "text-green-600" : "text-red-600"}`}>
                          {billDetails.bill_fetch?.acceptPayment ? "Yes" : "No"}
                        </td>
                        <td className={`border px-4 py-2 ${billDetails.bill_fetch?.acceptPartPay ? "text-green-600" : "text-red-600"}`}>
                          {billDetails.bill_fetch?.acceptPartPay ? "Yes" : "No"}
                        </td>
                        <td className="border px-4 py-2">{billDetails.bill_fetch?.cellNumber || "N/A"}</td>
                        <td className="border px-4 py-2">{billDetails.ad1 || "N/A"}</td>
                        <td className="border px-4 py-2">{billDetails.ad2 || "N/A"}</td>
                        <td className="border px-4 py-2">{billDetails.message || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FetchInsuranceBillDetails;
