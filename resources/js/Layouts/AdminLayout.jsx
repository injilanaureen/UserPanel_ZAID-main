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
    Menu,
} from "lucide-react";
import sidebarItems from "../data/sidebar_items.json";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState({});
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    const toggleMenu = (menu) => {
        setIsMenuOpen((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? "w-16" : "w-64"
                } overflow-y-auto shadow-lg`}
            >
                {/* Sidebar Toggle Button */}
                <div className="p-4 flex justify-between items-center">
                    {!isSidebarCollapsed && (
                        <h1 className="text-xl font-bold tracking-tight">
                            Admin Panel
                        </h1>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-full hover:bg-gray-700 focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6">
                    <ul>
                        {sidebarItems.map((item, index) => (
                            <li key={index} className="mb-1">
                                {item.subMenu ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                toggleMenu(item.title)
                                            }
                                            className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                                isSidebarCollapsed
                                                    ? "justify-center"
                                                    : "justify-between"
                                            } hover:bg-indigo-600 hover:text-white focus:bg-indigo-700`}
                                        >
                                            <div
                                                className={`flex items-center ${
                                                    isSidebarCollapsed
                                                        ? "justify-center"
                                                        : ""
                                                }`}
                                            >
                                                {item.icon === "Home" ? (
                                                    <Home className="w-5 h-5 mr-3" />
                                                ) : item.icon ===
                                                  "BusFront" ? (
                                                    <BusFront className="w-5 h-5 mr-3" />
                                                ) : item.icon ===
                                                  "IndianRupee" ? (
                                                    <IndianRupee className="w-5 h-5 mr-3" />
                                                ) : (
                                                    <Battery className="w-5 h-5 mr-3" />
                                                )}
                                                {!isSidebarCollapsed && (
                                                    <span>{item.title}</span>
                                                )}
                                            </div>
                                            {!isSidebarCollapsed && (
                                                <span>
                                                    {isMenuOpen[item.title] ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </span>
                                            )}
                                        </button>

                                        {/* Dropdown Content */}
                                        {isMenuOpen[item.title] &&
                                            !isSidebarCollapsed && (
                                                <ul className="pl-8 mt-1 space-y-1">
                                                    {item.subMenu.map(
                                                        (subItem, subIndex) => (
                                                            <li
                                                                key={subIndex}
                                                            >
                                                                {subItem.subMenu ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() =>
                                                                                toggleMenu(
                                                                                    subItem.title
                                                                                )
                                                                            }
                                                                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 justify-between"
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    subItem.title
                                                                                }
                                                                            </span>
                                                                            <span>
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
                                                                        {isMenuOpen[
                                                                            subItem
                                                                                .title
                                                                        ] && (
                                                                            <ul className="pl-6 mt-1 space-y-1">
                                                                                {subItem.subMenu.map(
                                                                                    (
                                                                                        nestedItem,
                                                                                        nestedIndex
                                                                                    ) => (
                                                                                        <li
                                                                                            key={
                                                                                                nestedIndex
                                                                                            }
                                                                                        >
                                                                                            <Link
                                                                                                href={
                                                                                                    nestedItem.href
                                                                                                }
                                                                                                className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
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
                                                                        className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
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
                                        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                            isSidebarCollapsed
                                                ? "justify-center"
                                                : ""
                                        } hover:bg-indigo-600 hover:text-white`}
                                    >
                                        <Home className="w-5 h-5 mr-3" />
                                        {!isSidebarCollapsed && item.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${
                    isSidebarCollapsed ? "ml-16" : "ml-64"
                }`}
            >
                {/* Top Bar */}
                <div className="bg-white shadow-md p-4">
                    <div className="flex justify-between items-center">
                        <div
                            className="cursor-pointer flex-1"
                            onClick={() => router.get(route("admin.onboarding"))}
                        >
                            <marquee
                                className="text-red-500 font-bold text-lg"
                                scrollamount="5"
                            >
                                Onboarding: Please complete your profile and set
                                up your preferences!
                            </marquee>
                        </div>
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