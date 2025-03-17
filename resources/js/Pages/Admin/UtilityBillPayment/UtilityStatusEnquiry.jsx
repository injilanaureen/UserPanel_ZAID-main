import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import { Search, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
            setError(err.response?.data?.message || "Error fetching status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-full p-4">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
                        <h2 className="text-3xl font-semibold text-white">Utility Status Enquiry</h2>
                    </div>

                    <div className="p-6">
                        {/* Input Field */}
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div>
                                <label htmlFor="referenceid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <Search size={20} className="mr-2 text-blue-500" />
                                    Reference ID
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        id="referenceid"
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                        placeholder="Enter Reference ID"
                                        value={referenceid}
                                        onChange={(e) => setReferenceid(e.target.value)}
                                    />
                                    <button
                                        onClick={fetchStatus}
                                        disabled={loading}
                                        className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Fetching...
                                            </span>
                                        ) : "Check Status"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-red-600 text-sm flex items-center">
                                    <AlertCircle size={16} className="mr-2" />
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* API Response Table */}
                        {response && (
                            <div className="mt-4">
                                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                                    <Code size={16} className="mr-2" />
                                    Transaction Details
                                </h3>
                                {response.status && response.data ? (
                                    <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                                        <Table className="w-full border-collapse">
                                            <TableHeader className="bg-sky-500 text-white">
                                                <TableRow>
                                                    <TableHead className="px-4 py-2 text-left">Field</TableHead>
                                                    <TableHead className="px-4 py-2 text-left">Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Transaction ID</TableCell><TableCell className="px-4 py-2">{response.data.txnid}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Operator Name</TableCell><TableCell className="px-4 py-2">{response.data.operatorname}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Customer Number</TableCell><TableCell className="px-4 py-2">{response.data.canumber}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Amount</TableCell><TableCell className="px-4 py-2">₹{response.data.amount}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Additional Data 1</TableCell><TableCell className="px-4 py-2">{response.data.ad1 || "N/A"}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Additional Data 2</TableCell><TableCell className="px-4 py-2">{response.data.ad2 || "N/A"}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Additional Data 3</TableCell><TableCell className="px-4 py-2">{response.data.ad3 || "N/A"}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Commission</TableCell><TableCell className="px-4 py-2">₹{response.data.comm}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">TDS</TableCell><TableCell className="px-4 py-2">₹{response.data.tds}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Transaction Status</TableCell><TableCell className="px-4 py-2">{response.data.status === "1" ? "Success" : "Failed"}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Reference ID</TableCell><TableCell className="px-4 py-2">{response.data.refid}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Operator ID</TableCell><TableCell className="px-4 py-2">{response.data.operatorid}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Date Added</TableCell><TableCell className="px-4 py-2">{response.data.dateadded}</TableCell></TableRow>
                                                <TableRow><TableCell className="px-4 py-2 font-medium">Refunded</TableCell><TableCell className="px-4 py-2">{response.data.refunded === "0" ? "No" : "Yes"}</TableCell></TableRow>
                                                {response.data.refunded !== "0" && (
                                                    <>
                                                        <TableRow><TableCell className="px-4 py-2 font-medium">Refund Transaction ID</TableCell><TableCell className="px-4 py-2">{response.data.refundtxnid || "N/A"}</TableCell></TableRow>
                                                        <TableRow><TableCell className="px-4 py-2 font-medium">Date Refunded</TableCell><TableCell className="px-4 py-2">{response.data.daterefunded || "N/A"}</TableCell></TableRow>
                                                    </>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                                        <p className="text-red-600 text-sm flex items-center">
                                            <AlertCircle size={16} className="mr-2" />
                                            {response.message || "No data found"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UtilityStatusEnquiry;