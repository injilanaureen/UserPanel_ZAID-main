import React, { useState, useRef } from "react";
import { usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const FundRequestPage = () => {
    // Destructure props from Inertia page
    const { bankAccounts, errors: serverErrors } = usePage().props;

    // Ref for file input to allow resetting
    const fileInputRef = useRef(null);

    // Form state with initial empty values
    const [formData, setFormData] = useState({
        transactionType: "",
        amount: "",
        transactionId: "",
        depositedDate: "",
        bankId: "",
        image: null
    });

    // Local validation errors state
    const [clientErrors, setClientErrors] = useState({});

    // Validation for image file
    const validateImageFile = (file) => {
        const errors = {};

        // Check file exists
        if (!file) return errors;

        // Allowed image types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        
        // Max file size (5MB)
        const maxSize = 5 * 1024 * 1024;

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            errors.image = "Only JPEG, JPG, and PNG images are allowed";
        }

        // Validate file size
        if (file.size > maxSize) {
            errors.image = "Image size should not exceed 5MB";
        }

        return errors;
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        // Handle file input separately
        if (name === 'image') {
            const file = files[0];
            const imageValidationErrors = validateImageFile(file);
            
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Update client errors for image
            setClientErrors(prev => ({
                ...prev,
                ...imageValidationErrors
            }));
        } else {
            // Regular input handling
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear specific field error when user starts typing/selecting
        if (clientErrors[name]) {
            setClientErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};

        // Required field validations
        if (!formData.transactionType) 
            newErrors.transactionType = "Transaction Type is required";
        
        if (!formData.amount) 
            newErrors.amount = "Amount is required";
        else if (parseFloat(formData.amount) <= 0) 
            newErrors.amount = "Amount must be greater than zero";
        
        if (!formData.transactionId) 
            newErrors.transactionId = "Transaction ID is required";
        
        if (!formData.depositedDate) 
            newErrors.depositedDate = "Deposited Date is required";
        
        if (!formData.bankId) 
            newErrors.bankId = "Bank selection is required";

        // Image validation (if uploaded)
        if (formData.image) {
            const imageErrors = validateImageFile(formData.image);
            if (imageErrors.image) {
                newErrors.image = imageErrors.image;
            }
        }

        return newErrors;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateForm();
        
        // If there are validation errors, set them and stop submission
        if (Object.keys(validationErrors).length > 0) {
            setClientErrors(validationErrors);
            return;
        }

        // Prepare form data for submission
        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                submissionData.append(key, value);
            }
        });

        // Submit form using Inertia router
        router.post('/fundrequest/store', submissionData, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Reset form after successful submission
                setFormData({
                    transactionType: "",
                    amount: "",
                    transactionId: "",
                    depositedDate: "",
                    bankId: "",
                    image: null
                });
                
                // Clear errors
                setClientErrors({});
                
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            },
            onError: (errors) => {
                // Handle server-side errors
                setClientErrors(errors);
            }
        });
    };

    // Combine client and server errors
    const displayErrors = { ...clientErrors, ...serverErrors };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Fund Request</h2>
                    
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Transaction Type */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">
                                Transaction Type
                            </label>
                            <select
                                name="transactionType"
                                value={formData.transactionType}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    displayErrors.transactionType ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">-- Select Type --</option>
                                <option value="NEFT">NEFT</option>
                                <option value="RTGS">RTGS</option>
                                <option value="IMPS">IMPS</option>
                            </select>
                            {displayErrors.transactionType && (
                                <span className="text-red-500 text-sm mt-1">
                                    {displayErrors.transactionType}
                                </span>
                            )}
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">
                                Amount
                            </label>
                            <input
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    displayErrors.amount ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter Amount"
                                min="1"
                                step="0.01"
                            />
                            {displayErrors.amount && (
                                <span className="text-red-500 text-sm mt-1">
                                    {displayErrors.amount}
                                </span>
                            )}
                        </div>

                        {/* Transaction ID */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">
                                Transaction ID
                            </label>
                            <input
                                name="transactionId"
                                type="text"
                                value={formData.transactionId}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    displayErrors.transactionId ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter Transaction ID"
                            />
                            {displayErrors.transactionId && (
                                <span className="text-red-500 text-sm mt-1">
                                    {displayErrors.transactionId}
                                </span>
                            )}
                        </div>

                        {/* Deposited Date */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">
                                Deposited Date
                            </label>
                            <input
                                name="depositedDate"
                                type="date"
                                value={formData.depositedDate}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    displayErrors.depositedDate ? 'border-red-500' : 'border-gray-300'
                                }`}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {displayErrors.depositedDate && (
                                <span className="text-red-500 text-sm mt-1">
                                    {displayErrors.depositedDate}
                                </span>
                            )}
                        </div>

                        {/* Bank Account */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">
                                Bank Account
                            </label>
                            <select
                                name="bankId"
                                value={formData.bankId}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    displayErrors.bankId ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">-- Select Bank Account --</option>
                                {bankAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.bank} - {account.account_name} (****{account.account_number.slice(-4)})
                                    </option>
                                ))}
                            </select>
                            {displayErrors.bankId && (
                                <span className="text-red-500 text-sm mt-1">
                                    {displayErrors.bankId}
                                </span>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-1">
                                Upload Proof (Image only)
                            </label>
                            <input
                                ref={fileInputRef}
                                name="image"
                                type="file"
                                onChange={handleChange}
                                accept="image/jpeg,image/png,image/jpg"
                                className="w-full p-2 border border-gray-300 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                            />
                            {displayErrors.image && (
                                <span className="text-red-500 text-sm mt-1">
                                    {displayErrors.image}
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default FundRequestPage;