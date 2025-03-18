import { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import axios from "axios";
import { Search, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InsuranceStatusEnquiry = () => {
  const [referenceId, setReferenceId] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setResponseData(null);

    try {
      const response = await axios.post("/admin/InsurancePremiumPayment/fetchInsuranceStatus", {
        referenceid: referenceId,
      });
      
      setResponseData(response.data);
      
      if (response.data.status) {
        setSuccess("Status fetched successfully!");
      } else {
        setError(response.data.message || "Failed to fetch status");
      }
    } catch (err) {
      console.error('Error fetching status:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.errors || 
                         "Failed to fetch data. Please try again.";
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Insurance Status Enquiry</h2>
          </div>

          <form onSubmit={fetchStatus} className="p-6">
            <div className="mb-6">
              <label htmlFor="referenceId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                <Search size={20} className="mr-2 text-blue-500" />
                Reference ID
              </label>
              <div className="flex gap-4">
                <input
                  id="referenceId"
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="Enter Reference ID"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !referenceId}
                  className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Fetching...
                    </span>
                  ) : "Check Status"}
                </button>
              </div>
            </div>
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

            {responseData && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  API Response:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-sky-500 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Field</TableHead>
                        <TableHead className="px-4 py-2 text-left">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(responseData.data || responseData).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium capitalize">
                            {key.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            {value !== null && value !== undefined ? String(value) : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InsuranceStatusEnquiry;