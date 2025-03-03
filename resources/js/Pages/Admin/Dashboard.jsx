import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  CreditCard,
  Code2,
  Bus,
  Wallet,
  Phone,
  Wifi,
  Zap,
  TrendingUp,
  Bell,
  User,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const Dashboard = () => {
  const services = [
    { name: 'Recharge', icon: <Phone className="w-6 h-6" />, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { name: 'API Services', icon: <Code2 className="w-6 h-6" />, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { name: 'Bus Booking', icon: <Bus className="w-6 h-6" />, color: 'bg-gradient-to-br from-green-500 to-green-600' },
    { name: 'Bill Payments', icon: <CreditCard className="w-6 h-6" />, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
    { name: 'Internet', icon: <Wifi className="w-6 h-6" />, color: 'bg-gradient-to-br from-red-500 to-red-600' },
    { name: 'Electricity', icon: <Zap className="w-6 h-6" />, color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
  ];

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Balance</h2>
                  <p className="text-2xl font-semibold text-gray-900">₹5,84,60,035</p>
                </div>
              </div>
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium ml-1">+12.5%</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Today's Transactions</h2>
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
              </div>
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium ml-1">+8.1%</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-3">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">API Calls</h2>
                  <p className="text-2xl font-semibold text-gray-900">1,284</p>
                </div>
              </div>
              <div className="flex items-center text-red-500">
                <ArrowDownRight className="w-4 h-4" />
                <span className="text-sm font-medium ml-1">-3.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Services</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service, index) => (
              <button
                key={index}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col items-center border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                <div className={`${service.color} text-white rounded-2xl p-4 mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {service.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Filter
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors">
                Download
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-l-lg">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-r-lg">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    service: 'Mobile Recharge',
                    amount: '₹499',
                    status: 'Completed',
                    date: '2024-03-15',
                  },
                  {
                    service: 'Bus Ticket',
                    amount: '₹1,200',
                    status: 'Pending',
                    date: '2024-03-14',
                  },
                  {
                    service: 'Electricity Bill',
                    amount: '₹2,450',
                    status: 'Completed',
                    date: '2024-03-13',
                  },
                ].map((transaction, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
    </AdminLayout>
  );
};

export default Dashboard;