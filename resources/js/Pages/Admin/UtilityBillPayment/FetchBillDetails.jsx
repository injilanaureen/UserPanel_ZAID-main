import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

const FetchBillDetails = () => {
    const { billData, errors } = usePage().props;
    const [formData, setFormData] = useState({
        operator: '',
        canumber: '',
        mode: 'online'
    });
    const [isLoading, setIsLoading] = useState(false);

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
                            <input
                                type="number"
                                id="operator"
                                name="operator"
                                value={formData.operator}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            {errors?.operator && (
                                <p className="text-red-500 text-xs italic">{errors.operator}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="canumber">
                                CA Number
                            </label>
                            <input
                                type="number"
                                id="canumber"
                                name="canumber"
                                value={formData.canumber}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
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
                            disabled={isLoading}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Fetching...' : 'Fetch Bill Details'}
                        </button>
                    </form>
                </div>

                {billData && (
                    <div className="bg-white shadow-md p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Bill Details:</h2>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Field</th>
                                    <th className="border border-gray-300 px-4 py-2">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Response Code</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.response_code}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Status</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.status ? 'Success' : 'Failed'}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Amount</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.amount}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Name</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.name}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Due Date</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.duedate}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">AD2</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.ad2}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">AD3</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.ad3}</td></tr>
                                <tr><td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">Message</td><td className="border border-gray-300 px-4 py-2 text-gray-600">{billData.message}</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default FetchBillDetails;
