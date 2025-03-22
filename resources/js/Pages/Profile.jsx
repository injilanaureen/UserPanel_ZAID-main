import { usePage } from "@inertiajs/react";
import AdminLayout from "../Layouts/AdminLayout";
import { Link } from '@inertiajs/react';

export default function Profile() {
    const { auth } = usePage().props;

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-gray-900 text-white p-4">
                        <h2 className="text-xl">Personal Information</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                                    <input type="text" value={auth.user.name || "Zaid"} className="w-full p-2 border border-dashed border-gray-300 rounded" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Mobile</label>
                                    <input type="text" value="7070397689" className="w-full p-2 border border-dashed border-gray-300 rounded" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <input type="email" value={auth.user.email || "zaidiqbaliqbal28@gmail.com"} className="w-full p-2 border border-dashed border-gray-300 rounded" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">State</label>
                                    <select className="w-full p-2 border border-gray-300 rounded">
                                        <option>Select State</option>
                                        <option>Delhi</option>
                                        <option>Uttar Pradesh</option>
                                        <option>Maharashtra</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">City</label>
                                    <input type="text" value="Noida" className="w-full p-2 border border-dashed border-gray-300 rounded" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Pincode</label>
                                    <input type="text" value="201301" className="w-full p-2 border border-dashed border-gray-300 rounded" />
                                </div>
                                <div className="space-y-2 col-span-full">
                                    <label className="text-sm font-medium text-gray-600">Address</label>
                                    <textarea value="Noida" rows={4} className="w-full p-2 border border-dashed border-gray-300 rounded resize-none"></textarea>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                            <div className="mt-4">
                                <Link 
                                    href="/add-account" 
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Add Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}