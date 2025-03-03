import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const RefundOtp = ({ apiResponse }) => {
    const [referenceid, setReferenceid] = useState('');
    const [ackno, setAckno] = useState('');
    const [response, setResponse] = useState(apiResponse || null);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/admin/refund2/refundOtp', { referenceid, ackno }, {
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.apiResponse) {
                    setResponse(page.props.apiResponse);
                }
            },
            onError: (errors) => {
                alert('Error: ' + JSON.stringify(errors));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Resend Refund OTP</h2>
                <p className="mt-4 text-blue-500 font-semibold">Note: Please use "referenceid": "11005537190", "ackno": "1739577510" as suggested by Paysprint in UAT as of now .</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>Reference ID:</label>
                        <input
                            type="text"
                            value={referenceid}
                            onChange={(e) => setReferenceid(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label>Acknowledgement No:</label>
                        <input
                            type="text"
                            value={ackno}
                            onChange={(e) => setAckno(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Send OTP
                    </button>
                </form>

                {response && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">API Response:</h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2">Key</th>
                                    <th className="border border-gray-300 p-2">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(response).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="border border-gray-300 p-2 font-medium">{key}</td>
                                        <td className="border border-gray-300 p-2">{String(value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
               
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default RefundOtp;