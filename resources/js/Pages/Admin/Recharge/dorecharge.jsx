import React, { useState } from "react";
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';

const DoRechargeForm = () => {
  const [formData, setFormData] = useState({
    operator: "",
    canumber: "",
    amount: "",
    // Remove referenceid from initial state
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const operators = [
    { label: "Airtel", value: 11 },
    { label: "Airtel Digital TV", value: 12 },
    { label: "BSNL", value: 13 },
    { label: "Dish TV", value: 14 },
    { label: "Idea", value: 4 },
    { label: "Jio", value: 18 },
    { label: "MTNL", value: 35 },
    { label: "MTNL Delhi", value: 33 },
    { label: "MTNL Mumbai", value: 34 },
    { label: "Sun Direct", value: 27 },
    { label: "Tata Sky", value: 8 },
    { label: "Videocon D2H", value: 10 },
    { label: "Vodafone", value: 22 }
  ];

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setApiResponse(null);

    try {
      const response = await axios.post('/admin/recharge/process', {
        operator: parseInt(formData.operator),
        canumber: formData.canumber,
        amount: parseInt(formData.amount),
        // No need to send referenceid as backend will generate it
      });

      console.log("API Response:", response.data);

      setApiResponse(response.data);

      if (response.data.status) {
        setSuccess("Recharge processed successfully!");
        setFormData({
          operator: "",
          canumber: "",
          amount: "",
        });
      } else {
        setError(response.data.message || "Failed to process recharge");
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors || 
                          "Failed to process recharge";
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Do Recharge</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="operator" className="block text-sm font-medium text-gray-700">
                  Operator
                </label>
                <select
                  id="operator"
                  value={formData.operator}
                  onChange={(e) => handleChange("operator", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Operator</option>
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="canumber" className="block text-sm font-medium text-gray-700">
                   Number
                </label>
                <input
                  id="canumber"
                  type="text"
                  value={formData.canumber}
                  onChange={(e) => handleChange("canumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter CA Number"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                  placeholder="Enter Amount"
                />
              </div>
              {/* Remove the referenceid input field */}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Process Recharge"}
            </button>
          </form>

          {/* Display API response or error */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
          {apiResponse && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold text-lg">API Response:</h3>
              <pre className="text-sm text-gray-800 bg-gray-200 p-2 rounded-md">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DoRechargeForm;