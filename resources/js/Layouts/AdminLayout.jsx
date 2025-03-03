import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    LogOut,
    Home,
    Battery,
    ChevronDown,
    ChevronRight,
    User,
    BusFront,
    IndianRupee,
} from "lucide-react";
import sidebarItems from "../data/sidebar_items.json";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState({});

    const [showUserInfo, setShowUserInfo] = useState(false);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    const toggleMenu = (menu) => {
        setIsMenuOpen((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 w-64 h-screen bg-gray-800 text-white overflow-y-auto">
                {/* Logo/Header */}
                <div className="p-4">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>

                {/* Navigation */}
                <nav className="mt-4">
                    <ul>
                        {sidebarItems.map((item, index) => (
                            <li key={index} className="mb-2">
                                {item.subMenu ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                toggleMenu(item.title)
                                            }
                                            className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                        >
                                            {item.icon === "Home" ? (
                                                <Home className="w-5 h-5 mr-2" />
                                            ) : item.icon === "BusFront" ? (
                                                <BusFront className="w-5 h-5 mr-2" />
                                            ) : item.icon === "IndianRupee" ? (
                                                <IndianRupee className="w-5 h-5 mr-2" />
                                            ) : (
                                                <Battery className="w-5 h-5 mr-2" />
                                            )}

                                            <span>{item.title}</span>
                                            <span className="ml-auto">
                                                {isMenuOpen[item.title] ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </span>
                                        </button>

                                        {/* Dropdown Content */}
                                        {isMenuOpen[item.title] && (
                                            <ul className="pl-8 mt-2">
                                                {item.subMenu.map(
                                                    (subItem, subIndex) => (
                                                        <li
                                                            key={subIndex}
                                                            className="mb-2"
                                                        >
                                                            {subItem.subMenu ? (
                                                                <>
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleMenu(
                                                                                subItem.title
                                                                            )
                                                                        }
                                                                        className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                                                    >
                                                                        <span>
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </span>
                                                                        <span className="ml-auto">
                                                                            {isMenuOpen[
                                                                                subItem
                                                                                    .title
                                                                            ] ? (
                                                                                <ChevronDown className="w-4 h-4" />
                                                                            ) : (
                                                                                <ChevronRight className="w-4 h-4" />
                                                                            )}
                                                                        </span>
                                                                    </button>

                                                                    {/* Nested Dropdown */}
                                                                    {isMenuOpen[
                                                                        subItem
                                                                            .title
                                                                    ] && (
                                                                        <ul className="pl-8 mt-2">
                                                                            {subItem.subMenu.map(
                                                                                (
                                                                                    nestedItem,
                                                                                    nestedIndex
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            nestedIndex
                                                                                        }
                                                                                        className="mb-2"
                                                                                    >
                                                                                        <Link
                                                                                            href={
                                                                                                nestedItem.href
                                                                                            }
                                                                                            className="block px-4 py-2 hover:bg-gray-700"
                                                                                        >
                                                                                            {
                                                                                                nestedItem.title
                                                                                            }
                                                                                        </Link>
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <Link
                                                                    href={
                                                                        subItem.href
                                                                    }
                                                                    className="block px-4 py-2 hover:bg-gray-700"
                                                                >
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </Link>
                                                            )}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center px-4 py-2 hover:bg-gray-700"
                                    >
                                        <Home className="w-5 h-5 mr-2" />
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="flex-1 ml-64">
                {/* Top Bar */}
                <div className="bg-white shadow-md p-4">
                    <div className="flex justify-between items-center">
                        <div
                            className="cursor-pointer flex-1"
                            onClick={() =>
                                router.get(route("admin.onboarding"))
                            }
                        >
                            <marquee
                                className="text-red-500 font-bold text-lg"
                                scrollamount="5"
                            >
                                Onboarding: Please complete your profile and set
                                up your preferences!
                            </marquee>
                        </div>

                        {/* User Info and Logout Button */}
                        <div className="relative">
                            <button
                                onClick={handleLogout}
                                onMouseEnter={() => setShowUserInfo(true)}
                                onMouseLeave={() => setShowUserInfo(false)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-150 ease-in-out ml-4"
                            >
                                <User className="w-5 h-5 mr-2" />
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>

                            {/* User Info Popup */}
                            {showUserInfo && auth.user && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 px-3 z-50 border border-gray-200">
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
