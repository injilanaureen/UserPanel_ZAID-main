import { usePage } from "@inertiajs/react";
import AdminLayout from "../Layouts/AdminLayout";
import { Link } from '@inertiajs/react';

export default function Profile() {
    const { auth } = usePage().props;

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
                {/* Page Header */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                        My Profile
                    </span>
                </h1>

                {/* Grid for Parallel Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Personal Information */}
                    <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Info
                            </h2>
                        </div>
                        <div className="p-6 space-y-4 bg-gray-50">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    value={auth.user.name || "Nik Suchit Kumar"}
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={auth.user.email || "nikatybp@gmail.com"}
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Mobile</label>
                                <input
                                    type="text"
                                    value="7070397689"
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* PAN/GST Details */}
                    <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                PAN & GST
                            </h2>
                        </div>
                        <div className="p-6 space-y-4 bg-gray-50">
                            <div>
                                <label className="text-sm font-medium text-gray-700">GST Number</label>
                                <input
                                    type="text"
                                    value="09AAJCNI793P2R"
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 transition-all"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">PAN Number</label>
                                <input
                                    type="text"
                                    value="AAJCNI793P"
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 transition-all"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Virtual Account Details */}
                    <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                        <div className="bg-gradient-to-r from-purple-600 to-violet-500 text-white p-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Virtual Accounts
                            </h2>
                        </div>
                        <div className="p-6 space-y-4 bg-gray-50">
                            <div>
                                <label className="text-sm font-medium text-gray-700">AXIS Bank</label>
                                <input
                                    type="text"
                                    value="9017P50000322864"
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">YES Bank</label>
                                <input
                                    type="text"
                                    value="YESVP50000322864"
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Bank Details */}
                    <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                        <div className="bg-gradient-to-r from-rose-600 to-red-500 text-white p-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m3-2v10M6.5 9a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm0 0v10" />
                                </svg>
                                Bank Details
                            </h2>
                        </div>
                        <div className="p-6 space-y-4 bg-gray-50">
                            <div>
                                <label className="text-sm font-medium text-gray-700">ICICI Bank</label>
                                <input
                                    type="text"
                                    value="XXXX033 | ICIC0006827"
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-all"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">AXIS Bank</label>
                                <input
                                    type="text"
                                    value="XXXX2875 | UTIB000359"
                                    className="w-full p-3 mt-1 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-all"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-12">
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all shadow-lg flex items-center transform hover:scale-105 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit Profile
                    </button>
                    <Link
                        href="/add-account"
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:from-green-700 hover:to-teal-600 transition-all shadow-lg flex items-center transform hover:scale-105 duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Account
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}