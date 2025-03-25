import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import axios from 'axios';
import {
    LogOut,
    User,
    Wallet,
    Menu
} from "lucide-react";

export default function Navbar({ 
    isMobileView, 
    toggleSidebar, 
    isSidebarCollapsed 
}) {
    const { auth } = usePage().props;
    const [walletBalance, setWalletBalance] = useState({
        credit: 0,
        debit: 0
    });
    const [showUserInfo, setShowUserInfo] = useState(false);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            try {
                // Replace this with your actual API endpoint for fetching wallet balance
                const response = await axios.get('/admin/wallet-balance');
                setWalletBalance(response.data);
            } catch (error) {
                console.error('Failed to fetch wallet balance', error);
                // Optionally set default values or handle error
                setWalletBalance({ credit: 0, debit: 0 });
            }
        };

        // Fetch wallet balance when component mounts
        fetchWalletBalance();
    }, []);  // Empty dependency array means this runs once on component mount

    const handleLogout = () => {
        router.post(route("logout"));
    };

    const handleProfileClick = () => {
        router.get(route("admin.profile"));
    };

    const handleWalletClick = () => {
        router.get(route('wallet.transactions'));
    };

    return (
        <div className="bg-white shadow-md p-4">
            <div className="flex justify-between items-center">
                {isMobileView && (
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-full hover:bg-gray-100 focus:outline-none mr-2"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
                <div
                    className="cursor-pointer flex-1"
                    onClick={() => router.get(route("admin.onboarding"))}
                >
                    {/* Optional onboarding message */}
                </div>
                <div className="flex space-x-4">
                    {/* Pending Balance Box */}
                    <button 
                        onClick={handleWalletClick}
                        className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-md hover:bg-green-100 transition-colors duration-200"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        <span className="text-xs lg:text-sm font-medium">
                            Credit Balance: ₹ {(walletBalance.credit || 0).toLocaleString()}
                        </span>
                    </button>

                    {/* Approved Balance Box */}
                    <button 
                        onClick={handleWalletClick}
                        className="flex items-center bg-red-50 text-red-700 px-3 py-2 rounded-md hover:bg-red-100 transition-colors duration-200"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        <span className="text-xs lg:text-sm font-medium">
                            Debit Balance: ₹ {(walletBalance.debit || 0).toLocaleString()}
                        </span>
                    </button>

                    {/* User Section with Profile and Logout */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setShowUserInfo(true)}
                        onMouseLeave={() => setShowUserInfo(false)}
                    >
                        <button
                            className="flex items-center px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors duration-150 ease-in-out"
                        >
                            <User className="w-4 h-4 lg:w-5 lg:h-5 lg:mr-2" />
                            <span className="hidden lg:inline">{auth.user.name}</span>
                        </button>

                        {showUserInfo && auth.user && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 px-3 z-50 border border-gray-200 top-full">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="bg-indigo-100 rounded-full p-2">
                                        <User className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* My Profile Link */}
                                <button
                                    onClick={handleProfileClick}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    My Profile
                                </button>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}