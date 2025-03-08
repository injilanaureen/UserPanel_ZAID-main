import { useState } from "react";
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';
export default function AirtelGenerateURL({ latitude, longitude }) {
  const [formData, setFormData] = useState({
    refid: "",
    latitude: latitude, // Pre-filled from props
    longitude: longitude, // Pre-filled from props
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
    <AdminLayout>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Generate URL
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Ref ID:</label>
            <input
              type="number"
              name="refid"
              value={formData.refid}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Latitude:</label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Longitude:</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Generate URL"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      </div>
    </div>
    </AdminLayout>
  );
}
