import React, { useState, useEffect } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import axios from "axios";

const FetchLPGDetails = ({ lpgData }) => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const { data, setData, post, processing } = useForm({
    operator: "",
    canumber: "",
    ad1: "",
    ad2: "",
    ad3: "",
    // ad4: ""
  });

  // Fetch operators when component mounts
  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/fetch-lpg-operator", { mode: "offline" });
      console.log("API Response:", response.data);
      setOperators(response.data.data || []);
    } catch (err) {
      console.error("Error fetching operators:", err);
    }
    setLoading(false);
  };

  // Handle operator selection
  const handleOperatorChange = (e) => {
    const operatorId = e.target.value;
    setData("operator", operatorId);
    
    // Find the selected operator
    const operator = operators.find(op => op.id === operatorId);
    setSelectedOperator(operator);
    
    // Auto-populate fields based on operator selection
    if (operator) {
      setData(data => ({
        ...data,
        operator: operatorId,
        ad1: "",
        ad2: "",
        ad3: "",
        // ad4: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Input Data:", data);
    post(route('LPG.FetchLPGDetails'), {
      onSuccess: (response) => {
        console.log("API Response:", response.props.lpgData);
      },
      onError: (errors) => {
        console.error("Error Response:", errors);
      }
    });
  };
  
  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Fetch LPG Bill Details</h1>

      {/* Form to enter details */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded">
        <div className="mb-3">
          <label className="block font-medium">Operator:</label>
          {loading ? (
            <p>Loading operators...</p>
          ) : (
            <select
              value={data.operator}
              onChange={handleOperatorChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select an operator</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-3">
          <label className="block font-medium">CA Number:</label>
          <input
            type="text"
            value={data.canumber}
            onChange={(e) => setData("canumber", e.target.value)}
            className="border p-2 rounded w-full"
            required
            placeholder={selectedOperator?.displayname || "Enter CA Number"}
          />
          {selectedOperator?.regex && (
            <p className="text-xs text-gray-600 mt-1">Format: {selectedOperator.regex}</p>
          )}
        </div>

        {selectedOperator?.ad1_d_name && (
          <div className="mb-3">
            <label className="block font-medium">{selectedOperator.ad1_d_name}:</label>
            <input
              type="text"
              value={data.ad1}
              onChange={(e) => setData("ad1", e.target.value)}
              className="border p-2 rounded w-full"
              required
              placeholder={`Enter ${selectedOperator.ad1_d_name}`}
            />
            {selectedOperator?.ad1_regex && (
              <p className="text-xs text-gray-600 mt-1">Format: {selectedOperator.ad1_regex}</p>
            )}
          </div>
        )}

        {selectedOperator?.ad2_d_name && (
          <div className="mb-3">
            <label className="block font-medium">{selectedOperator.ad2_d_name}:</label>
            <input
              type="text"
              value={data.ad2}
              onChange={(e) => setData("ad2", e.target.value)}
              className="border p-2 rounded w-full"
              required={!!selectedOperator?.ad2_d_name}
              placeholder={`Enter ${selectedOperator.ad2_d_name}`}
            />
            {selectedOperator?.ad2_regex && (
              <p className="text-xs text-gray-600 mt-1">Format: {selectedOperator.ad2_regex}</p>
            )}
          </div>
        )}

        {selectedOperator?.ad3_d_name && (
          <div className="mb-3">
            <label className="block font-medium">{selectedOperator.ad3_d_name}:</label>
            <input
              type="text"
              value={data.ad3}
              onChange={(e) => setData("ad3", e.target.value)}
              className="border p-2 rounded w-full"
              required={!!selectedOperator?.ad3_d_name}
              placeholder={`Enter ${selectedOperator.ad3_d_name}`}
            />
            {selectedOperator?.ad3_regex && (
              <p className="text-xs text-gray-600 mt-1">Format: {selectedOperator.ad3_regex}</p>
            )}
          </div>
        )}

        {/* <div className="mb-3">
          <label className="block font-medium">Ad4:</label>
          <input
            type="text"
            value={data.ad4}
            onChange={(e) => setData("ad4", e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter Ad4 (if required)"
          />
        </div> */}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={processing}
        >
          {processing ? "Fetching..." : "Fetch Details"}
        </button>
      </form>

      {/* Display API Response in Table Format */}
      {lpgData && (
        <div className="bg-gray-100 p-4 mt-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">Bill Details</h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Response Code</td>
                <td className="border px-4 py-2">{lpgData.response_code}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {lpgData.status ? "Success ✅" : "Failed ❌"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Amount</td>
                <td className="border px-4 py-2">₹{lpgData.amount}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{lpgData.name}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Message</td>
                <td className="border px-4 py-2">{lpgData.message}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default FetchLPGDetails;