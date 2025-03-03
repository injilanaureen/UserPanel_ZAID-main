import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout';

const FastagOperatorList = () => {
  const { operators } = usePage().props; // Get API response from Laravel
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOperators, setFilteredOperators] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("API Response:", operators);
    setFilteredOperators(operators?.data || []);
  }, [operators]);

  // Handle search functionality
  useEffect(() => {
    const filtered = operators?.data?.filter(operator => 
      operator.id.toString().includes(searchTerm) ||
      operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.displayname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (operator.ad1_regex && operator.ad1_regex.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];
    setFilteredOperators(filtered);
    setCurrentPage(1);
  }, [searchTerm, operators]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOperators.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOperators.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Fastag Operators</h1>
        <input
          type="text"
          placeholder="Search Operators..."
          className="p-2 border border-gray-300 rounded w-full mt-2 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Operator ID</th>
                <th className="py-2 px-4 border">Operator Name</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">View Bill</th>
                <th className="py-2 px-4 border">Display Name</th>
                <th className="py-2 px-4 border">Regex</th>
                <th className="py-2 px-4 border">Ad1 Regex</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((operator, index) => (
                  <tr key={index} className="text-center border-b">
                    <td className="py-2 px-4 border">{operator.id}</td>
                    <td className="py-2 px-4 border">{operator.name}</td>
                    <td className="py-2 px-4 border">{operator.category}</td>
                    <td className="py-2 px-4 border">{operator.viewbill}</td>
                    <td className="py-2 px-4 border">{operator.displayname}</td>
                    <td className="py-2 px-4 border">{operator.regex || "N/A"}</td>
                    <td className="py-2 px-4 border">{operator.ad1_regex || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center">No matching records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="px-4 py-2 border rounded bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          <span className="px-4">Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 border rounded bg-gray-200"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FastagOperatorList;
