import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    Home,
    BusFront,
    IndianRupee,
    Battery,
    ChevronDown,
    ChevronRight,
    Menu,
    X
} from "lucide-react";
import sidebarItems from "../data/sidebar_items.json";

export default function Sidebar({ 
    isMobileView, 
    isMobileSidebarOpen, 
    isSidebarCollapsed, 
    setIsMobileSidebarOpen, 
    toggleSidebar 
}) {
    const [isMenuOpen, setIsMenuOpen] = useState({});

    const toggleMenu = (menu) => {
        setIsMenuOpen((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const renderIcon = (iconName) => {
        const iconMap = {
            "Home": Home,
            "BusFront": BusFront,
            "IndianRupee": IndianRupee,
            "Battery": Battery
        };
        const Icon = iconMap[iconName] || Battery;
        return <Icon className="w-5 h-5 mr-3" />;
    };

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out z-30
            ${isMobileView 
                ? isMobileSidebarOpen 
                    ? "w-64 translate-x-0" 
                    : "w-64 -translate-x-full"
                : isSidebarCollapsed 
                    ? "w-16" 
                    : "w-64"
            } overflow-y-auto shadow-lg`}
        >
            {/* Sidebar Toggle Button */}
            <div className="p-4 flex justify-between items-center">
                {(!isSidebarCollapsed || isMobileView) && (
                    <h1 className="text-xl font-bold tracking-tight">
                        Nikatby Technologies
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-full hover:bg-gray-700 focus:outline-none"
                >
                    {isMobileView && isMobileSidebarOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
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
                                        onClick={() => toggleMenu(item.title)}
                                        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                            isSidebarCollapsed && !isMobileView
                                                ? "justify-center"
                                                : "justify-between"
                                        } hover:bg-indigo-600 hover:text-white focus:bg-indigo-700`}
                                    >
                                        <div
                                            className={`flex items-center ${
                                                isSidebarCollapsed && !isMobileView
                                                    ? "justify-center"
                                                    : ""
                                            }`}
                                        >
                                            {renderIcon(item.icon)}
                                            {(!isSidebarCollapsed || isMobileView) && (
                                                <span>{item.title}</span>
                                            )}
                                        </div>
                                        {(!isSidebarCollapsed || isMobileView) && (
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
                                        (!isSidebarCollapsed || isMobileView) && (
                                            <ul className="pl-8 mt-1 space-y-1">
                                                {item.subMenu.map(
                                                    (subItem, subIndex) => (
                                                        <li key={subIndex}>
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
                                                                                            onClick={() => isMobileView && setIsMobileSidebarOpen(false)}
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
                                                                    onClick={() => isMobileView && setIsMobileSidebarOpen(false)}
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
                                        isSidebarCollapsed && !isMobileView
                                            ? "justify-center"
                                            : ""
                                    } hover:bg-indigo-600 hover:text-white`}
                                    onClick={() => isMobileView && setIsMobileSidebarOpen(false)}
                                >
                                    {renderIcon(item.icon)}
                                    {(!isSidebarCollapsed || isMobileView) && item.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}