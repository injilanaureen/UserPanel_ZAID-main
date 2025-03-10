import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const PayBill = () => {
  const [canumber, setCanumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const [operators, setOperators] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);

  // Fetch operators on component mount
  useEffect(() => {
    fetchOperators();
  }, []);

  const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.content : '';
  };

  const fetchOperators = async () => {
    setIsLoadingOperators(true);
    setError(null);

    try {
      const response = await axios.post('/admin/get-bill-operators', {}, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });

      if (response.data.success || response.data.status) {
        // Handle different response structures
        const operatorData = response.data.operators || response.data.data?.data || [];
        setOperators(Array.isArray(operatorData) ? operatorData : []);
      } else {
        console.error('Failed to fetch operators:', response.data);
        setError('Failed to load operators. Please try again later.');
      }
    } catch (err) {
      console.error('Fetch Operators Error:', err);
      setError('An error occurred while fetching operators. Please try again later.');
    } finally {
      setIsLoadingOperators(false);
    }
  };

  const handlePayment = async () => {
    if (!operator) {
      setError("Please select an operator");
      return;
    }

    if (!canumber.trim()) {
      setError("Please enter a consumer number");
      return;
    }

    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResponse(null);
      
      const res = await axios.post("/admin/utility-bill-payment/process-bill-payment", { 
        canumber: canumber.trim(),
        amount: parseFloat(amount.trim()),
        operator: operator
      });
      
      if (res.data.status === false) {
        throw new Error(res.data.message || "Payment failed");
      }
      
      setResponse(res.data);
    } catch (err) {
      console.error('Payment Error:', err);
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.message 
        || err.message 
        || "An unexpected error occurred during payment processing";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const ResponseTable = ({ data }) => (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-green-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-green-800">
          Payment Details
        </h3>
      </div>
      <div className="p-4">
        <table className="w-full text-sm text-left text-gray-700">
          <tbody>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50 w-1/3">
                Status
              </th>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${data.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {data.status ? 'Successful' : 'Failed'}
                </span>
              </td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                Amount
              </th>
              <td className="py-3 px-4">₹{parseFloat(amount).toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                Operator
              </th>
              <td className="py-3 px-4">
                {operators.find(op => op.id === operator)?.name || operator}
              </td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                Response Code
              </th>
              <td className="py-3 px-4">{data.response_code}</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                Operator ID
              </th>
              <td className="py-3 px-4">{data.operatorid}</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                Acknowledgement No
              </th>
              <td className="py-3 px-4">{data.ackno}</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                Reference ID
              </th>
              <td className="py-3 px-4">{data.refid}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50 align-top">
                Message
              </th>
              <td className="py-3 px-4">{data.message}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Pay Utility Bill
        </h2>

        <div className="space-y-6">
          <div className="relative">
            <label 
              htmlFor="operator" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator
            </label>
            {isLoadingOperators ? (
              <div className="flex items-center space-x-2 py-2">
                <svg 
                  className="animate-spin h-5 w-5 text-blue-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span className="text-sm text-gray-500">Loading operators...</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  id="operator"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200 placeholder-gray-400 appearance-none"
                  disabled={isLoading}
                >
                  <option value="">Select an operator</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name || op.displayname}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <label 
              htmlFor="canumber" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Consumer Number
            </label>
            <input
              id="canumber"
              type="text"
              value={canumber}
              onChange={(e) => setCanumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your consumer number"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label 
              htmlFor="amount" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                transition-all duration-200 placeholder-gray-400"
              placeholder="Enter payment amount"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading || !canumber.trim() || !amount.trim() || !operator || isNaN(amount) || parseFloat(amount) <= 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white
              ${isLoading || !canumber.trim() || !amount.trim() || !operator || isNaN(amount) || parseFloat(amount) <= 0
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'} 
              transition-colors duration-200 flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              'Pay Bill'
            )}
          </button>

          {response && <ResponseTable data={response} />}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="text-lg font-semibold text-red-800 mb-2">
                Error
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PayBill;