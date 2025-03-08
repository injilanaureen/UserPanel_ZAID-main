import { useState } from "react";
import axios from "axios";
import { Receipt,LoaderPinwheel ,ShipWheel  } from 'lucide-react';


export default function AirtelGenerateURL() {
  const [formData, setFormData] = useState({
    refid: "",
    latitude: "",
    longitude: "",
  });

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
      const response = await axios.post("/cms/airtel", formData);
      console.log("✅ API Response:", response.data);

      if (response.data?.status === true && response.data?.redirectionUrl) {
        // Redirect the user to the received URL
        window.location.href = response.data.redirectionUrl;
      } else {
        alert("API Response: " + JSON.stringify(response.data));
      }
    } catch (err) {
      console.log("❌ Error:", err);
      setError(err.response?.data?.message || "Network error or server is unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex justify-center max-w-full min-h-screen">
  <div className="shadow-lg  p-6 w-full ">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
      Generate URL
    </h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
      <div className="flex gap-1">
          <Receipt size={20} className="text-green-500 animate-bounce"/>
          <label className="block text-gray-700 font-medium mb-1">Ref ID:</label>
          </div>
        <input
          type="number"
          name="refid"
          value={formData.refid}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
        />
      </div>
      <div>
          <div className="flex gap-1">
          <LoaderPinwheel size={20} className="text-yellow-500 animate-bounce"/>
          <label className="block text-gray-700 font-medium mb-1">latitude:</label>
          </div>       
           <input
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
        />
      </div>
      <div>
      <div className="flex gap-1">
          <ShipWheel size={20} className="text-red-500 animate-bounce"/>
          <label className="block text-gray-700 font-medium mb-1">latitude:</label>
          </div>   
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black"
        }`}
      >
        {loading ? "Processing..." : "Generate URL"}
      </button>
    </form>

    {error && <p className="text-red-500 text-center mt-3">{error}</p>}
  </div>
</div>

  );
}
