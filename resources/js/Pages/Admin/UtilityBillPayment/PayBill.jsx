import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import { Signal, Phone, AlertCircle, CheckCircle, Code } from 'lucide-react';

const PayBill = () => {
  const [canumber, setCanumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operators, setOperators] = useState([]);
  const [loadingOperators, setLoadingOperators] = useState(true);
  const [operatorError, setOperatorError] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  
  const [formData, setFormData] = useState({
    operator: '',
    canumber: '',
    amount: ''
  });

  // Fetch operators on component mount - using the same approach as FetchBillDetails.jsx
  useEffect(() => {
    setLoadingOperators(true);
    axios.get("/api/operators")
      .then(response => {
        if (response.data.success) {
          setOperators(response.data.operators);
        } else {
          setOperatorError(response.data.message);
        }
      })
      .catch(err => setOperatorError("Failed to fetch operators"))
      .finally(() => setLoadingOperators(false));
  }, []);

  // Update selected operator when operator changes
  useEffect(() => {
    if (formData.operator) {
      const selected = operators.find(op => op.id === formData.operator);
      setSelectedOperator(selected || null);
    } else {
      setSelectedOperator(null);
    }
  }, [formData.operator, operators]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!formData.operator) {
      setError("Please select an operator");
      return;
    }

    if (!formData.canumber.trim()) {
      setError("Please enter a consumer number");
      return;
    }

    if (!formData.amount.trim() || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResponse(null);
      
      const res = await axios.post("/admin/utility-bill-payment/process-bill-payment", { 
        canumber: formData.canumber.trim(),
        amount: parseFloat(formData.amount.trim()),
        operator: formData.operator
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
              <td className="py-3 px-4">₹{parseFloat(formData.amount).toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                Operator
              </th>
              <td className="py-3 px-4">
                {operators.find(op => op.id === formData.operator)?.name || formData.operator}
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
      <div className="max-w-full p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Pay Utility Bill</h2>
          </div>

          <form onSubmit={handlePayment} className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="operator" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Signal size={20} className="mr-2 text-green-500" />
                  Operator :
                </label>
                {loadingOperators ? (
                  <div className="text-gray-500">Loading operators...</div>
                ) : operatorError ? (
                  <div className="text-red-500">{operatorError}</div>
                ) : (
                  <select
                    id="operator"
                    name="operator"
                    value={formData.operator}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Operator</option>
                    {operators.map(operator => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedOperator && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <h3 className="font-medium text-blue-700 mb-2 flex items-center">
                    <Code size={16} className="mr-2" />
                    Operator Details
                  </h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div><span className="font-medium">Category:</span> {selectedOperator.category}</div>
                    <div><span className="font-medium">Field Name:</span> {selectedOperator.displayname}</div>
                    <div><span className="font-medium">Regex:</span> <span className="text-gray-600 text-xs">{selectedOperator.regex}</span></div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="canumber" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  {selectedOperator ? selectedOperator.displayname : 'Consumer Number'}
                </label>
                <input
                  id="canumber"
                  name="canumber"
                  value={formData.canumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  pattern={selectedOperator?.regex}
                  title={selectedOperator ? `Format must match: ${selectedOperator.regex}` : ''}
                  placeholder={`Enter ${selectedOperator ? selectedOperator.displayname : 'Consumer Number'}`}
                />
                {selectedOperator && (
                  <p className="text-xs text-gray-500 mt-1">
                    Format: {selectedOperator.regex}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="amount" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Signal size={20} className="mr-2 text-blue-500" />
                  Amount (₹)
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter payment amount"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.operator || !formData.canumber || !formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Pay Bill"}
            </button>
          </form>

          <div className="px-6 pb-6">
            {response && <ResponseTable data={response} />}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex items-center">
                  <AlertCircle size={20} className="mr-2 text-red-500" />
                  <div className="text-lg font-semibold text-red-800">
                    Error
                  </div>
                </div>
                <p className="text-sm text-red-700 mt-2">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PayBill;