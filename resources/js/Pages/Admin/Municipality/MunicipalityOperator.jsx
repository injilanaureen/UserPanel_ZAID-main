import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const MunicipalityOperator = () => {
  const [mode, setMode] = useState("online"); // Default mode
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const saveDataToDatabase = async (data) => {
    try {
      await axios.post("/municipality/save", data);
      console.log("✅ Data saved successfully");
    } catch (error) {
      console.error("❌ Error saving data:", error);
    }
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(route("municipality.fetch"), { mode });
      setApiResponse(response.data);
  
      if (response.data?.data) {
        for (const item of response.data.data) {
          const payload = {
            id: item.id,
            name: item.name,
            category: item.category || "", // Ensure string
            displayname: item?.displayname || "No Display Name", // ✅ Prevents empty value
            regex: item.regex ?? "N/A",
            viewbill: item.viewbill,
            ad1_d_name: item.ad1_d_name ?? "N/A",
            ad1_name: item.ad1_name ?? "N/A",
            ad1_regex: item.ad1_regex ?? "N/A",
          };
        
          
          await saveDataToDatabase(payload);
          console.log(payload)
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiResponse(null);
    }
    setLoading(false);
  };
  

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Municipality Operators</h1>
          
          {/* Mode Selection with improved styling */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            <button
              onClick={fetchData}
              className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Fetch Data
            </button>
          </div>
        </div>
        
        {/* Loading state with spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-blue-600 font-medium">Loading data...</span>
          </div>
        ) : apiResponse && apiResponse.data && apiResponse.data.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Name", "Category", "View Bill", "Regex", "Display Name", "Ad1 Display Name", "Ad1 Name", "Ad1 Regex"].map((header) => (
                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiResponse.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.viewbill}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.regex || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.displayname || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.ad1_d_name || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.ad1_name || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.ad1_regex || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="mt-4 text-lg text-gray-600 font-medium">No data available</p>
            <p className="text-sm text-gray-500">Try changing the mode or check your connection</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MunicipalityOperator;
