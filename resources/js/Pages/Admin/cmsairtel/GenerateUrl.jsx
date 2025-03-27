import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { AlertCircle, Code } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function GenerateUrl({ apiResponse, refid, error }) {
    const [form, setForm] = useState({
        refid: refid || "",
        latitude: "",
        longitude: "",
    });
    const [loading, setLoading] = useState(false);
    const [redirectionUrl, setRedirectionUrl] = useState("");
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState(null);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (apiResponse && apiResponse.redirectionUrl) {
            setRedirectionUrl(apiResponse.redirectionUrl);
        }
    }, [apiResponse]);

    useEffect(() => {
        if (redirectionUrl) {
            window.open(redirectionUrl, '_blank');
        }
    }, [redirectionUrl]);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setGeoLoading(true);
            setGeoError(null);
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setForm(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }));
                    setGeoLoading(false);
                },
                (error) => {
                    setGeoError("Unable to fetch location: " + error.message);
                    setGeoLoading(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            setGeoError("Geolocation is not supported by your browser");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post(route("generate.airtel.url"), form, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                console.log("Submission errors:", errors);
            },
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-full mx-auto">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
                        <h2 className="text-3xl font-semibold text-white">Generate Airtel URL</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            {/* Reference ID Field */}
                            <div>
                                <label htmlFor="refid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                                    Reference ID
                                </label>
                                <input
                                    id="refid"
                                    type="text"
                                    name="refid"
                                    value={form.refid}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                    maxLength={50}
                                    placeholder="Enter Reference ID"
                                />
                                {error?.refid && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <AlertCircle size={16} className="mr-2" />
                                        {error.refid}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Geolocation Status */}
                        {geoLoading && (
                            <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-blue-700 text-sm flex items-center">
                                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Fetching your location...
                                </p>
                            </div>
                        )}
                        {geoError && (
                            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                <p className="text-yellow-700 text-sm flex items-center">
                                    <AlertCircle size={16} className="mr-2" />
                                    {geoError}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || geoLoading}
                            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </span>
                            ) : "Generate URL"}
                        </button>
                    </form>

                    <div className="px-6 pb-6">
                        {error && typeof error === 'string' && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-red-600 text-sm flex items-center">
                                    <AlertCircle size={16} className="mr-2" />
                                    {error}
                                </p>
                            </div>
                        )}

                        {apiResponse && (
                            <div className="mt-4">
                                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                                    <Code size={16} className="mr-2" />
                                    API Response
                                </h3>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <pre className={`text-sm whitespace-pre-wrap ${
                                        apiResponse.status === "success"
                                            ? 'text-green-600'
                                            : apiResponse.status === "error"
                                            ? 'text-red-600'
                                            : 'text-gray-600'
                                    }`}>
                                        {JSON.stringify(apiResponse, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}