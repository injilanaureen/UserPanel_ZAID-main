import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";
import { Phone, AlertCircle, CheckCircle, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RemitterEKYC = () => {
  const [mobile, setMobile] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const response = await axios.post("/ekyc_remitter1", {
        mobile,
        aadhaar_number: aadhaarNumber,
      });
      console.log(response.data);
      setResponseData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Remitter E-KYC</h2>
            <p className="mt-2 text-sm text-gray-200">Verify remitter details using mobile and Aadhaar</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="mobile" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  pattern="[0-9]{10}"
                />
              </div>
              
              <div>
                <label htmlFor="aadhaar" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <User size={20} className="mr-2 text-blue-500" />
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  id="aadhaar"
                  placeholder="Enter Aadhaar Number"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  pattern="[0-9]{12}"
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
              ) : "Submit E-KYC"}
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

            {responseData && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <CheckCircle size={16} className="mr-2 text-green-500" />
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
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-2 font-medium">Status</TableCell>
                        <TableCell className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${responseData.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {responseData.status ? 'Success' : 'Failed'}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-2 font-medium">Response Code</TableCell>
                        <TableCell className="px-4 py-2">{responseData.response_code}</TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-2 font-medium">Message</TableCell>
                        <TableCell className="px-4 py-2">{responseData.message}</TableCell>
                      </TableRow>
                      {responseData.data && (
                        <>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-2 font-medium">Mobile</TableCell>
                            <TableCell className="px-4 py-2">{responseData.data.mobile}</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-2 font-medium">E-KYC ID</TableCell>
                            <TableCell className="px-4 py-2">{responseData.data.ekyc_id}</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-2 font-medium">State Response</TableCell>
                            <TableCell className="px-4 py-2">{responseData.data.stateresp}</TableCell>
                          </TableRow>
                        </>
                      )}
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

export default RemitterEKYC;