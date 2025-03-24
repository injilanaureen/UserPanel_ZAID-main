import AdminLayout from "../Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function AddAccount({ initialAccounts = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        bank: "",
        account_name: "",
        account_number: "",
        confirm_account_number: "",
        ifsc_code: "",
        status: 0,
    });
    
    const [accounts, setAccounts] = useState(initialAccounts);
    const [activeTab, setActiveTab] = useState("add");

    useEffect(() => {
        setAccounts(initialAccounts);
    }, [initialAccounts]);

    const submit = (e) => {
        e.preventDefault();
        post("/add-account", {
            onSuccess: () => {
                setData({
                    bank: "",
                    account_name: "",
                    account_number: "",
                    confirm_account_number: "",
                    ifsc_code: "",
                    status: 0,
                });
                setActiveTab("list");
            }
        });
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div className="text-gray-500">Account Management</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex border-b mb-6">
                    <button
                        className={`px-4 py-2 -mb-px ${
                            activeTab === "add" 
                                ? "border-b-2 border-green-500 text-green-500" 
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("add")}
                    >
                        Add Account
                    </button>
                    <button
                        className={`px-4 py-2 -mb-px ${
                            activeTab === "list" 
                                ? "border-b-2 border-green-500 text-green-500" 
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("list")}
                    >
                        Account List
                    </button>
                </div>

                {activeTab === "add" && (
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-500 mb-2">Bank Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Bank Name"
                                    value={data.bank}
                                    onChange={(e) => setData("bank", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded"
                                    required
                                />
                                {errors.bank && <p className="text-red-500 text-sm">{errors.bank}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-500 mb-2">Name on Account</label>
                                <input
                                    type="text"
                                    placeholder="Enter Name as on Account"
                                    value={data.account_name}
                                    onChange={(e) => setData("account_name", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded"
                                    required
                                />
                                {errors.account_name && <p className="text-red-500 text-sm">{errors.account_name}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-500 mb-2">Account Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter Account Number"
                                    value={data.account_number}
                                    onChange={(e) => setData("account_number", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded"
                                    required
                                />
                                {errors.account_number && <p className="text-red-500 text-sm">{errors.account_number}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-500 mb-2">Confirm Account Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter Confirm Account Number"
                                    value={data.confirm_account_number}
                                    onChange={(e) => setData("confirm_account_number", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded"
                                    required
                                />
                                {errors.confirm_account_number && <p className="text-red-500 text-sm">{errors.confirm_account_number}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-500 mb-2">IFSC Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter IFSC Code"
                                    value={data.ifsc_code}
                                    onChange={(e) => setData("ifsc_code", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded"
                                    required
                                />
                                {errors.ifsc_code && <p className="text-red-500 text-sm">{errors.ifsc_code}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === "list" && (
                    <div className="overflow-x-auto">
                        {accounts.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-600 text-lg font-medium">No accounts added yet.</p>
                                <p className="text-gray-400 text-sm">Add a new account to get started.</p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Bank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Account Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Account Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            IFSC Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {accounts.map((account) => (
                                        <tr key={account.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {account.bank}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {account.account_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {account.account_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {account.ifsc_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        account.status === 0
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {account.status === 0 ? "Inactive" : "Active"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}