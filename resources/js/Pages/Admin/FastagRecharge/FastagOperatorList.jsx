import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
const FastagOperatorList = () => {
  return (
<AdminLayout>
<div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Coming Soon</h1>
      </div>
    </AdminLayout>
  );
};

export default FastagOperatorList;

// import { useState, useEffect } from "react";
// import { usePage } from "@inertiajs/react";
// import AdminLayout from '@/Layouts/AdminLayout';
// import { Search, AlertCircle } from 'lucide-react';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// const FastagOperatorList = () => {
//   const { operators } = usePage().props;
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredOperators, setFilteredOperators] = useState([]);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     setFilteredOperators(operators || []);
//   }, [operators]);

//   useEffect(() => {
//     const filtered = operators?.filter(operator => 
//       operator.operator_id.toString().includes(searchTerm) ||
//       operator.id.toString().includes(searchTerm) ||
//       operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       operator.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       operator.displayname.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (operator.ad1_regex && operator.ad1_regex.toLowerCase().includes(searchTerm.toLowerCase()))
//     ) || [];
//     setFilteredOperators(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, operators]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredOperators.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredOperators.length / itemsPerPage);

//   return (
//     <AdminLayout>
//       <div className="max-w-full p-4">
//         <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
//           {/* Header */}
//           <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
//             <h1 className="text-3xl font-semibold text-white">Fastag Operators</h1>
//           </div>

//           {/* Search Bar */}
//           <div className="p-6">
//             <div className="relative mb-6">
//               <label htmlFor="search" className="flex items-center text-sm font-medium text-gray-600 mb-1">
//                 <Search size={20} className="mr-2 text-gray-500" />
//                 Search Operators
//               </label>
//               <input
//                 id="search"
//                 type="text"
//                 placeholder="Search by ID, name, category..."
//                 className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <Table className="w-full border-collapse">
//                 <TableHeader className="bg-gray-200">
//                   <TableRow>
//                     <TableHead className="px-4 py-2 text-left text-gray-700 font-medium">ID</TableHead>
//                     <TableHead className="px-4 py-2 text-left text-gray-700 font-medium">Operator ID</TableHead>
//                     <TableHead className="px-4 py-2 text-left text-gray-700 font-medium">Name</TableHead>
//                     <TableHead className="px-4 py-2 text-left text-gray-700 font-medium">Category</TableHead>
//                     <TableHead className="px-4 py-2 text-left text-gray-700 font-medium">View Bill</TableHead>
//                     <TableHead className="px-4 py-2 text-left text-gray-700 font-medium">Display Name</TableHead>
//                     <TableHead className="px-4 py-2 text-left text-gray-700 font-medium">Regex</TableHead>
//                     <TableHead className="px-4 py-2 text-left text-gray-700 font-medium">Ad1 Regex</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentItems.length > 0 ? (
//                     currentItems.map((operator, index) => (
//                       <TableRow key={index} className="hover:bg-gray-50 transition-colors">
//                         <TableCell className="px-4 py-2">{operator.id}</TableCell>
//                         <TableCell className="px-4 py-2">{operator.operator_id}</TableCell>
//                         <TableCell className="px-4 py-2">{operator.name}</TableCell>
//                         <TableCell className="px-4 py-2">{operator.category}</TableCell>
//                         <TableCell className="px-4 py-2">{operator.viewbill}</TableCell>
//                         <TableCell className="px-4 py-2">{operator.displayname}</TableCell>
//                         <TableCell className="px-4 py-2">{operator.regex || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2">{operator.ad1_regex || "N/A"}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan="8" className="py-4 text-center">
//                         <div className="flex items-center justify-center text-gray-500">
//                           <AlertCircle size={16} className="mr-2" />
//                           No matching records found
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-6 px-4">
//               <div className="text-sm text-gray-600">
//                 Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOperators.length)} of {filteredOperators.length} entries
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                 >
//                   Previous
//                 </button>
//                 <span className="px-4 py-2 text-sm text-gray-600">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default FastagOperatorList;