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
            "Battery": Battery,
            "Landmark": ({ className }) => (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={className}
                >
                    <line x1="3" x2="21" y1="22" y2="22"/>
                    <line x1="6" x2="6" y1="18" y2="11"/>
                    <line x1="10" x2="10" y1="18" y2="11"/>
                    <line x1="14" x2="14" y1="18" y2="11"/>
                    <line x1="18" x2="18" y1="18" y2="11"/>
                    <polygon points="12 2 20 7 4 7"/>
                </svg>
            ),
            "UmbrellaOff": ({ className }) => (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={className}
                >
                    <path d="M12 2v1"/>
                    <path d="M15.5 21a1.85 1.85 0 0 1-3.5-1v-8H2a10 10 0 0 1 3.428-6.575"/>
                    <path d="M17.5 12H22A10 10 0 0 0 9.004 3.455"/>
                    <path d="m2 2 20 20"/>
                </svg>
            )
        };
        
        const Icon = iconMap[iconName] || Battery;
        return <Icon className="w-5 h-5" />;
    };

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-black text-gray-300 transition-all duration-300 ease-in-out z-30
            ${isMobileView 
                ? isMobileSidebarOpen 
                    ? "w-64 translate-x-0" 
                    : "w-64 -translate-x-full"
                : isSidebarCollapsed 
                    ? "w-16" 
                    : "w-64"
            } overflow-y-auto shadow-xl`}
        >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                {(!isSidebarCollapsed || isMobileView) && (
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Nikatby Tech
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-200"
                >
                    {isMobileView && isMobileSidebarOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-4">
                <ul className="space-y-0.5">
                    {sidebarItems.map((item, index) => (
                        <li key={index}>
                            {item.subMenu ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                            isSidebarCollapsed && !isMobileView
                                                ? "justify-center"
                                                : "justify-between"
                                        } hover:bg-gray-800 hover:text-white focus:bg-gray-800 rounded-md mx-2 ${
                                            isMenuOpen[item.title] ? "bg-gray-900" : ""
                                        }`}
                                    >
                                        <div
                                            className={`flex items-center ${
                                                isSidebarCollapsed && !isMobileView
                                                    ? "justify-center"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center justify-center w-6 h-6 mr-3">
                                                {renderIcon(item.icon)}
                                            </div>
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
                                            <ul className="pl-6 mt-1 space-y-0.5 mb-2 bg-gray-900 py-2 mx-2 rounded-md">
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
                                                                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-800 justify-between rounded-md transition-colors duration-200"
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
                                                                        <ul className="pl-4 mt-1 space-y-0.5 mb-1">
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
                                                                                            className="block px-3 py-2 text-sm hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors duration-200"
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
                                                                    className="block px-3 py-2 text-sm hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors duration-200"
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
                                    className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                        isSidebarCollapsed && !isMobileView
                                            ? "justify-center"
                                            : ""
                                    } hover:bg-gray-800 hover:text-white rounded-md mx-2`}
                                    onClick={() => isMobileView && setIsMobileSidebarOpen(false)}
                                >
                                    <div className="flex items-center justify-center w-6 h-6 mr-3">
                                        {renderIcon(item.icon)}
                                    </div>
                                    {(!isSidebarCollapsed || isMobileView) && item.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
            
            {/* Footer */}
            {(!isSidebarCollapsed || isMobileView) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 text-xs text-center text-gray-500">
                    © 2025 Nikatby Technologies
                </div>
            )}
        </div>
    );
}