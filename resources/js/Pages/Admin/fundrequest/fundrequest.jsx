import React, { useState, useRef } from "react";
import { usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Banknote, FileText, Calendar, CreditCard, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

const FundRequestPage = () => {
    const { bankAccounts, errors: serverErrors } = usePage().props;
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        transactionType: "",
        amount: "",
        transactionId: "",
        depositedDate: "",
        bankId: "",
        image_path: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [clientErrors, setClientErrors] = useState({});

    const transactionTypes = [
        { label: "NEFT", value: "NEFT" },
        { label: "RTGS", value: "RTGS" },
        { label: "IMPS", value: "IMPS" }
    ];

    const validateImageFile = (file) => {
        const errors = {};
        if (!file) return errors;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            errors.image_path = "Only JPEG, JPG, and PNG images are allowed";
        }
        if (file.size > maxSize) {
            errors.image_path = "Image size should not exceed 5MB";
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'image_path') {
            const file = files[0];
            const imageValidationErrors = validateImageFile(file);
            
            setFormData(prev => ({ ...prev, image_path: file }));
            setClientErrors(prev => ({ ...prev, ...imageValidationErrors }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (clientErrors[name] || error || success) {
            setClientErrors(prev => ({ ...prev, [name]: null }));
            setError("");
            setSuccess("");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.transactionType) newErrors.transactionType = "Transaction Type is required";
        if (!formData.amount) newErrors.amount = "Amount is required";
        else if (parseFloat(formData.amount) <= 0) newErrors.amount = "Amount must be greater than zero";
        if (!formData.transactionId) newErrors.transactionId = "Transaction ID is required";
        if (!formData.depositedDate) newErrors.depositedDate = "Deposited Date is required";
        if (!formData.bankId) newErrors.bankId = "Bank selection is required";
        if (formData.image_path) {
            const imageErrors = validateImageFile(formData.image_path);
            if (imageErrors.image_path) newErrors.image = imageErrors.image_path;
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setClientErrors(validationErrors);
            setLoading(false);
            return;
        }

        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                submissionData.append(key, value);
            }
        });

        router.post('/fundrequest/store', submissionData, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccess("Fund request submitted successfully!");
                setFormData({
                    transactionType: "",
                    amount: "",
                    transactionId: "",
                    depositedDate: "",
                    bankId: "",
                    image: null
                });
                setClientErrors({});
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            },
            onError: (errors) => {
                setError("Failed to submit fund request");
                setClientErrors(errors);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const displayErrors = { ...clientErrors, ...serverErrors };

    return (
        <AdminLayout>
            <div className="max-w-full">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
                        <h2 className="text-3xl font-semibold text-white">Fund Request</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6" encType="multipart/form-data">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Transaction Type */}
                            <div>
                                <label htmlFor="transactionType" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <CreditCard size={20} className="mr-2 text-green-500" />
                                    Transaction Type
                                </label>
                                <select
                                    id="transactionType"
                                    name="transactionType"
                                    value={formData.transactionType}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                                        displayErrors.transactionType ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select Type</option>
                                    {transactionTypes.map((type) => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                                {displayErrors.transactionType && (
                                    <p className="text-red-500 text-xs mt-1">{displayErrors.transactionType}</p>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label htmlFor="amount" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <Banknote size={20} className="mr-2 text-blue-500" />
                                    Amount
                                </label>
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                                        displayErrors.amount ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter Amount"
                                    min="1"
                                    step="0.01"
                                />
                                {displayErrors.amount && (
                                    <p className="text-red-500 text-xs mt-1">{displayErrors.amount}</p>
                                )}
                            </div>

                            {/* Transaction ID */}
                            <div>
                                <label htmlFor="transactionId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <FileText size={20} className="mr-2 text-yellow-500" />
                                    Transaction ID
                                </label>
                                <input
                                    id="transactionId"
                                    name="transactionId"
                                    type="text"
                                    value={formData.transactionId}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                                        displayErrors.transactionId ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter Transaction ID"
                                />
                                {displayErrors.transactionId && (
                                    <p className="text-red-500 text-xs mt-1">{displayErrors.transactionId}</p>
                                )}
                            </div>

                            {/* Deposited Date */}
                            <div>
                                <label htmlFor="depositedDate" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <Calendar size={20} className="mr-2 text-purple-500" />
                                    Deposited Date
                                </label>
                                <input
                                    id="depositedDate"
                                    name="depositedDate"
                                    type="date"
                                    value={formData.depositedDate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                                        displayErrors.depositedDate ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                {displayErrors.depositedDate && (
                                    <p className="text-red-500 text-xs mt-1">{displayErrors.depositedDate}</p>
                                )}
                            </div>

                            {/* Bank Account */}
                            <div>
                                <label htmlFor="bankId" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <CreditCard size={20} className="mr-2 text-indigo-500" />
                                    Bank Account
                                </label>
                                <select
                                    id="bankId"
                                    name="bankId"
                                    value={formData.bankId}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                                        displayErrors.bankId ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select Bank Account</option>
                                    {bankAccounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.bank} - {account.account_name} (****{account.account_number.slice(-4)})
                                        </option>
                                    ))}
                                </select>
                                {displayErrors.bankId && (
                                    <p className="text-red-500 text-xs mt-1">{displayErrors.bankId}</p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label htmlFor="image_path" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    <ImageIcon size={20} className="mr-2 text-orange-500" />
                                    Upload Proof
                                </label>
                                <input
                                    ref={fileInputRef}
                                    id="image_path"
                                    name="image_path"
                                    type="file"
                                    onChange={handleChange}
                                    accept="image/jpeg,image/png,image/jpg"
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                                        displayErrors.image ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {displayErrors.image_path && (
                                    <p className="text-red-500 text-xs mt-1">{displayErrors.image_path}</p>
                                )}
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
                            ) : "Submit Request"}
                        </button>
                    </form>

                    {/* Response and error handling */}
                    <div className="px-6 pb-6">
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-red-600 text-sm flex items-center">
                                    <AlertCircle size={16} className="mr-2" />
                                    {error}
                                </p>
                            </div>
                        )}
                        {success && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                                <p className="text-green-600 text-sm flex items-center">
                                    <CheckCircle size={16} className="mr-2" />
                                    {success}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default FundRequestPage;