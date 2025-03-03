import { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const OnboardingForm = () => {
    const [step, setStep] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        merchantcode: '',
        mobile: '',
        is_new: '0',
        email: '',
        firm: 'PAYSPRINT',
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
    });

    const [apiResponse, setApiResponse] = useState(null);
    const [showResponse, setShowResponse] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // First, save to database
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            const dbResponse = await axios.post(route('admin.onboarding.store'), formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Then, call the PaySprint API
            formDataToSend.append('callback', 'http://127.0.0.1:8000/members/kyc');

            const apiResponse = await fetch('https://sit.paysprint.in/service-api/api/v1/service/onboard/onboardnew/getonboardurl', {
                method: 'POST',
                headers: {
                    'Authorisedkey': 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                    'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzkyNzI4MjgsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5MjcyODI4In0._dTNvgt_RwE41vqIZ_SiX70dXGh_x4qJP6PTxR677Dw',
                },
                body: formDataToSend,
            });
            
            const data = await apiResponse.json();
            setApiResponse(data);
            setShowResponse(true);
            
            if (dbResponse.data.status) {
                console.log('Form data saved to database successfully');
            }
        } catch (error) {
            console.error('Error:', error);
            setApiResponse({
                status: false,
                message: error.response?.data?.message || 'An error occurred while processing your request.'
            });
            setShowResponse(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRedirect = () => {
        if (apiResponse?.redirecturl) {
            window.open(apiResponse.redirecturl, '_blank');
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        window.history.back();
    };

    if (!isFormOpen) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto relative">
                        <button onClick={handleClose} className="absolute top-4 right-4">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>

                        {!showResponse ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="merchantcode"
                                            value={formData.merchantcode}
                                            onChange={handleChange}
                                            placeholder="Merchant Code"
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            placeholder="Mobile Number"
                                            pattern="[0-9]{10}"
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                        <select
                                            name="is_new"
                                            value={formData.is_new}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        >
                                            <option value="0">Existing User (0)</option>
                                            <option value="1">New User (1)</option>
                                        </select>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="firm"
                                            value={formData.firm}
                                            readOnly
                                            className="w-full p-2 border rounded"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Aadhaar Front
                                            </label>
                                            <input
                                                type="file"
                                                name="aadhaarFront"
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Aadhaar Back
                                            </label>
                                            <input
                                                type="file"
                                                name="aadhaarBack"
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                PAN Card
                                            </label>
                                            <input
                                                type="file"
                                                name="panCard"
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                            />
                                        </div>

                                        <div className="flex justify-between space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                            >
                                                {loading ? 'Submitting...' : 'Submit'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className={`p-4 rounded ${apiResponse?.status ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <p className="font-medium">
                                        Status: {apiResponse?.status ? 'Success' : 'Failed'}
                                    </p>
                                    <p className="text-gray-700">{apiResponse?.message}</p>
                                </div>
                                
                                {apiResponse?.redirecturl && (
                                    <div className="border p-4 rounded">
                                        <p className="font-medium mb-2">Redirect URL:</p>
                                        <p className="text-sm text-gray-600 break-all mb-2">
                                            {apiResponse.redirecturl}
                                        </p>
                                        <button
                                            onClick={handleRedirect}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Open Redirect URL
                                        </button>
                                    </div>
                                )}
                                
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => {
                                            setShowResponse(false);
                                            setApiResponse(null);
                                        }}
                                        className="px-4 py-2 border rounded hover:bg-gray-100"
                                    >
                                        Back to Form
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingForm;