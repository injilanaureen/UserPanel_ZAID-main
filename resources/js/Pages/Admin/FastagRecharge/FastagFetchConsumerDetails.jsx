import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
const FastagFetchConsumerDetails = () => {
  return (
<AdminLayout>
<div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Coming Soon</h1>
      </div>
    </AdminLayout>
  );
};
export default FastagFetchConsumerDetails;


// import React, { useState } from "react";
// import AdminLayout from "@/Layouts/AdminLayout";
// import axios from "axios";
// import { Signal, Phone, AlertCircle, CheckCircle, Code } from 'lucide-react';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// const FastagFetchConsumerDetails = () => {
//   const [formData, setFormData] = useState({
//     operator: "",
//     canumber: "",
//   });
//   const [consumerDetails, setConsumerDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError("");
//     setSuccess("");
//   };

//   const fetchConsumerDetails = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     setConsumerDetails(null);

//     try {
//       const response = await axios.post("/api/fetchConsumerDetails", {
//         operator: parseInt(formData.operator),
//         canumber: formData.canumber,
//       });

//       setConsumerDetails(response.data);

//       if (response.data.status) {
//         setSuccess("Consumer details fetched successfully!");
//       } else {
//         setError(response.data.message || "Failed to fetch consumer details");
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.errors || 
//                           "Failed to fetch consumer details";
//       setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="max-w-full">
//         <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
//           <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
//             <h2 className="text-3xl font-semibold text-white">Fastag Consumer Details</h2>
//           </div>

//           <form onSubmit={fetchConsumerDetails} className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label htmlFor="operator" className="flex items-center text-sm font-medium text-gray-600 mb-1">
//                   <Signal size={20} className="mr-2 text-green-500" />
//                   Operator ID
//                 </label>
//                 <input
//                   id="operator"
//                   type="number"
//                   value={formData.operator}
//                   onChange={(e) => handleChange("operator", e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
//                   required
//                   placeholder="Enter Operator ID"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="canumber" className="flex items-center text-sm font-medium text-gray-600 mb-1">
//                   <Phone size={20} className="mr-2 text-yellow-500" />
//                   CA Number
//                 </label>
//                 <input
//                   id="canumber"
//                   type="text"
//                   value={formData.canumber}
//                   onChange={(e) => handleChange("canumber", e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
//                   required
//                   placeholder="Enter CA Number"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Fetching...
//                 </span>
//               ) : "Fetch Details"}
//             </button>
//           </form>

//           {/* Response and error handling */}
//           <div className="px-6 pb-6">
//             {error && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
//                 <p className="text-red-600 text-sm flex items-center">
//                   <AlertCircle size={16} className="mr-2" />
//                   {error}
//                 </p>
//               </div>
//             )}

//             {success && (
//               <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
//                 <p className="text-green-600 text-sm flex items-center">
//                   <CheckCircle size={16} className="mr-2" />
//                   {success}
//                 </p>
//               </div>
//             )}

//             {consumerDetails && (
//               <div className="mt-4">
//                 <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
//                   <Code size={16} className="mr-2" />
//                   Consumer Details
//                 </h3>
//                 <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
//                   <Table className="w-full border-collapse">
//                     <TableHeader className="bg-gray-100 text-white">
//                       <TableRow>
//                         <TableHead className="px-4 py-2 text-left">Key</TableHead>
//                         <TableHead className="px-4 py-2 text-left">Value</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {Object.entries(consumerDetails).map(([key, value]) => (
//                         <TableRow key={key} className="border-b border-gray-200">
//                           <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
//                           <TableCell className="px-4 py-2">
//                             {typeof value === 'object' && value !== null 
//                               ? JSON.stringify(value) 
//                               : String(value)}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default FastagFetchConsumerDetails;