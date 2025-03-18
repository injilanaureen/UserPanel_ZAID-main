import React, { useState, useEffect } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import { PackageOpen, AlertCircle, Code, Search } from 'lucide-react';
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Recharge2 = () => {
  const [referenceId, setReferenceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all transactions on component mount
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // Fetch all transactions from database
  const fetchAllTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get('/rechargetransactions');
      
      console.log("Transactions:", res.data);
      setTransactions(res.data.transactions || []);
      setFilteredTransactions(res.data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.errors || 
                         "Failed to fetch transactions";
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by reference ID and date
  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by reference ID
    if (referenceId.trim()) {
      filtered = filtered.filter(
        transaction => transaction.referenceid.toLowerCase().includes(referenceId.toLowerCase())
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.created_at).toISOString().split('T')[0];
        return transactionDate === selectedDate;
      });
    }

    setFilteredTransactions(filtered);
    
    if (filtered.length === 0) {
      setError(`No transactions found matching the ${referenceId && selectedDate ? 
        'reference ID and date' : 
        referenceId ? 'reference ID' : 
        'selected date'}`);
    } else {
      setError(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Recharge Transactions</h2>
          </div>

          <div className="p-6">
            <div className="mb-6 space-y-4">
              {/* Reference ID Filter */}
              <div>
                <label htmlFor="referenceId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <PackageOpen size={20} className="mr-2 text-blue-500" />
                  Search by Reference ID
                </label>
                <input
                  id="referenceId"
                  type="text"
                  placeholder="Enter Reference ID"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Date Filter */}
              <div>
                <label htmlFor="dateFilter" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <PackageOpen size={20} className="mr-2 text-blue-500" />
                  Search by Date
                </label>
                <input
                  id="dateFilter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={filterTransactions}
                  className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium flex items-center"
                >
                  <Search size={16} className="mr-2" />
                  Search
                </button>
                <button
                  onClick={() => {
                    setReferenceId("");
                    setSelectedDate("");
                    setFilteredTransactions(transactions);
                    setError(null);
                  }}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center my-6">
                <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {/* Error message */}
            {error && !loading && (
              <div className="p-4 my-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            {/* Transactions table */}
            {!loading && filteredTransactions.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  Recharge Transactions ({filteredTransactions.length})
                </h3>
                <Table className="w-full border-collapse">
                  <TableHeader className="bg-sky-500 text-white">
                    <TableRow>
                      <TableHead className="px-4 py-2 text-left">ID</TableHead>
                      <TableHead className="px-4 py-2 text-left">Operator</TableHead>
                      <TableHead className="px-4 py-2 text-left">CA Number</TableHead>
                      <TableHead className="px-4 py-2 text-left">Amount</TableHead>
                      <TableHead className="px-4 py-2 text-left">Reference ID</TableHead>
                      <TableHead className="px-4 py-2 text-left">Status</TableHead>
                      <TableHead className="px-4 py-2 text-left">Response Code</TableHead>
                      <TableHead className="px-4 py-2 text-left">Operator ID</TableHead>
                      <TableHead className="px-4 py-2 text-left">Ack No</TableHead>
                      <TableHead className="px-4 py-2 text-left">Message</TableHead>
                      <TableHead className="px-4 py-2 text-left">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <TableCell className="px-4 py-2">{transaction.id}</TableCell>
                        <TableCell className="px-4 py-2">{transaction.operator}</TableCell>
                        <TableCell className="px-4 py-2">{transaction.canumber}</TableCell>
                        <TableCell className="px-4 py-2">₹{parseFloat(transaction.amount).toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-2">{transaction.referenceid}</TableCell>
                        <TableCell className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-2">{transaction.response_code}</TableCell>
                        <TableCell className="px-4 py-2">{transaction.operatorid}</TableCell>
                        <TableCell className="px-4 py-2">{transaction.ackno}</TableCell>
                        <TableCell className="px-4 py-2">{transaction.message}</TableCell>
                        <TableCell className="px-4 py-2">{formatDate(transaction.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && filteredTransactions.length === 0 && !error && (
              <div className="text-center py-10 text-gray-500">
                <div className="flex justify-center mb-4">
                  <AlertCircle size={40} className="text-gray-400" />
                </div>
                <p>No transactions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Recharge2;