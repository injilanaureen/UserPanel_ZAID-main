import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import { AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LPGStatus = () => {
  const [referenceId, setReferenceId] = useState("");
  const [statusResponse, setStatusResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLPGStatus = async () => {
    setLoading(true);
    setError("");
    setStatusResponse(null);

    try {
      const response = await axios.post("/lpg-status", 
        { referenceid: referenceId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
          }
        }
      );
      
      if (response.data) {
        setStatusResponse(response.data);
      } else {
        setError("Invalid response received from server");
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || "Failed to fetch status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!referenceId.trim()) {
      setError("Please enter a Reference ID");
      return;
    }
    fetchLPGStatus();
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">LPG Status Check</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label htmlFor="referenceId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                <Code size={20} className="mr-2 text-blue-500" />
                Reference ID
              </label>
              <input
                id="referenceId"
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="Enter Reference ID"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                required
              />
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
                  Checking...
                </span>
              ) : "Check Status"}
            </button>
          </form>

          <div className="px-6 pb-6">
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            {statusResponse && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Transaction Details
                </h3>
                <p className={`mb-4 text-sm ${statusResponse.status ? "text-green-600" : "text-red-600"}`}>
                  {statusResponse.message}
                </p>

                {statusResponse.data && (
                  <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <Table className="w-full border-collapse">
                      <TableHeader className="bg-sky-500 text-white">
                        <TableRow>
                          <TableHead className="px-4 py-2 text-left">Field</TableHead>
                          <TableHead className="px-4 py-2 text-left">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">Transaction ID</TableCell>
                          <TableCell className="px-4 py-2">{statusResponse.data.txnid}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">Operator Name</TableCell>
                          <TableCell className="px-4 py-2">{statusResponse.data.operatorname}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">Customer Number</TableCell>
                          <TableCell className="px-4 py-2">{statusResponse.data.canumber}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">Amount</TableCell>
                          <TableCell className="px-4 py-2">₹{statusResponse.data.amount}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">TDS</TableCell>
                          <TableCell className="px-4 py-2">₹{statusResponse.data.tds}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">Reference ID</TableCell>
                          <TableCell className="px-4 py-2">{statusResponse.data.refid}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">Operator ID</TableCell>
                          <TableCell className="px-4 py-2">{statusResponse.data.operatorid}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">Date Added</TableCell>
                          <TableCell className="px-4 py-2">{statusResponse.data.dateadded}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="px-4 py-2 font-medium">Refunded</TableCell>
                          <TableCell className="px-4 py-2">
                            {statusResponse.data.refunded === "0" ? "No" : "Yes"}
                          </TableCell>
                        </TableRow>
                        {statusResponse.data.daterefunded && (
                          <TableRow>
                            <TableCell className="px-4 py-2 font-medium">Date Refunded</TableCell>
                            <TableCell className="px-4 py-2">{statusResponse.data.daterefunded}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LPGStatus;