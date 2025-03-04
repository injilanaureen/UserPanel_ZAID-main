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
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Manage Recharge Operators</h1>
                            
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                            
                            <div className="mb-6 flex flex-col md:flex-row gap-4">
                                <div className="md:w-1/2">
                                    <input
                                        type="text"
                                        placeholder="Search operators..."
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <button
                                        onClick={fetchOperators}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>
                            
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Operator Name
                                                </th>
                                                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Category
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredOperators.length > 0 ? (
                                                filteredOperators.map((operator, index) => (
                                                    <tr key={operator.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {operator.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {operator.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {operator.category}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
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