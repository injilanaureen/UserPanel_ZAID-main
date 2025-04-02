import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Signal, Phone, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

    const handlePayBill = () => {
        // Navigate to PayBill route with bill data
        router.visit('/admin/utility-bill-payment/pay-bill', {
            method: 'get',
            data: {
                operator: formData.operator,
                canumber: formData.canumber,
                amount: billData.amount
            }
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-full p-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
                        <h2 className="text-3xl font-semibold text-white">Fetch Bill Details</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
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
                                    {selectedOperator ? selectedOperator.displayname : 'CA Number'}
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
                                    placeholder={`Enter ${selectedOperator ? selectedOperator.displayname : 'CA Number'}`}
                                />
                                {selectedOperator && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Format: {selectedOperator.regex}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="mode" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <Signal size={20} className="mr-2 text-blue-500" />
                                    Mode
                                </label>
                                <select
                                    id="mode"
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !formData.operator || !formData.canumber}
                            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Fetching...
                                </span>
                            ) : "Fetch Bill Details"}
                        </button>
                    </form>

                    <div className="px-6 pb-6">
                        {billData && (
                            <div className="mt-6">
                                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                                    <Code size={16} className="mr-2" />
                                    Bill Details
                                </h3>
                                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                                    <Table className="w-full border-collapse">
                                        <TableHeader className="bg-sky-500 text-white">
                                            <TableRow>
                                                <TableHead className="px-4 py-2 text-left">Field</TableHead>
                                                <TableHead className="px-4 py-2 text-left">Value</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="px-4 py-2 font-medium">Status</TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${billData.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {billData.status ? 'Success' : 'Failed'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="px-4 py-2 font-medium">Response Code</TableCell>
                                                <TableCell className="px-4 py-2">{billData.response_code}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="px-4 py-2 font-medium">Amount</TableCell>
                                                <TableCell className="px-4 py-2">{billData.amount}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="px-4 py-2 font-medium">Name</TableCell>
                                                <TableCell className="px-4 py-2">{billData.name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="px-4 py-2 font-medium">Due Date</TableCell>
                                                <TableCell className="px-4 py-2">{billData.duedate}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="px-4 py-2 font-medium">Message</TableCell>
                                                <TableCell className="px-4 py-2">{billData.message}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                {billData.status && (
                                    <button
                                        onClick={handlePayBill}
                                        className="mt-4 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                                    >
                                        Proceed to Pay Bill
                                    </button>
                                )}
                                {savedRecord && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                                        <p className="text-green-600 text-sm flex items-center">
                                            <CheckCircle size={16} className="mr-2" />
                                            This record has been saved to the database.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {errors?.api && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-red-600 text-sm flex items-center">
                                    <AlertCircle size={16} className="mr-2" />
                                    {errors.api}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default FetchBillDetails;