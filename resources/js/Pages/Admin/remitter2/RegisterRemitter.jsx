import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Phone, Send, Key, FileText, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RegisterRemitter = ({ recentRegistrations = [] }) => {
    const [formData, setFormData] = useState({
        mobile: "",
        otp: "",
        stateresp: "",
        data: "",
        accessmode: "SITE", 
        is_iris: 2,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("form"); 

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null);
        setSuccess("");
    };
    
    const handleSendOtp = async () => {
        if (formData.mobile.length !== 10) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }
    
        setSendingOtp(true);
        setError(null);
        
        try {
            const response = await fetch("YOUR_OTP_API_ENDPOINT", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify({ mobile: formData.mobile }),
            });
    
            const data = await response.json();
            setSuccess(data.message || "OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            setError("Failed to send OTP. Please try again.");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess("");
        setApiData(null);

        try {
            const response = await fetch(
                "/api/admin/remitter2/register-remitter",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content"),
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (response.ok) {
                setApiData(result.data);
                setSuccess("Remitter registered successfully!");
                // Optional: Reset form or keep as is
            } else {
                setError(result.error || "Failed to register remitter");
            }
        } catch (err) {
            setError(
                "Failed to communicate with the server. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-full">
                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="flex space-x-4 border-b">
                        <button
                            onClick={() => setActiveTab("form")}
                            className={`py-2 px-4 font-medium ${
                                activeTab === "form"
                                    ? "border-b-2 border-gray-800 text-gray-800"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Registration Form
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`py-2 px-4 font-medium ${
                                activeTab === "history"
                                    ? "border-b-2 border-gray-800 text-gray-800"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Registration History
                        </button>
                    </div>
                </div>

                {activeTab === "form" ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
                            <h2 className="text-3xl font-semibold text-white">Register Remitter</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                                    <p className="text-red-600 text-sm flex items-center">
                                        <AlertCircle size={16} className="mr-2" />
                                        {error}
                                    </p>
                                </div>
                            )}
                            
                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                                    <p className="text-green-600 text-sm flex items-center">
                                        <CheckCircle size={16} className="mr-2" />
                                        {success}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="mobile"
                                        className="flex items-center text-sm font-medium text-gray-600 mb-1"
                                    >
                                        <Phone size={20} className="mr-2 text-blue-500" />
                                        Mobile Number
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="mobile"
                                            name="mobile"
                                            pattern="[0-9]{10}"
                                            maxLength="10"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                            required
                                            placeholder="Enter 10 digit mobile number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="otp"
                                        className="flex items-center text-sm font-medium text-gray-600 mb-1"
                                    >
                                        <Key size={20} className="mr-2 text-yellow-500" />
                                        OTP
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        pattern="[0-9]{6}"
                                        maxLength="6"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                        required
                                        placeholder="Enter 6 digit OTP recieved while verifying Aadhar"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="stateresp"
                                        className="flex items-center text-sm font-medium text-gray-600 mb-1"
                                    >
                                        <FileText size={20} className="mr-2 text-green-500" />
                                        State Response
                                    </label>
                                    <input
                                        type="text"
                                        id="stateresp"
                                        name="stateresp"
                                        value={formData.stateresp}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                        required
                                        placeholder="Enter state response"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="data"
                                        className="flex items-center text-sm font-medium text-gray-600 mb-1"
                                    >
                                        <FileText size={20} className="mr-2 text-purple-500" />
                                        Data(Pid)
                                    </label>
                                    <input
                                        type="text"
                                        id="data"
                                        name="data"
                                        value={formData.data}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                        required
                                        placeholder="Enter data"
                                    />
                                </div>

                                {/* Access Mode field removed */}

                                <div>
                                    <label
                                        htmlFor="is_iris"
                                        className="flex items-center text-sm font-medium text-gray-600 mb-1"
                                    >
                                        <FileText size={20} className="mr-2 text-orange-500" />
                                        Is Iris
                                    </label>
                                    <select
                                        id="is_iris"
                                        name="is_iris"
                                        value={formData.is_iris}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                    >
                                        <option value={2}>No</option>
                                        <option value={1}>Yes</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : "Register Remitter"}
                            </button>
                        </form>

                        {apiData && (
                            <div className="px-6 pb-6">
                                <div className="mt-4">
                                    <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                                        <Code size={16} className="mr-2" />
                                        API Response:
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
                                                {Object.entries(apiData).map(([key, value]) => (
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
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
                            <h2 className="text-3xl font-semibold text-white">Registration History</h2>
                        </div>
                        
                        <div className="p-6 overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Date
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Mobile
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Message
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Access Mode
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Limit
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {recentRegistrations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                No registration data available
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentRegistrations.map((registration, index) => (
                                            <TableRow
                                                key={registration.id || index}
                                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                            >
                                                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(registration.created_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {registration.mobile}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            registration.status === "success"
                                                                ? "bg-green-100 text-green-800"
                                                                : registration.status === "error"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {registration.status || "Pending"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-sm text-gray-500">
                                                    {registration.message}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {registration.accessmode}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {registration.limit
                                                        ? `₹${registration.limit.toLocaleString()}`
                                                        : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default RegisterRemitter;