import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const RegisterRemitter = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    stateresp: "",
    ekyc_id: "",
  });

  const [submittedData, setSubmittedData] = useState([]); // Store submitted data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/register-remitter1", formData);
      console.log("API Response:", res.data);

      const finalData = {
        ...formData,
        limit: res.data.data?.limit || "",
        message: res.data?.message || "",
        response_code: res.data?.response_code || "",
        status: res.data?.status || "",
      };

      // Store data in the backend
      await axios.post("/store_register-remitter1", finalData);
      console.log("Data Stored Successfully", finalData);

      // Update state with new data
      setSubmittedData((prevData) => [...prevData, finalData]);

      // Reset form
      setFormData({ mobile: "", otp: "", stateresp: "", ekyc_id: "" });
    } catch (err) {
      console.error("API Error:", err);
      setError("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-semibold mb-4">Register Remitter</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP (4 digits)"
            value={formData.otp}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="stateresp"
            placeholder="State Response"
            value={formData.stateresp}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="ekyc_id"
            placeholder="E-KYC ID"
            value={formData.ekyc_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Remitter"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-200 text-red-800 rounded">{error}</div>
        )}

        {/* Table Displaying Submitted Data */}
        {submittedData.length > 0 && (
  <div className="mt-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-700">Submitted Remitter Details</h3>
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-600 text-white text-sm">
            <th className="border px-4 py-2">Mobile</th>
            <th className="border px-4 py-2">OTP</th>
            <th className="border px-4 py-2">State Resp</th>
            <th className="border px-4 py-2">E-KYC ID</th>
            <th className="border px-4 py-2">Limit</th>
            <th className="border px-4 py-2">Message</th>
            <th className="border px-4 py-2">Response Code</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data, index) => (
            <tr key={index} className={`text-center text-gray-700 text-sm ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-blue-100 transition`}>
              <td className="border px-4 py-2 font-medium">{data.mobile}</td>
              <td className="border px-4 py-2">{data.otp}</td>
              <td className="border px-4 py-2">{data.stateresp}</td>
              <td className="border px-4 py-2">{data.ekyc_id}</td>
              <td className="border px-4 py-2 font-semibold text-blue-600">{data.limit}</td>
              <td className="border px-4 py-2 text-gray-600">{data.message}</td>
              <td className="border px-4 py-2">{data.response_code}</td>
              <td className={`border px-4 py-2 font-semibold ${data.status ? "text-green-600" : "text-red-600"}`}>
                {data.status ? "Active" : "Inactive"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      </div>
    </AdminLayout>
  );
};

export default RegisterRemitter;
