import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

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
    const [apiData, setApiData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("form"); // 'form' or 'history'

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSendOtp = async () => {
        if (formData.mobile.length !== 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }
    
        try {
            const response = await fetch("YOUR_OTP_API_ENDPOINT", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile: formData.mobile }),
            });
    
            const data = await response.json();
            alert(data.message || "OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Failed to send OTP. Try again.");
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                setError(null);
                window.location.reload(); // Refresh to show updated data
            } else {
                setError(result.error || "Failed to register remitter");
                setApiData(null);
            }
        } catch (err) {
            setError(
                "Failed to communicate with the server. Please try again."
            );
            setApiData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Remitter Registration
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Register new remitters and view registration history
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab("form")}
                                className={`${
                                    activeTab === "form"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Registration Form
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`${
                                    activeTab === "history"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Registration History
                            </button>
                        </nav>
                    </div>

                    {activeTab === "form" ? (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">
                                    New Registration
                                </h2>
                            </div>

                            <div className="p-6">
                                {error && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="mobile"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Mobile Number
                                            </label>
                                            <input
                                                type="text"
                                                id="mobile"
                                                name="mobile"
                                                pattern="[0-9]{10}"
                                                maxLength="10"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                                placeholder="Enter 10 digit mobile number"
                                            />
                                        </div>
                                     

                                        <div>
                                            <label
                                                htmlFor="otp"
                                                className="block text-sm font-medium text-gray-700"
                                            >
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
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                                placeholder="Enter 6 digit OTP"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="stateresp"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                State Response
                                            </label>
                                            <input
                                                type="text"
                                                id="stateresp"
                                                name="stateresp"
                                                value={formData.stateresp}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="data"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Data
                                            </label>
                                            <input
                                                type="text"
                                                id="data"
                                                name="data"
                                                value={formData.data}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="accessmode"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Access Mode
                                            </label>
                                            <select
                                                id="accessmode"
                                                name="accessmode"
                                                value={formData.accessmode}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="SITE">
                                                    SITE
                                                </option>
                                                <option value="APP">APP</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="is_iris"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Is Iris
                                            </label>
                                            <select
                                                id="is_iris"
                                                name="is_iris"
                                                value={formData.is_iris}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value={2}>No</option>
                                                <option value={1}>Yes</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center">
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Register Remitter"
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {apiData && (
                                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold mb-2">
                                            API Response
                                        </h3>
                                        <pre className="bg-white p-4 rounded overflow-x-auto">
                                            {JSON.stringify(apiData, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Registration History
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Mobile
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Message
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Access Mode
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Limit
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentRegistrations.map(
                                            (registration, index) => (
                                                <tr
                                                    key={
                                                        registration.id || index
                                                    }
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-white"
                                                            : "bg-gray-50"
                                                    }
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(
                                                            registration.created_at
                                                        ).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {registration.mobile}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                registration.status ===
                                                                "success"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : registration.status ===
                                                                      "error"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {registration.status ||
                                                                "Pending"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {registration.message}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {
                                                            registration.accessmode
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {registration.limit
                                                            ? `₹${registration.limit.toLocaleString()}`
                                                            : "N/A"}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default RegisterRemitter;
