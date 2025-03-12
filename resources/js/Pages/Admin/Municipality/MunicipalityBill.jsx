import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";

const MunicipalityBill = ({ response, municipalities }) => {
  // Generate numeric-only reference ID
  const generateReferenceId = () => `${Date.now()}${Math.floor(Math.random() * 9000) + 1000}`;
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOperators, setLoadingOperators] = useState(false);

  const [billData, setBillData] = useState({
    canumber: "",
    operator: "",
    amount: "",
    ad1: "0", // Default to "0" for integer validation
    ad2: "0", // Default to "0" for integer validation
    ad3: "0", // Default to "0" for numeric validation
    latitude: 28.65521, // Default Latitude
    longitude: 77.14343, // Default Longitude
  });

  const [paymentResponse, setPaymentResponse] = useState(response || null);

  // Fetch operators on component mount
  useEffect(() => {
    fetchOperators();
  }, []);

  // Fetch operators from API
  const fetchOperators = async () => {
    setLoadingOperators(true);
    try {
      const response = await axios.post(route("municipality.fetch"), { mode: "online" });
      if (response.data?.data) {
        setOperators(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
    setLoadingOperators(false);
  };

  // Handle form input changes
  const handleChange = (e) => {
    // For ad1, ad2, ad3 fields, ensure they're always valid integers
    if (["ad1", "ad2", "ad3"].includes(e.target.name) && e.target.value === "") {
      setBillData({ ...billData, [e.target.name]: "0" });
    } else {
      setBillData({ ...billData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data - ensure numeric fields are actually numbers
    const requestData = {
      ...billData,
      referenceid: generateReferenceId(),
      canumber: billData.canumber.toString(),
      operator: billData.operator,
      amount: parseFloat(billData.amount),
      ad1: parseInt(billData.ad1 || "0", 10),
      ad2: parseInt(billData.ad2 || "0", 10), 
      ad3: parseFloat(billData.ad3 || "0"),
      latitude: parseFloat(billData.latitude),
      longitude: parseFloat(billData.longitude),
    };

    console.log("Data sent by user:", requestData);
    
    try {
      const { data } = await axios.post("/api/Municipality/pay-bill", requestData);
      console.log(data);
      setPaymentResponse(data);
    } catch (error) {
      console.error("Payment failed", error);
      setPaymentResponse({ 
        message: "Payment failed. Please try again.",
        error: error.response?.data?.message || "Unknown error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-white shadow-md rounded-lg max-w-8xl mx-auto">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">Municipality Bill Payment</h1>

        {/* Bill Payment Form */}
        <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Operator Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">OPERATOR</label>
            <div className="relative">
              <select
                name="operator"
                value={billData.operator}
                onChange={handleChange}
                required
                className="border rounded p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full appearance-none"
                disabled={loadingOperators}
              >
                <option value="">Select Operator</option>
                {operators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              {loadingOperators && (
                <div className="absolute right-10 top-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* CA Number Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">CANUMBER</label>
            <input
              type="text"
              name="canumber"
              value={billData.canumber}
              onChange={handleChange}
              required
              className="border rounded p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter account number"
            />
          </div>

          {/* Amount Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">AMOUNT</label>
            <input
              type="number"
              name="amount"
              value={billData.amount}
              onChange={handleChange}
              required
              className="border rounded p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Additional Fields */}
          {["ad1", "ad2", "ad3"].map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                {key.toUpperCase()} (Integer required)
              </label>
              <input
                type="number"
                name={key}
                value={billData[key]}
                onChange={handleChange}
                required
                className="border rounded p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${key} (number only)`}
              />
            </div>
          ))}

          {/* Coordinates (Optional) */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">LATITUDE</label>
            <input
              type="text"
              name="latitude"
              value={billData.latitude}
              onChange={handleChange}
              className="border rounded p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter latitude"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">LONGITUDE</label>
            <input
              type="text"
              name="longitude"
              value={billData.longitude}
              onChange={handleChange}
              className="border rounded p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter longitude"
            />
          </div>

          {/* Payment Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className={`w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Pay Bill"
              )}
            </button>
          </div>
        </form>

        {/* Payment Response */}
        {paymentResponse && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg overflow-x-auto">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Payment Response</h2>
            {paymentResponse.error && (
              <div className="p-4 mb-4 bg-red-100 border border-red-300 text-red-700 rounded">
                <p className="font-bold">Error:</p>
                <p>{paymentResponse.error}</p>
              </div>
            )}
            <table className="w-full border border-gray-300 rounded-lg text-sm md:text-base">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  {Object.keys(paymentResponse).map((key, index) => (
                    key !== 'error' && (
                      <th key={index} className="px-4 py-3 border border-gray-300 font-medium">
                        {key.replace(/_/g, " ").toUpperCase()}
                      </th>
                    )
                  ))}
                  {paymentResponse.data &&
                    Object.keys(paymentResponse.data).map((key, index) => (
                      <th key={`data-${index}`} className="px-4 py-3 border border-gray-300 font-medium">
                        DATA: {key.replace(/_/g, " ").toUpperCase()}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-gray-700">
                  {Object.entries(paymentResponse).map(([key, value], index) => (
                    key !== 'error' && (
                      <td key={index} className="px-4 py-3 border border-gray-300">
                        {typeof value === "boolean"
                          ? value ? "✅ Yes" : "❌ No"
                          : typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : value}
                      </td>
                    )
                  ))}
                  {paymentResponse.data &&
                    Object.values(paymentResponse.data).map((value, index) => (
                      <td key={`data-${index}`} className="px-4 py-3 border border-gray-300">
                        {typeof value === "boolean"
                          ? value ? "✅ Yes" : "❌ No"
                          : typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : value}
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MunicipalityBill;