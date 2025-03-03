import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const UtilityStatusEnquiry = () => {
    const [referenceid, setReferenceid] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStatus = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);
    
        try {
            const res = await axios.post("/admin/utility-bill-payment/fetch-utility-status", { referenceid });
            setResponse(res.data);
        } catch (err) {
            setError("Error fetching status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Utility Status Enquiry</h1>
                
                {/* Input Field */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="border p-2 rounded w-full"
                        placeholder="Enter Reference ID"
                        value={referenceid}
                        onChange={(e) => setReferenceid(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                        onClick={fetchStatus}
                        disabled={loading}
                    >
                        {loading ? "Fetching..." : "Check Status"}
                    </button>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 mt-2">{error}</p>}

                {/* API Response Table */}
                {response && response.status && response.data && (
                    <div className="mt-4 border p-4 rounded bg-gray-100">
                        <h2 className="text-lg font-bold mb-2">Transaction Details</h2>
                        <table className="w-full border-collapse border border-gray-300">
                            <tbody>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2 text-left">Field</th>
                                    <th className="border border-gray-300 p-2 text-left">Value</th>
                                </tr>
                                <tr><td className="border p-2">Transaction ID</td><td className="border p-2">{response.data.txnid}</td></tr>
                                <tr><td className="border p-2">Operator Name</td><td className="border p-2">{response.data.operatorname}</td></tr>
                                <tr><td className="border p-2">Customer Number</td><td className="border p-2">{response.data.canumber}</td></tr>
                                <tr><td className="border p-2">Amount</td><td className="border p-2">₹{response.data.amount}</td></tr>
                                <tr><td className="border p-2">Additional Data 1</td><td className="border p-2">{response.data.ad1 || "N/A"}</td></tr>
                                <tr><td className="border p-2">Additional Data 2</td><td className="border p-2">{response.data.ad2 || "N/A"}</td></tr>
                                <tr><td className="border p-2">Additional Data 3</td><td className="border p-2">{response.data.ad3 || "N/A"}</td></tr>
                                <tr><td className="border p-2">Commission</td><td className="border p-2">₹{response.data.comm}</td></tr>
                                <tr><td className="border p-2">TDS</td><td className="border p-2">₹{response.data.tds}</td></tr>
                                <tr><td className="border p-2">Transaction Status</td><td className="border p-2">{response.data.status === "1" ? "Success" : "Failed"}</td></tr>
                                <tr><td className="border p-2">Reference ID</td><td className="border p-2">{response.data.refid}</td></tr>
                                <tr><td className="border p-2">Operator ID</td><td className="border p-2">{response.data.operatorid}</td></tr>
                                <tr><td className="border p-2">Date Added</td><td className="border p-2">{response.data.dateadded}</td></tr>
                                <tr><td className="border p-2">Refunded</td><td className="border p-2">{response.data.refunded === "0" ? "No" : "Yes"}</td></tr>

                                {/* Show refund details only if refunded */}
                                {response.data.refunded !== "0" && (
                                    <>
                                        <tr><td className="border p-2">Refund Transaction ID</td><td className="border p-2">{response.data.refundtxnid || "N/A"}</td></tr>
                                        <tr><td className="border p-2">Date Refunded</td><td className="border p-2">{response.data.daterefunded || "N/A"}</td></tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* No Data Message */}
                {response && !response.status && (
                    <p className="text-red-500 mt-4">{response.message || "No data found"}</p>
                )}
            </div>
        </AdminLayout>
    );
};

export default UtilityStatusEnquiry;
