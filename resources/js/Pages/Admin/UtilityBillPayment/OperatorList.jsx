import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const OperatorList = ({ operators, error, success }) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    // Get the current page from the paginated data
    const currentPage = operators?.current_page || 1;
    
    if (error) {
        return (
            <AdminLayout>
                <div className="p-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!operators || !operators.data || operators.data.length === 0) {
        return (
            <AdminLayout>
                <div className="p-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">Operator List</h1>
                    <p>No operators found.</p>
                </div>
            </AdminLayout>
        );
    }

    // Filter the data based on search term
    const filteredOperators = operators.data.filter(operator =>
        operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (operator.displayname && operator.displayname.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Operator List</h1>

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by Name, Category, or Display Name..."
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border-b text-left">ID</th>
                                <th className="px-4 py-2 border-b text-left">Operator Name</th>
                                <th className="px-4 py-2 border-b text-left">Category</th>
                                <th className="px-4 py-2 border-b text-left">View Bill</th>
                                <th className="px-4 py-2 border-b text-left">Display Name</th>
                                <th className="px-4 py-2 border-b text-left">Regex</th>
                                <th className="px-4 py-2 border-b text-left">Ad1 Display Name</th>
                                <th className="px-4 py-2 border-b text-left">Ad1 Name</th>
                                <th className="px-4 py-2 border-b text-left">Ad1 Regex</th>
                                <th className="px-4 py-2 border-b text-left">Ad2 Display Name</th>
                                <th className="px-4 py-2 border-b text-left">Ad2 Name</th>
                                <th className="px-4 py-2 border-b text-left">Ad2 Regex</th>
                                <th className="px-4 py-2 border-b text-left">Ad3 Display Name</th>
                                <th className="px-4 py-2 border-b text-left">Ad3 Name</th>
                                <th className="px-4 py-2 border-b text-left">Ad3 Regex</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOperators.length > 0 ? (
                                filteredOperators.map((operator) => (
                                    <tr key={operator.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{operator.id}</td>
                                        <td className="px-4 py-2 border-b">{operator.name}</td>
                                        <td className="px-4 py-2 border-b">{operator.category}</td>
                                        <td className="px-4 py-2 border-b">{operator.viewbill ? "Yes" : "No"}</td>
                                        <td className="px-4 py-2 border-b">{operator.displayname || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.regex || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad1_d_name || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad1_name || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad1_regex || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad2_d_name || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad2_name || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad2_regex || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad3_d_name || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad3_name || "N/A"}</td>
                                        <td className="px-4 py-2 border-b">{operator.ad3_regex || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="15" className="text-center py-4">
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {operators.last_page > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <a
                            href={operators.prev_page_url}
                            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded ${!operators.prev_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!operators.prev_page_url}
                        >
                            Previous
                        </a>

                        <span className="text-lg">
                            Page {operators.current_page} of {operators.last_page}
                        </span>

                        <a
                            href={operators.next_page_url}
                            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded ${!operators.next_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!operators.next_page_url}
                        >
                            Next
                        </a>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default OperatorList;