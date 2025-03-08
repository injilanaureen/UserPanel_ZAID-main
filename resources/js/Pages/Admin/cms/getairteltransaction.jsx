import axios from "axios";
import { useState } from "react";
import { Receipt } from 'lucide-react';


const CheckTransaction = () => {
  const [refid, setRefid] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setError(null);
    setResponseData(null);

    try {
      const response = await axios.post("/cms/airtel/check-status", { refid });
    
      console.log("API Response:", response.data);
      setResponseData(response.data);
    } catch (err) {
      if (err.response) {
        // Server responded with an error (4xx or 5xx)
        console.log("Full Error:", err);
        setError(`Error ${err.response.status}: ${err.response.data}`);
      } else if (err.request) {
        // Request was sent but no response received
        console.error("No response from server.");
        setError("No response from server.");
      } else {
        // Something went wrong in setting up the request
        console.error("Request error:", err.message);
        setError(err.message);
      }
    }
    
    
  };

  return (
    <div className="flex justify-center min-h-screen max-w-full bg-gray-100">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Check Transaction Status
      </h2>
      <form onSubmit={handleCheckStatus} className="space-y-4">
        <div>
          <div className="flex gap-1">
          <Receipt size={20} className="text-green-500 animate-bounce"/>
          <label className="block text-gray-700 font-medium mb-1">Ref ID:</label>
          </div>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
            placeholder="Enter Reference ID"
            value={refid}
            onChange={(e) => setRefid(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white font-semibold rounded-lg bg-gray-900 hover:bg-black transition"
        >
          Check Status
        </button>
      </form>
  
      {responseData && (
        <p className="text-gray-700 mt-3">Response: {JSON.stringify(responseData)}</p>
      )}
      {error && <p className="text-red-500 mt-3">Error: {error}</p>}
    </div>
  </div>
  
  );
};

export default CheckTransaction;
