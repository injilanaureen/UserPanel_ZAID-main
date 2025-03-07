import axios from "axios";
import { useState } from "react";

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
      console.error("API Error:", err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h2 className="font-semibold">Check Transaction Status</h2>
      <form onSubmit={handleCheckStatus}>
        <label className="mb-4">
          Ref ID:
          <input type="text" className="m-1" value={refid} onChange={(e) => setRefid(e.target.value)} required />
        </label>
        <br />
        <button type="submit" className="border-2 p-2 mt-2 ">Check Status</button>
      </form>

      {responseData && <p>Response: {JSON.stringify(responseData)}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
    </div>
  );
};

export default CheckTransaction;
