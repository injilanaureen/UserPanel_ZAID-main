import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Code, Key, Hash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RefundOtp = ({ apiResponse }) => {
    const [referenceid, setReferenceid] = useState('');
    const [ackno, setAckno] = useState('');
    const [response, setResponse] = useState(apiResponse || null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post('/admin/refund2/refundOtp', { referenceid, ackno }, {
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.apiResponse) {
                    console.log('API Response:', page.props.apiResponse);
                    setResponse(page.props.apiResponse);
                    setReferenceid('');
                    setAckno('');
                }
                setLoading(false);
            },
            onError: (errors) => {
                alert('Error: ' + JSON.stringify(errors));
                setLoading(false);
            },
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-full">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
                        <h2 className="text-3xl font-semibold text-white">Resend Refund OTP</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="referenceid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <Key size={20} className="mr-2 text-blue-500" />
                                    Reference ID
                                </label>
                                <input
                                    id="referenceid"
                                    type="text"
                                    value={referenceid}
                                    onChange={(e) => setReferenceid(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                    required
                                    placeholder="Enter Reference ID"
                                />
                            </div>

                            <div>
                                <label htmlFor="ackno" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <Hash size={20} className="mr-2 text-yellow-500" />
                                    Acknowledgement No
                                </label>
                                <input
                                    id="ackno"
                                    type="text"
                                    value={ackno}
                                    onChange={(e) => setAckno(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                    required
                                    placeholder="Enter Acknowledgement No"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : "Send OTP"}
                        </button>
                    </form>

                    {response && (
                        <div className="px-6 pb-6">
                            <div className="mt-4">
                                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                                    <Code size={16} className="mr-2" />
                                    API Response :
                                </h3>
                                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                                    <Table className="w-full border-collapse">
                                        <TableHeader className="bg-sky-500 text-white">
                                            <TableRow>
                                                <TableHead className="px-4 py-2 text-left">Key</TableHead>
                                                <TableHead className="px-4 py-2 text-left">Value</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(response).map(([key, value]) => (
                                                <TableRow key={key} className="border-b border-gray-200">
                                                    <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                                                    <TableCell className="px-4 py-2">{String(value)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default RefundOtp;