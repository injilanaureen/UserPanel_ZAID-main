import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Signal, AlertCircle, CheckCircle, RefreshCw, ChevronDown, ChevronUp, Search } from 'lucide-react';

const OperatorList = () => {
  const [operators, setOperators] = useState([]);
  const [filteredOperators, setFilteredOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const { props } = usePage();

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.content : '';
  };

  const fetchOperators = async () => {
    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      const response = await axios.get('/api/operators', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });

      console.log('Response Data:', response.data);

      if (response.data.success) {
        const operatorData = response.data.operators || [];
        const processedData = Array.isArray(operatorData) ? operatorData : [];
        setOperators(processedData);
        setFilteredOperators(processedData);
        setSuccess("Operators loaded successfully!");
      } else {
        setError(response.data.message || 'Failed to fetch operators');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred while fetching operators';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredOperators(operators);
    } else {
      const filtered = operators.filter(operator => 
        (operator.id && operator.id.toString().includes(query)) ||
        (operator.name && operator.name.toLowerCase().includes(query)) ||
        (operator.category && operator.category.toLowerCase().includes(query)) ||
        (operator.displayname && operator.displayname.toLowerCase().includes(query)) ||
        (operator.regex && operator.regex.toLowerCase().includes(query)) ||
        (operator.ad1_name && operator.ad1_name.toLowerCase().includes(query)) ||
        (operator.ad2_name && operator.ad2_name.toLowerCase().includes(query)) ||
        (operator.ad3_name && operator.ad3_name.toLowerCase().includes(query))
      );
      setFilteredOperators(filtered);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Operator List</h2>
          </div>

          <div className="p-6">
            <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center">
                <Signal size={20} className="mr-2 text-green-500" />
                <span className="text-lg font-medium">Available Operators</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search operators..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                </div>
                
                <button
                  onClick={fetchOperators}
                  disabled={loading}
                  className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Refreshing...
                    </span>
                  ) : (
                    <>
                      <RefreshCw size={16} className="mr-2" />
                      Refresh Operators
                    </>
                  )}
                </button>
              </div>
            </div>

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

            {loading && (
              <div className="flex justify-center items-center p-8">
                <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {!loading && filteredOperators.length > 0 && (
              <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden mt-4">
                <Table className="w-full border-collapse">
                  <TableHeader className="bg-sky-500 text-white">
                    <TableRow>
                      <TableHead className="px-4 py-2 text-left"></TableHead>
                      <TableHead className="px-4 py-2 text-left">ID</TableHead>
                      <TableHead className="px-4 py-2 text-left">Name</TableHead>
                      <TableHead className="px-4 py-2 text-left">Category</TableHead>
                      <TableHead className="px-4 py-2 text-left">View Bill</TableHead>
                      <TableHead className="px-4 py-2 text-left">Display Name</TableHead>
                      <TableHead className="px-4 py-2 text-left">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperators.map((operator, index) => (
                      <React.Fragment key={operator.id || index}>
                        <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                          <TableCell className="px-4 py-2">
                            <button 
                              onClick={() => toggleRowExpansion(operator.id || index)}
                              className="text-gray-500 hover:text-gray-800"
                            >
                              {expandedRows[operator.id || index] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </TableCell>
                          <TableCell className="px-4 py-2">{operator.id || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2 font-medium">{operator.name || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{operator.category || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{operator.viewbill === "1" ? 'Yes' : 'No'}</TableCell>
                          <TableCell className="px-4 py-2">{operator.displayname || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">
                            <button
                              onClick={() => toggleRowExpansion(operator.id || index)}
                              className="text-blue-500 hover:text-blue-700 underline text-sm"
                            >
                              {expandedRows[operator.id || index] ? 'Hide Details' : 'View Details'}
                            </button>
                          </TableCell>
                        </TableRow>
                        
                        {expandedRows[operator.id || index] && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={7} className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-700">Basic Information</h4>
                                  <p><span className="font-medium">ID:</span> {operator.id || 'N/A'}</p>
                                  <p><span className="font-medium">Name:</span> {operator.name || 'N/A'}</p>
                                  <p><span className="font-medium">Category:</span> {operator.category || 'N/A'}</p>
                                  <p><span className="font-medium">View Bill:</span> {operator.viewbill === "1" ? 'Yes' : 'No'}</p>
                                  <p><span className="font-medium">Display Name:</span> {operator.displayname || 'N/A'}</p>
                                  <p><span className="font-medium">Regex:</span> {operator.regex || 'N/A'}</p>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-700">AD1 Information</h4>
                                  <p><span className="font-medium">Display Name:</span> {operator.ad1_d_name || 'N/A'}</p>
                                  <p><span className="font-medium">Name:</span> {operator.ad1_name || 'N/A'}</p>
                                  <p><span className="font-medium">Regex:</span> {operator.ad1_regex || 'N/A'}</p>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-700">AD2 Information</h4>
                                  <p><span className="font-medium">Display Name:</span> {operator.ad2_d_name || 'N/A'}</p>
                                  <p><span className="font-medium">Name:</span> {operator.ad2_name || 'N/A'}</p>
                                  <p><span className="font-medium">Regex:</span> {operator.ad2_regex || 'N/A'}</p>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-700">AD3 Information</h4>
                                  <p><span className="font-medium">Display Name:</span> {operator.ad3_d_name || 'N/A'}</p>
                                  <p><span className="font-medium">Name:</span> {operator.ad3_name || 'N/A'}</p>
                                  <p><span className="font-medium">Regex:</span> {operator.ad3_regex || 'N/A'}</p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && !error && filteredOperators.length === 0 && (
              <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                {searchQuery ? (
                  <>
                    <p className="text-lg mb-2">No operators match your search</p>
                    <p className="text-sm">Try changing your search terms or clearing the search</p>
                  </>
                ) : (
                  <p>No operators found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OperatorList;