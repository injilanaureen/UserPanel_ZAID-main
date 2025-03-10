import React, { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import { PackageOpen, AlertCircle, CheckCircle, Code } from 'lucide-react';
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Recharge2 = () => {
  const [referenceId, setReferenceId] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRechargeStatus = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post('/api/recharge/status', {
        referenceid: referenceId
      });

      console.log("API Response:", res.data);
      setResponse(res.data);

      if (!res.data.status) {
        setError(res.data.message || "Failed to fetch recharge status");
      }
    } catch (err) {
      console.error('Error fetching status:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.errors || 
                         "Failed to fetch recharge status";
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Recharge Status</h2>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="referenceId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                <PackageOpen size={20} className="mr-2 text-blue-500" />
                Reference ID
              </label>
              <input
                id="referenceId"
                type="text"
                placeholder="Enter Reference ID"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={fetchRechargeStatus}
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
              ) : "Fetch Status"}
            </button>

            {/* Response and error handling */}
            <div className="mt-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    {error}
                  </p>
                </div>
              )}

              {response && response.status && (
                <div className="mt-4">
                  <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                    <Code size={16} className="mr-2" />
                    Recharge Status Details:
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
                        {Object.entries({
                          Status: response.status,
                          Message: response.message,
                          ...(response.data && {
                            "Txn ID": response.data.txnid,
                            "Operator Name": response.data.operatorname,
                            Amount: response.data.amount,
                            Commission: response.data.comm,
                            "Recharge Status": response.data.status,
                            "Ref ID": response.data.refid,
                            "Operator ID": response.data.operatorid,
                            "Date Added": response.data.dateadded
                          })
                        }).map(([key, value]) => (
                          <TableRow key={key} className="border-b border-gray-200">
                            <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                            <TableCell className="px-4 py-2">{String(value)}</TableCell>
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
      </div>
    </AdminLayout>
  );
};

export default Recharge2;