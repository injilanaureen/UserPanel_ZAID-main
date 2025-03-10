import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';

const FetchBillDetails = () => {
    const { billData, errors, savedRecord } = usePage().props;
    const [operators, setOperators] = useState([]);
    const [loadingOperators, setLoadingOperators] = useState(true);
    const [operatorError, setOperatorError] = useState(null);
    
    const [formData, setFormData] = useState({
        operator: '',
        canumber: '',
        mode: 'online'
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState(null);

    // Fetch operators when component mounts
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

    // Update selected operator details when operator changes
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        router.post('/admin/utility-bill-payment/fetch-bill-details', formData, {
            onFinish: () => setIsLoading(false)
        });
    };

    return (
        <AdminLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Fetch Bill Details</h1>
                
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="operator">
                                Operator
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
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="">Select an operator</option>
                                    {operators.map(operator => (
                                        <option key={operator.id} value={operator.id}>
                                            {operator.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors?.operator && (
                                <p className="text-red-500 text-xs italic">{errors.operator}</p>
                            )}
                        </div>

                        {selectedOperator && (
                            <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                                <h3 className="font-medium text-blue-700 mb-2">Operator Details</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="font-medium">Category:</span> {selectedOperator.category}</div>
                                    <div><span className="font-medium">Field Name:</span> {selectedOperator.displayname}</div>
                                    <div className="col-span-2"><span className="font-medium">Regex:</span> <span className="text-gray-600 text-xs">{selectedOperator.regex}</span></div>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="canumber">
                                {selectedOperator ? selectedOperator.displayname : 'CA Number'}
                            </label>
                            <input
                                type="text"
                                id="canumber"
                                name="canumber"
                                value={formData.canumber}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                                pattern={selectedOperator?.regex || null}
                                title={selectedOperator ? `Format must match: ${selectedOperator.regex}` : ''}
                            />
                            {selectedOperator && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Format should match: {selectedOperator.regex}
                                </p>
                            )}
                            {errors?.canumber && (
                                <p className="text-red-500 text-xs italic">{errors.canumber}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mode">
                                Mode
                            </label>
                            <select
                                id="mode"
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                            {errors?.mode && (
                                <p className="text-red-500 text-xs italic">{errors.mode}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !formData.operator || !formData.canumber}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${(isLoading || !formData.operator || !formData.canumber) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Fetching...' : 'Fetch Bill Details'}
                        </button>
                    </form>
                </div>

                {billData && (
                    <div className="bg-white shadow-md p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Bill Details:</h2>
                        <div className="flex justify-end mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${billData.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {billData.status ? 'Success' : 'Failed'}
                            </span>
                        </div>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Field</th>
                                    <th className="border border-gray-300 px-4 py-2">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Response Code</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.response_code}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Amount</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.amount}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Name</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.name}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Due Date</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.duedate}</td></tr>
                                {/* <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">AD2</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.ad2 || '-'}</td></tr> */}
                                {/* <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">AD3</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.ad3 || '-'}</td></tr> */}
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Message</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.message}</td></tr>
                            </tbody>
                        </table>
                        
                        {savedRecord && (
                            <div className="mt-4">
                                <p className="text-green-600 text-sm">✓ This record has been saved to the database.</p>
                            </div>
                        )}
                    </div>
                )}

                {errors?.api && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {errors.api}</span>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default FetchBillDetails;