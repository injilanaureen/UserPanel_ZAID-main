import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const Dashboard = () => {
    // State for tooltip visibility, position, and content
    const [tooltip, setTooltip] = useState({
        visible: false,
        x: 0,
        y: 0,
        month: "",
        value: "",
    });

    // Sample data for the chart (you can adjust this based on your needs)
    const chartData = [
        { month: "Jan", value: 20 },
        { month: "Feb", value: 30 },
        { month: "Mar", value: 10 },
        { month: "Apr", value: 25 },
        { month: "May", value: 15 },
        { month: "Jun", value: 35 },
        { month: "Jul", value: 20 },
        { month: "Aug", value: 30 },
        { month: "Sep", value: 25 },
        { month: "Oct", value: 15 },
        { month: "Nov", value: 35 },
        { month: "Dec", value: 40 },
    ];

    // Handle mouse movement over the chart
    const handleMouseMove = (e) => {
        const svg = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - svg.left;
        const y = e.clientY - svg.top;

        // Calculate the closest month based on x position
        const segmentWidth = svg.width / (chartData.length - 1);
        const index = Math.min(
            Math.max(Math.round(x / segmentWidth), 0),
            chartData.length - 1
        );
        const dataPoint = chartData[index];

        setTooltip({
            visible: true,
            x: x + 10, // Offset to avoid covering the cursor
            y: y - 10,
            month: dataPoint.month,
            value: `$${dataPoint.value}k`,
        });
    };

    // Handle mouse leave to hide tooltip
    const handleMouseLeave = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    return (
        <AdminLayout>
            <div className="bg-gray-100 min-h-screen p-6">
                <div className="max-w-full mx-auto bg-white rounded-3xl shadow-lg p-6">
                    {/* Main Content */}
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-6">
                                Dashboard
                            </h2>

                            {/* Card Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Market Overview */}
                                <div className="bg-white p-4 rounded-xl shadow">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            Market overview
                                        </h3>
                                        <div className="flex space-x-2">
                                            <button className="bg-orange-100 text-orange-500 w-6 h-6 rounded-full flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                                    />
                                                </svg>
                                            </button>
                                            <button className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 6h16M4 12h16M4 18h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Graph */}
                                    <div className="h-40 w-full relative">
                                        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                                            {/* Grid lines */}
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="col-span-6 border-t border-gray-200 flex items-center"
                                                >
                                                    <span className="text-xs text-gray-500 w-8">
                                                        ${40 - i * 10}k
                                                    </span>
                                                </div>
                                            ))}

                                            {/* Months */}
                                            <div className="col-span-6 absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500">
                                                {chartData.map((data) => (
                                                    <span key={data.month}>{data.month}</span>
                                                ))}
                                            </div>

                                            {/* Chart */}
                                            <div className="absolute inset-0 mt-4 ml-8">
                                                <svg
                                                    viewBox="0 0 300 100"
                                                    className="w-full h-full"
                                                    onMouseMove={handleMouseMove}
                                                    onMouseLeave={handleMouseLeave}
                                                >
                                                    <defs>
                                                        <linearGradient
                                                            id="blueGradient"
                                                            x1="0%"
                                                            y1="0%"
                                                            x2="0%"
                                                            y2="100%"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="rgba(59, 130, 246, 0.5)"
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor="rgba(59, 130, 246, 0)"
                                                            />
                                                        </linearGradient>
                                                    </defs>
                                                    <path
                                                        d={chartData
                                                            .map(
                                                                (data, i) =>
                                                                    `${i === 0 ? "M" : "L"}${
                                                                        (i * 300) /
                                                                        (chartData.length - 1)
                                                                    },${100 - data.value * 2.5}`
                                                            )
                                                            .join(" ")}
                                                        stroke="rgb(59, 130, 246)"
                                                        strokeWidth="2"
                                                        fill="none"
                                                    />
                                                    <path
                                                        d={`${chartData
                                                            .map(
                                                                (data, i) =>
                                                                    `${i === 0 ? "M" : "L"}${
                                                                        (i * 300) /
                                                                        (chartData.length - 1)
                                                                    },${100 - data.value * 2.5}`
                                                            )
                                                            .join(" ")} L300,100 L0,100 Z`}
                                                        fill="url(#blueGradient)"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Tooltip */}
                                        {tooltip.visible && (
                                            <div
                                                className="absolute bg-gray-800 text-white text-xs rounded p-2 pointer-events-none"
                                                style={{
                                                    top: tooltip.y,
                                                    left: tooltip.x,
                                                    transform: "translate(-10%, -100%)",
                                                }}
                                            >
                                                <div>{tooltip.month}</div>
                                                <div>{tooltip.value}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Transactions */}
                                <div className="bg-white p-4 rounded-xl shadow">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            Transactions
                                        </h3>
                                        <button className="text-sm text-gray-500">
                                            Transaction ID
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-gray-500 text-sm">
                                                    <th className="pb-2">Recipient</th>
                                                    <th className="pb-2">Transaction ID</th>
                                                    <th className="pb-2">Date</th>
                                                    <th className="pb-2">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-t">
                                                    <td className="py-3">Samanta William</td>
                                                    <td className="py-3 text-gray-500">TR-001-234536</td>
                                                    <td className="py-3 text-gray-500">March 23,2023</td>
                                                    <td className="py-3 text-orange-500">$88,753</td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="py-3">Jorden Heco</td>
                                                    <td className="py-3 text-gray-500">TR-002-234536</td>
                                                    <td className="py-3 text-gray-500">March 25,2023</td>
                                                    <td className="py-3 text-orange-500">$58,45</td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="py-3">Tony Soap</td>
                                                    <td className="py-3 text-gray-500">TR-003-234823</td>
                                                    <td className="py-3 text-gray-500">March 25,2023</td>
                                                    <td className="py-3 text-orange-500">$24,654</td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="py-3">Nana Vita</td>
                                                    <td className="py-3 text-gray-500">TR-004-487123</td>
                                                    <td className="py-3 text-gray-500">March 25,2023</td>
                                                    <td className="py-3 text-orange-500">$88,960</td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="py-3">Amanda Sotir</td>
                                                    <td className="py-3 text-gray-500">TR-005-187123</td>
                                                    <td className="py-3 text-gray-500">March 25,2023</td>
                                                    <td className="py-3 text-orange-500">$13,020</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Cards Container */}
                            <div className="space-y-6">
                                {/* First Row: Recharge, E-KYC, Fastag */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Recharge Card */}
                                    <div className="bg-blue-100 p-4 rounded-xl shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">Recharge</h3>
                                            <button className="text-orange-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-500">Rs 150</div>
                                            <div className="text-sm text-gray-500">Available Balance</div>
                                        </div>
                                    </div>

                                    {/* E-KYC Card */}
                                    <div className="bg-green-100 p-4 rounded-xl shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">E-KYC</h3>
                                            <button className="text-orange-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-500">25</div>
                                            <div className="text-sm text-gray-500">Active Tickets</div>
                                        </div>
                                    </div>

                                    {/* Fastag Card */}
                                    <div className="bg-purple-100 p-4 rounded-xl shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">Fastag</h3>
                                            <button className="text-orange-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-500">12</div>
                                            <div className="text-sm text-gray-500">Pending Bookings</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Second Row: Bus2, LPG Booking & Payments */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Bus2 Card */}
                                    <div className="bg-yellow-100 p-4 rounded-xl shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">Bus2</h3>
                                            <button className="text-orange-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-500">Rs 890</div>
                                            <div className="text-sm text-gray-500">Total Revenue</div>
                                        </div>
                                    </div>

                                    {/* LPG Booking & Payments Card */}
                                    <div className="bg-red-100 p-4 rounded-xl shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">LPG Booking & Payments</h3>
                                            <button className="text-orange-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-500">Rs 890</div>
                                            <div className="text-sm text-gray-500">Total Revenue</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;