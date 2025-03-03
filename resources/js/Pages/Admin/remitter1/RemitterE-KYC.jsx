import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const RemitterEKYC = () => {
  const [mobile, setMobile] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/ekyc_remitter1", {
        mobile,
        aadhaar_number: aadhaarNumber,
      });
  console.log(response.data)
      setResponseData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Remitter E-KYC</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 "
          required
        />
        <input
          type="text"
          placeholder="Enter Aadhaar Number"
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 "
          required
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-300 w-full"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
  
      {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
  
      {responseData && (
        <div className="mt-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md w-full max-w-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">API Response</h3>
  
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 px-5 py-3 text-left">Field</th>
                <th className="border border-gray-300 px-5 py-3 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold">Status</td>
                <td className="border border-gray-300 px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${responseData.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                  >
                    {responseData.status ? "Success" : "Failed"}
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 px-4 py-3 font-semibold">Response Code</td>
                <td className="border border-gray-300 px-4 py-3">{responseData.response_code}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold">Message</td>
                <td className="border border-gray-300 px-4 py-3">{responseData.message}</td>
              </tr>
  
              {responseData.data && (
                <>
                  <tr className="bg-gray-100">
                    <td className="border border-gray-300 px-4 py-3 font-semibold">Mobile</td>
                    <td className="border border-gray-300 px-4 py-3">{responseData.data.mobile}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold">E-KYC ID</td>
                    <td className="border border-gray-300 px-4 py-3">{responseData.data.ekyc_id}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border border-gray-300 px-4 py-3 font-semibold">State Response</td>
                    <td className="border border-gray-300 px-4 py-3">{responseData.data.stateresp}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </AdminLayout>
  
  
  );
};

export default RemitterEKYC;
