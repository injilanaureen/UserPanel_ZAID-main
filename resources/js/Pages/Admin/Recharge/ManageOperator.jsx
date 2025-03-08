import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ManageOperator() {
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchOperators();
    }, []);

    const fetchOperators = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/recharge/get-operators');
            
            if (response.data.status === true) {
                setOperators(response.data.data);
                
                // Extract unique categories for filter dropdown
                const uniqueCategories = [...new Set(response.data.data.map(op => op.category))];
                setCategories(uniqueCategories);
            } else {
                setError('Failed to fetch operators: ' + response.data.message);
            }
        } catch (err) {
            setError('Error fetching operators: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const filteredOperators = operators.filter(op => {
        const matchesName = op.name.toLowerCase().includes(filter.toLowerCase());
        const matchesCategory = categoryFilter === '' || op.category === categoryFilter;
        return matchesName && matchesCategory;
    });

    return (
        <AdminLayout>
            <Head title="Manage Recharge Operators" />
            
            <div className=" bg-grey-200">
  <div className="max-w-full ">
    <div className="bg-gray-200 overflow-hidden shadow-lg sm:rounded-lg">
      <div className="p-6 text-white">
      <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
          <h2 className="text-3xl font-semibold text-white">Manage Recharge Operator</h2>
        </div>

        {error && (
          <div className="bg-red-600 border border-red-700 text-white px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mt-6 mb-6 flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            <input
              type="text"
              placeholder="Search operators..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-300 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="md:w-1/2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-300 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={fetchOperators}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-700 rounded-md">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-400 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-400 uppercase">
                    Operator Name
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-400 uppercase">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOperators.length > 0 ? (
                  filteredOperators.map((operator, index) => (
                    <tr key={operator.id} className="hover:bg-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black ">{operator.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{operator.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{operator.category}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-400">
                      No operators found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

        </AdminLayout>
    );
}