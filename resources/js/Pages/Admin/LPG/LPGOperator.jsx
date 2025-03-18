import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import { Signal, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LPGOperator = () => {
  const [mode, setMode] = useState("online");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/fetch-lpg-operator", { mode });
      setData(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">LPG Operators</h2>
          </div>

          {/* Mode Selection */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="mode" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Signal size={20} className="mr-2 text-green-500" />
                  Select Mode
                </label>
                <select
                  id="mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Fetching...
                    </span>
                  ) : "Fetch Data"}
                </button>
              </div>
            </div>

            {/* Response and Error Handling */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            {data.length > 0 && !loading && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  API Response:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-sky-500 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">ID</TableHead>
                        <TableHead className="px-4 py-2 text-left">Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Category</TableHead>
                        <TableHead className="px-4 py-2 text-left">View Bill</TableHead>
                        <TableHead className="px-4 py-2 text-left">Regex</TableHead>
                        <TableHead className="px-4 py-2 text-left">Display Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad1 Display Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad1 Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad1 Regex</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad2 Display Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad2 Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad2 Regex</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad3 Display Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad3 Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Ad3 Regex</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item) => (
                        <TableRow key={item.id} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2">{item.id}</TableCell>
                          <TableCell className="px-4 py-2">{item.name}</TableCell>
                          <TableCell className="px-4 py-2">{item.category}</TableCell>
                          <TableCell className="px-4 py-2">{item.viewbill}</TableCell>
                          <TableCell className="px-4 py-2">{item.regex || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.displayname || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad1_d_name || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad1_name || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad1_regex || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad2_d_name || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad2_name || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad2_regex || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad3_d_name || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad3_name || "N/A"}</TableCell>
                          <TableCell className="px-4 py-2">{item.ad3_regex || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {!loading && !error && data.length === 0 && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-gray-600 text-sm">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LPGOperator;