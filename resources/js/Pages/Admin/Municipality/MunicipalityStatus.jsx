import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const MunicipalityStatus = () => {
  const [referenceId, setReferenceId] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const response = await axios.post(
        "/api/Municipality/MunicipalityStatus",
        { referenceid: referenceId }
      );

      setResponseData(response.data);
    } catch (err) {
      setError("Error fetching status. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Municipality Status Checker
            </h2>
          </div>
          
          <div className="p-6">
            {/* Form for Reference ID */}
            <div className="mb-6">
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="Enter Reference ID"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking Status...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Check Status
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Display Response */}
            {responseData && (
              <div className="mt-4">
                <div className="flex items-center mb-4">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800">Status Results</h3>
                </div>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50 w-1/3">Response Code</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {responseData.response_code}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50 w-1/3">Status</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {responseData.status ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M4 8l2 2 4-4m.535-2.857a7 7 0 11-9.9 9.9 7 7 0 019.9-9.9z" />
                              </svg>
                              Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M10 2.5L7.5 5 10 7.5 7.5 10 5 7.5 2.5 10 0 7.5 2.5 5 0 2.5 2.5 0 5 2.5 7.5 0 10 2.5z" />
                              </svg>
                              Failed
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50 w-1/3">Message</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                          {responseData.message}
                        </td>
                      </tr>
                      
                      {/* If "data" exists, map through its properties */}
                      {responseData.data &&
                        Object.entries(responseData.data).map(([key, value], index) => (
                          <tr key={key} className={index % 2 === 0 ? "" : "bg-gray-50"}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50 w-1/3">
                              {key.replace(/_/g, " ").toUpperCase()}
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                              {value || (
                                <span className="text-gray-400 italic">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MunicipalityStatus;
