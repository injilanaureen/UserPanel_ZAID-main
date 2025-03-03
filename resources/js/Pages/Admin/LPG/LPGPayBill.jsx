import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const LPGPayBill = () => {
  const [formData, setFormData] = useState({
    canumber: "",
    referenceid: "",
    amount: "",
    operator: "",
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Operator ID options
  const operators = [
    { id: 17, name: "Mahanagar Gas Limited" },
    { id: 34, name: "Indraprastha Gas" },
    { id: 35, name: "Gujarat Gas Company Limited" },
    { id: 49, name: "Adani Gas" },
    { id: 68, name: "Siti Energy" },
    { id: 80, name: "Haryana City Gas" },
    { id: 84, name: "Sabarmati Gas Limited (SGL)" },
    { id: 86, name: "Tripura Natural Gas" },
    { id: 100, name: "Unique Central Piped Gases Pvt Ltd (UCPGPL)" },
    { id: 101, name: "Vadodara Gas Limited" },
    { id: 107, name: "Maharashtra Natural Gas Limited" },
    { id: 113, name: "Charotar Gas Sahakari Mandali Ltd" },
    { id: 122, name: "Aavantika Gas Ltd" },
    { id: 124, name: "Central U.P. Gas Limited" },
    { id: 129, name: "Indian Oil-Adani Gas Private Limited" },
    { id: 139, name: "Gail Gas Limited" },
    { id: 141, name: "IRM Energy Private Limited" },
    { id: 156, name: "Green Gas Limited (GGL)" },
    { id: 172, name: "Assam Gas Company Limited" },
    { id: 177, name: "Bhagyanagar Gas Limited" },
    { id: 194, name: "Sanwariya Gas Limited" },
    { id: 282, name: "Megha Gas" },
    { id: 283, name: "Torrent Gas Moradabad Limited (Formerly Siti Energy Limited)" },
    { id: 286, name: "Indane Gas" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null);

    try {
      const response = await axios.post("/pay-lpg-bill", formData);
      setApiResponse(response.data);
      // Refresh transaction history if it's visible
      if (showHistory) {
        fetchTransactions();
      }
    } catch (error) {
      console.error("API Error:", error);
      setApiResponse({ error: "Failed to fetch API response" });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get('/lpg-bill-history');
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      fetchTransactions();
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">LPG Bill Payment</h1>
        <button
          onClick={toggleHistory}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          {showHistory ? "Hide History" : "View History"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="canumber"
          placeholder="Enter CA Number"
          value={formData.canumber}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="referenceid"
          placeholder="Enter Reference ID"
          value={formData.referenceid}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="amount"
          placeholder="Enter Amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

        <select
          name="operator"
          value={formData.operator}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        >
          <option value="">Select Operator</option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Bill"}
        </button>
      </form>

      {/* Display API Response */}
      {apiResponse && (
        <div className="mt-6 border border-gray-300 p-3">
          <h2 className="text-lg font-semibold mb-2">API Response:</h2>

          {apiResponse.error ? (
            <p className="text-red-500">{apiResponse.error}</p>
          ) : (
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">Status</th>
                  <th className="border border-gray-400 px-4 py-2">Response Code</th>
                  <th className="border border-gray-400 px-4 py-2">Operator ID</th>
                  <th className="border border-gray-400 px-4 py-2">Ack No</th>
                  <th className="border border-gray-400 px-4 py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">
                    {apiResponse.status ? "Success" : "Failed"}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {apiResponse.response_code}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {apiResponse.operatorid}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {apiResponse.ackno}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {apiResponse.message}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Transaction History Section */}
      {showHistory && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
          {historyLoading ? (
            <div className="text-center p-4">Loading history...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Date</th>
                    <th className="p-3 text-left border">CA Number</th>
                    <th className="p-3 text-left border">Reference ID</th>
                    <th className="p-3 text-left border">Amount</th>
                    <th className="p-3 text-left border">Operator</th>
                    <th className="p-3 text-left border">Status</th>
                    <th className="p-3 text-left border">Ack No</th>
                    <th className="p-3 text-left border">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="p-3 border">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 border">{transaction.canumber}</td>
                      <td className="p-3 border">{transaction.referenceid}</td>
                      <td className="p-3 border">₹{transaction.amount}</td>
                      <td className="p-3 border">{transaction.operator}</td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            transaction.status === "Success"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="p-3 border">{transaction.ackno}</td>
                      <td className="p-3 border">{transaction.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default LPGPayBill;