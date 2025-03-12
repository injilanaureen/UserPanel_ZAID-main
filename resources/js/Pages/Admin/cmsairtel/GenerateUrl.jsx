import { useState } from "react";
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';
import { Signal, AlertCircle, CheckCircle } from 'lucide-react';

export default function AirtelGenerateURL({ latitude, longitude }) {
  const [formData, setFormData] = useState({
    refid: "",
    latitude: latitude, // Pre-filled from props
    longitude: longitude, // Pre-filled from props
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      const response = await axios.post("/cms/airtel", formData);
      console.log("✅ API Response:", response.data);

      if (response.data?.status === true && response.data?.redirectionUrl) {
        setSuccess("URL generated successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = response.data.redirectionUrl;
        }, 1000);
      } else {
        setError("Failed to generate URL: " + JSON.stringify(response.data));
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
      <div className="max-w-full p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Generate URL</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="refid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Signal size={20} className="mr-2 text-green-500" />
                  Reference ID
                </label>
                <input
                  id="refid"
                  type="number"
                  name="refid"
                  value={formData.refid}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  placeholder="Enter Reference ID"
                />
              </div>

              <div>
                <label htmlFor="latitude" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Signal size={20} className="mr-2 text-yellow-500" />
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed opacity-75"
                />
              </div>

              <div>
                <label htmlFor="longitude" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Signal size={20} className="mr-2 text-blue-500" />
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed opacity-75"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Generate URL"}
            </button>
          </form>

          {/* Response and error handling */}
          <div className="px-6 pb-6">
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-600 text-sm flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  {success}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}