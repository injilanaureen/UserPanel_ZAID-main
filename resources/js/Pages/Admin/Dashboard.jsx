import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis, Legend } from 'recharts';
import axios from 'axios';
// import Profile from './Profile/profile';
const Dashboard = () => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    month: "",
    value: "",
  });
  const [timeFilter, setTimeFilter] = useState('month');
  const [walletBalance, setWalletBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // Fetch wallet balance through proxy
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setIsLoadingBalance(true);
        const response = await axios.get('/admin/api/proxy/wallet-balance');
        if (response.data.success) {
          setWalletBalance(response.data.balance);
        } else {
          setWalletBalance('Error');
          console.error('Wallet Balance API Error:', response.data.message);
        }
      } catch (error) {
        setWalletBalance('Error');
        // console.error('Wallet Balance API Response:', error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchWalletBalance();
  }, []);

  // Rest of your data declarations remain unchanged
  const monthlyData = [
    { month: "Jan", income: 35, expenses: 20, profit: 15 },
    { month: "Feb", income: 28, expenses: 18, profit: 10 },
    { month: "Mar", income: 43, expenses: 30, profit: 13 },
    { month: "Apr", income: 30, expenses: 15, profit: 15 },
    { month: "May", income: 50, expenses: 25, profit: 25 },
    { month: "Jun", income: 38, expenses: 20, profit: 18 },
  ];

  const pieData = [
    { name: "Product A", value: 35, color: "#FF6384" },
    { name: "Product B", value: 30, color: "#36A2EB" },
    { name: "Product C", value: 35, color: "#FFCE56" },
  ];

  const barData = [
    { name: "Category 1", value: 65 },
    { name: "Category 2", value: 45 },
    { name: "Category 3", value: 75 },
    { name: "Category 4", value: 35 },
    { name: "Category 5", value: 55 },
  ];

  const trafficData = [
    { name: "Direct", value: 4000 },
    { name: "Social", value: 3000 },
    { name: "Email", value: 2000 },
    { name: "Referral", value: 2780 },
    { name: "Organic", value: 1890 },
  ];

  const trafficColors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

  const visitorData = [
    { name: 'Week 1', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Week 2', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Week 3', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Week 4', uv: 2780, pv: 3908, amt: 2000 },
  ];

  const conversionData = [
    { name: 'Mon', value: 10 },
    { name: 'Tue', value: 14 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 20 },
    { name: 'Fri', value: 18 },
    { name: 'Sat', value: 12 },
    { name: 'Sun', value: 7 },
  ];

  const performanceData = [
    { subject: 'Sales', A: 120, B: 110, fullMark: 150 },
    { subject: 'Marketing', A: 98, B: 130, fullMark: 150 },
    { subject: 'Development', A: 86, B: 130, fullMark: 150 },
    { subject: 'Customer', A: 99, B: 100, fullMark: 150 },
    { subject: 'Operations', A: 85, B: 90, fullMark: 150 },
    { subject: 'Finance', A: 65, B: 85, fullMark: 150 },
  ];

  const scatterData = [
    { x: 100, y: 200, z: 200 },             
    { x: 120, y: 100, z: 260 },             
    { x: 170, y: 300, z: 400 },             
    { x: 140, y: 250, z: 280 },             
    { x: 150, y: 400, z: 500 },             
    { x: 110, y: 280, z: 200 },             
  ];

  const regionData = [
    { name: 'North', value: 4000 },
    { name: 'South', value: 3000 },
    { name: 'East', value: 2000 },
    { name: 'West', value: 2780 },
    { name: 'Central', value: 1890 },
  ];

  const regionColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const userActivities = [
    { id: 1, user: "Emma Watson", action: "Completed task", time: "2 hours ago", avatar: "/user4.png" },
    { id: 2, user: "John Doe", action: "Started new project", time: "4 hours ago", avatar: "/user5.png" },
    { id: 3, user: "Sarah Parker", action: "Uploaded documents", time: "Yesterday", avatar: "/user6.png" },
  ];

  const handleMouseMove = (e) => {
    const svg = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svg.left;
    const y = e.clientY - svg.top;

    const segmentWidth = svg.width / (monthlyData.length - 1);
    const index = Math.min(
      Math.max(Math.round(x / segmentWidth), 0),
      monthlyData.length - 1
    );
    const dataPoint = monthlyData[index];

    setTooltip({
      visible: true,
      x: x + 10,
      y: y - 10,
      month: dataPoint.month,
      value: `$${dataPoint.income}k`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <AdminLayout>
    {/* <Profile/> */}
      <div className="bg-gray-50 min-h-screen">


        {/* Time Filter */}
        <div className="max-w-full">
          <div className="bg-white rounded-lg shadow-sm p-2 inline-flex">
            {['day', 'week', 'month', 'year'].map(filter => (
              <button 
                key={filter}
                className={`px-4 py-2 text-sm rounded-md ${timeFilter === filter ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-full">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { title: "Total Revenue", value: "$45,231", change: "+20.1%", changeType: "positive", icon: "💰" },
              { title: "Active Users", value: "3,891", change: "+10.6%", changeType: "positive", icon: "👥" },
              { title: "New Customers", value: "1,124", change: "-0.4%", changeType: "negative", icon: "🔔" },
              { title: "Pending Orders", value: "159", change: "+4.3%", changeType: "positive", icon: "📦" },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart Section */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Financial Overview</h2>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-xs text-gray-600">Income</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-xs text-gray-600">Expenses</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs text-gray-600">Profit</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Circular Charts Section */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Sales Distribution</h2>
              <div className="grid grid-cols-3 gap-4">
                {pieData.map((entry, index) => (
                  <div key={`pie-${index}`} className="flex flex-col items-center">
                    <div className="relative h-24 w-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[{ value: 100 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={38}
                            fill="#f3f4f6"
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                          />
                          <Pie
                            data={[{ value: entry.value }, { value: 100 - entry.value }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={38}
                            fill="transparent"
                            dataKey="value"
                            startAngle={90}
                            endAngle={90 + 360 * (entry.value / 100)}
                          >
                            <Cell fill={entry.color} />
                            <Cell fill="transparent" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{entry.value}%</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 mt-2">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row - Traffic & Visitors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Traffic Sources */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Traffic Sources</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {trafficData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={trafficColors[index % trafficColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {trafficData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: trafficColors[index] }}></div>
                      <span className="text-sm text-gray-600 flex-1">{item.name}</span>
                      <span className="text-sm font-medium">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visitor Statistics */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Visitor Statistics</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Third Row - Regional Data & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Regional Sales Data */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Regional Sales</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={regionColors[index % regionColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conversion Rates */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Conversion Rates</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Team Performance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} />
                    <Radar name="This Year" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Last Year" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Fourth Row - Scatter Plot & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Market Analysis */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Market Analysis</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Sales" unit="k" />
                    <YAxis type="number" dataKey="y" name="Revenue" unit="k" />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} name="Volume" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Markets" data={scatterData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <button className="text-sm text-blue-500">View all</button>
              </div>
              <div className="space-y-4">
                {[...userActivities, 
                  { id: 4, user: "Michael Brown", action: "Approved purchase order #2354", time: "2 days ago", avatar: "/user1.png" },
                  { id: 5, user: "Lisa Johnson", action: "Completed quarterly report", time: "3 days ago", avatar: "/user2.png" },
                  { id: 6, user: "David Wilson", action: "Updated inventory status", time: "1 week ago", avatar: "/user3.png" }
                ].map(activity => (
                  <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                    <img src={activity.avatar} alt={activity.user} className="w-10 h-10 rounded-full mr-4" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{activity.user}</h4>
                      <p className="text-xs text-gray-500">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fifth Row - Bar Chart & World Map Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Category Performance */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Category Performance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* World Map Placeholder */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Global Sales Distribution</h2>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <img src="/globe.png" alt="globe" />
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