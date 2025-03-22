import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { Ticket, Bus, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TicketCancellation = () => {
  const [formData, setFormData] = useState({
    refId: "",
    seatNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setApiResponse(null);

    try {
      const result = await axios.post("/api/cancel-bus-ticket", {
        refId: formData.refId,
        seatNumber: formData.seatNumber
      });
      
      console.log("API Response:", result.data);
      
      setApiResponse(result.data);
      
      if (result.data.status) {
        setSuccess("Ticket cancelled successfully!");
        setFormData({
          refId: "",
          seatNumber: ""
        });
      } else {
        setError(result.data.message || "Failed to cancel ticket");
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors || 
                          "An error occurred during cancellation";
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head title="Bus Ticket Cancellation" />
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Bus Ticket Cancellation</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="refId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Ticket size={20} className="mr-2 text-green-500" />
                  Reference ID
                </label>
                <input 
                  id="refId" 
                  type="text" 
                  value={formData.refId} 
                  onChange={(e) => handleChange("refId", e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="seatNumber" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Bus size={20} className="mr-2 text-yellow-500" />
                  Seat Number
                </label>
                <input 
                  id="seatNumber" 
                  type="text" 
                  value={formData.seatNumber} 
                  onChange={(e) => handleChange("seatNumber", e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required 
                  placeholder="e.g. n3"
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
              ) : "Cancel Ticket"}
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
            
            {apiResponse && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  API Response :
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-gray-100 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Key</TableHead>
                        <TableHead className="px-4 py-2 text-left">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(apiResponse).map(([key, value]) => (
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
    </AdminLayout>
  );
};

export default TicketCancellation;