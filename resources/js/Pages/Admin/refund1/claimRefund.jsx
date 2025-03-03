import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";
import axios from "axios";

const ClaimRefund = ({ apiResponse }) => {
  const [ackno, setAckno] = useState("");
  const [referenceid, setReferenceid] = useState("");
  const [otp, setOtp] = useState("");
  const [refunds, setRefunds] = useState([]);
  const [refundResponse, setRefundResponse] = useState([]);
  const [error, setError] = useState(null);
  



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    router.post(
      route("process.claimRefund"),
      { ackno, referenceid, otp },
      {
        onSuccess: (response) => {
          if (response.props.success) {
            setRefundResponse((prevResponses) => [
              ...(prevResponses || []), // Ensure it's an array before spreading
              response.props.data,
            ]);
            
          } else {
            setError(response.props.error || "Something went wrong");
          }
        },
        onError: (errors) => {
          setError(errors.message || "An error occurred");
        },
      }
    );
  };
  

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Claim Refund</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Ackno:</label>
            <input
              type="text"
              value={ackno}
              onChange={(e) => setAckno(e.target.value)}
              required
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Reference ID:</label>
            <input
              type="text"
              value={referenceid}
              onChange={(e) => setReferenceid(e.target.value)}
              required
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="border p-2 w-full rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {/* Refunds Table */}
        {refundResponse.length > 0 && (
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">API Response Table:</h2>
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Reference ID</th>
          <th className="border p-2">Ackno</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Response Code</th>
          <th className="border p-2">Message</th>
        </tr>
      </thead>
      <tbody>
        {refundResponse.map((res, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="border p-2">{res.referenceid || "N/A"}</td>
            <td className="border p-2">{res.ackno || "N/A"}</td>
            <td className="border p-2">{res.status ? "Success" : "Failed"}</td>
            <td className="border p-2">{res.response_code || "N/A"}</td>
            <td className="border p-2">{res.message || "No message"}</td>
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

export default ClaimRefund;
