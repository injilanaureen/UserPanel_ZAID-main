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

// const FastagFetchConsumerDetails = () => {
//   const [operator, setOperator] = useState("");
//   const [canumber, setCanumber] = useState("");
//   const [consumerDetails, setConsumerDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchConsumerDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post("/api/fetchConsumerDetails", {
//         operator: operator,
//         canumber: canumber,
//       });
//       setConsumerDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to fetch details. Please try again.");
//       setConsumerDetails(null);
//     }
//     setLoading(false);
//   };

//   return (
//     <AdminLayout>
//       <h1 className="text-xl font-bold mb-4">Fastag Consumer Details</h1>

//       {/* Input Fields */}
//       <div className="mb-4">
//         <label className="block font-medium">Operator ID:</label>
//         <input
//           type="number"
//           value={operator}
//           onChange={(e) => setOperator(e.target.value)}
//           className="border p-2 w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block font-medium">CA Number:</label>
//         <input
//           type="text"
//           value={canumber}
//           onChange={(e) => setCanumber(e.target.value)}
//           className="border p-2 w-full"
//         />
//       </div>
//       <button
//         onClick={fetchConsumerDetails}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//         disabled={loading}
//       >
//         {loading ? "Fetching..." : "Fetch Details"}
//       </button>

//       {/* Error Message */}
//       {error && <p className="text-red-500 mt-2">{error}</p>}

//       {/* Display Data in Table */}
//       {consumerDetails && (
//         <div className="mt-6 p-4 border rounded bg-white">
//           <h2 className="font-bold text-lg mb-3">Bill Details</h2>
//           <table className="w-full border-collapse border border-gray-300">
//             <tbody>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Response Code</td>
//                 <td className="p-2">{consumerDetails.response_code}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Status</td>
//                 <td className="p-2">
//                   {consumerDetails.status ? "Success" : "Failed"}
//                 </td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Amount</td>
//                 <td className="p-2">₹{consumerDetails.amount}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Name</td>
//                 <td className="p-2">{consumerDetails.name}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Due Date</td>
//                 <td className="p-2">{consumerDetails.duedate}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Cell Number</td>
//                 <td className="p-2">{consumerDetails.bill_fetch.cellNumber}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Username</td>
//                 <td className="p-2">{consumerDetails.bill_fetch.userName}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Bill Amount</td>
//                 <td className="p-2">₹{consumerDetails.bill_fetch.billAmount}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Net Amount</td>
//                 <td className="p-2">₹{consumerDetails.bill_fetch.billnetamount}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Max Bill Amount</td>
//                 <td className="p-2">₹{consumerDetails.bill_fetch.maxBillAmount}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Accept Payment</td>
//                 <td className="p-2">
//                   {consumerDetails.bill_fetch.acceptPayment ? "Yes" : "No"}
//                 </td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Accept Partial Payment</td>
//                 <td className="p-2">
//                   {consumerDetails.bill_fetch.acceptPartPay ? "Yes" : "No"}
//                 </td>
//               </tr>
//               <tr>
//                 <td className="p-2 font-semibold">Message</td>
//                 <td className="p-2">{consumerDetails.message}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </AdminLayout>
//   );
// };

// export default FastagFetchConsumerDetails;
