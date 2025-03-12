import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from 'axios';

const OperatorList = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { props } = usePage();

  const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.content : '';
  };

  const fetchOperators = async () => {
    setLoading(true);
    setError(null);

    try {
      // Changed this endpoint to match the route in web.php
      const response = await axios.get('/api/operators', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });

      console.log('Full API Response:', response);
      console.log('Response Data:', response.data);

      if (response.data.success) {
        // Updated to match the expected response structure from the controller
        const operatorData = response.data.operators || [];
        console.log('Operator Data to be set:', operatorData);
        setOperators(Array.isArray(operatorData) ? operatorData : []);
      } else {
        setError(response.data.message || 'Failed to fetch operators');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching operators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Operator List</h1>

        {loading && (
          <div className="text-center">Loading operators...</div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && operators.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Available Operators</h2>
            <div className="grid gap-4">
              {operators.map((operator, index) => (
                <div 
                  key={operator.id || index}
                  className="border p-3 rounded hover:bg-gray-50"
                >
                  <p><strong>ID:</strong> {operator.id || 'N/A'}</p>
                  <p><strong>Name:</strong> {operator.name || 'N/A'}</p>
                  <p><strong>Category:</strong> {operator.category || 'N/A'}</p>
                  <p><strong>View Bill:</strong> {operator.viewbill === "1" ? 'Yes' : 'No'}</p>
                  <p><strong>Regex:</strong> {operator.regex || 'N/A'}</p>
                  <p><strong>Display Name:</strong> {operator.displayname || 'N/A'}</p>
                  <p><strong>AD1 Display Name:</strong> {operator.ad1_d_name || 'N/A'}</p>
                  <p><strong>AD1 Name:</strong> {operator.ad1_name || 'N/A'}</p>
                  <p><strong>AD1 Regex:</strong> {operator.ad1_regex || 'N/A'}</p>
                  <p><strong>AD2 Display Name:</strong> {operator.ad2_d_name || 'N/A'}</p>
                  <p><strong>AD2 Name:</strong> {operator.ad2_name || 'N/A'}</p>
                  <p><strong>AD2 Regex:</strong> {operator.ad2_regex || 'N/A'}</p>
                  <p><strong>AD3 Display Name:</strong> {operator.ad3_d_name || 'N/A'}</p>
                  <p><strong>AD3 Name:</strong> {operator.ad3_name || 'N/A'}</p>
                  <p><strong>AD3 Regex:</strong> {operator.ad3_regex || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && operators.length === 0 && (
          <div className="text-center text-gray-500">
            No operators found
          </div>
        )}

        <button
          onClick={fetchOperators}
          disabled={loading}
          className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Refreshing...' : 'Refresh Operators'}
        </button>
      </div>
    </AdminLayout>
  );
};

export default OperatorList;