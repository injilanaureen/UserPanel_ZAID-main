import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";

const MunicipalityBill = ({ response }) => {
  const [billData, setBillData] = useState({
    canumber: "",
    operator: "",
    amount: "",
    ad1: "",
    ad2: "",
    ad3: "",
    referenceid: "",
    latitude: "",
    longitude: "",
  });

  const [paymentResponse, setPaymentResponse] = useState(response || null);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setBillData({ ...billData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/Municipality/pay-bill", billData);
      console.log(data);
      setPaymentResponse(data);
    } catch (error) {
      console.error("Payment failed", error);
      setPaymentResponse({ message: "Payment failed. Please try again." });
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
          {Object.keys(billData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                {key.replace(/_/g, " ").toUpperCase()}
              </label>
              <input
                type={["amount", "referenceid", "operator"].includes(key) ? "number" : "text"}
                name={key}
                value={billData[key]}
                onChange={handleChange}
                required
                className="border rounded p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}

          {/* Payment Button inside the form */}
          <button
            type="submit"
            className={`mt-2 w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Bill"}
          </button>
        </form>

        {/* Payment Response */}
      {/* Payment Response */}
 
  {/* Payment Response */}
{/* Payment Response */}
{paymentResponse && (
  <div className="mt-6 p-4 bg-gray-50 border rounded-lg overflow-x-auto">
    <h2 className="text-lg font-semibold mb-2 text-gray-800">Payment Response</h2>
    <table className="w-full border border-gray-300 rounded-lg text-sm md:text-base">
      <thead>
        <tr className="bg-gray-200 text-gray-800">
          {Object.keys(paymentResponse).map((key, index) => (
            <th key={index} className="px-4 py-3 border border-gray-300 font-medium">
              {key.replace(/_/g, " ").toUpperCase()}
            </th>
          ))}
          {/* Agar response.data exist karta hai toh uske keys bhi table me dikhao */}
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
          {Object.values(paymentResponse).map((value, index) => (
            <td key={index} className="px-4 py-3 border border-gray-300">
              {typeof value === "boolean"
                ? value ? "✅ Yes" : "❌ No"
                : typeof value === "object"
                ? JSON.stringify(value, null, 2) // Convert object to readable format
                : value}
            </td>
          ))}
          {/* Agar response.data exist karta hai toh uske values bhi alag columns me dikhao */}
          {paymentResponse.data &&
            Object.values(paymentResponse.data).map((value, index) => (
              <td key={`data-${index}`} className="px-4 py-3 border border-gray-300">
                {typeof value === "boolean"
                  ? value ? "✅ Yes" : "❌ No"
                  : typeof value === "object"
                  ? JSON.stringify(value, null, 2) // Convert object to readable format
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
