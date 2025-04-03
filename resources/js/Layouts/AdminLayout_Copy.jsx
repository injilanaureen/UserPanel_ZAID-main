import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout({ children }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Handle responsive sidebar behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsSidebarCollapsed(true);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Clean up
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobileView) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            setIsSidebarCollapsed((prev) => !prev);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile sidebar overlay */}
            {isMobileView && isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={() => setIsMobileSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <Sidebar 
                isMobileView={isMobileView}
                isMobileSidebarOpen={isMobileSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${
                    isMobileView ? "ml-0" : (isSidebarCollapsed ? "ml-16" : "ml-64")
                } flex flex-col h-screen overflow-hidden`}
            >
                {/* Navbar */}
                <Navbar 
                    isMobileView={isMobileView}
                    toggleSidebar={toggleSidebar}
                    isSidebarCollapsed={isSidebarCollapsed}
                />

                {/* Content Area */}
                <div className="p-2 md:p-4 lg:p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}