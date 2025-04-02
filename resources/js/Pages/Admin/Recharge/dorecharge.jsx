import React, { useState } from "react";
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';
import { Signal, Phone, Banknote, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DoRechargeForm = () => {
  const [formData, setFormData] = useState({
    operator: "",
    canumber: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const operators = [
    { label: "Airtel", value: 11 },
    { label: "Airtel Digital TV", value: 12 },
    { label: "BSNL", value: 13 },
    { label: "Dish TV", value: 14 },
    { label: "Idea", value: 4 },
    { label: "Jio", value: 18 },
    { label: "MTNL", value: 35 },
    { label: "MTNL Delhi", value: 33 },
    { label: "MTNL Mumbai", value: 34 },
    { label: "Sun Direct", value: 27 },
    { label: "Tata Sky", value: 8 },
    { label: "Videocon D2H", value: 10 },
    { label: "Vodafone", value: 22 }
  ];

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
      const token = localStorage.getItem('auth_token');
      const response = await axios.post('/admin/recharge/process', {
        operator: parseInt(formData.operator),
        canumber: formData.canumber,
        amount: parseInt(formData.amount),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log("API Response:", response.data);
      setApiResponse(response.data);

      if (response.data.status) {
        setSuccess("Recharge processed successfully!");
        setFormData({
          operator: "",
          canumber: "",
          amount: "",
        });
      } else {
        setError(response.data.message || "Failed to process recharge");
      }
    } catch (err) {
      console.error('Error submitting form:', err);

      // Handle specific error from middleware (403 - Insufficient funds)
      if (err.response?.status === 403 && err.response?.data?.error) {
        setError(err.response.data.error); // "Insufficient funds hai bhai"
      } else {
        // Handle other errors
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.errors || 
                            "Failed to process recharge";
        setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Do Recharge</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="operator" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Signal size={20} className="mr-2 text-green-500" />
                  Operator
                </label>
                <select 
                  id="operator" 
                  value={formData.operator} 
                  onChange={(e) => handleChange("operator", e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Operator</option>
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="canumber" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  Number
                </label>
                <input 
                  id="canumber" 
                  type="text" 
                  value={formData.canumber} 
                  onChange={(e) => handleChange("canumber", e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required 
                  placeholder="Enter Mobile Number"
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Banknote size={20} className="mr-2 text-blue-500" />
                  Amount
                </label>
                <input 
                  id="amount" 
                  type="number" 
                  value={formData.amount} 
                  onChange={(e) => handleChange("amount", e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required 
                  min="1" 
                  placeholder="Enter Amount"
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
              ) : "Process Recharge"}
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
                    <TableHeader className="bg-sky-500 text-white">
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

export default DoRechargeForm;