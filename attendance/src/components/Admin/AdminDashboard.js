import React, { useState, useEffect } from 'react'
import Header from '../header/Header'
import { useNavigate } from 'react-router-dom';
import { path } from '../../path'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const axios = require('axios')

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalActivities: 0,
    pendingWork: 0,
    monthlyHours: 0
  });
  const [topPerformers, setTopPerformers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getDashboardStats = async () => {
    try {
      // Get current month and year
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // Get top performers
      const performersResponse = await axios.post(`${path}/getTopPerformers`, {
        month: month,
        year: year,
        limit: 5
      });

      if (performersResponse.status === 200) {
        setTopPerformers(performersResponse.data.data);
      }

      // Get recent activities
      const activitiesResponse = await axios.post(`${path}/getActivities`, {
        page: 1,
        limit: 5
      });

      if (activitiesResponse.status === 200) {
        setRecentActivities(activitiesResponse.data.data);
      }

      // Mock stats (you can replace with actual API calls)
      setStats({
        totalVolunteers: 150,
        totalActivities: 25,
        pendingWork: 12,
        monthlyHours: 480
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    getDashboardStats();
  }, []);

  const departmentData = [
    { name: 'CSE', hours: 120 },
    { name: 'ECE', hours: 95 },
    { name: 'EEE', hours: 75 },
    { name: 'ME', hours: 60 },
    { name: 'CE', hours: 45 }
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-green-100">Manage PICT NSS volunteers and activities</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <p className="text-sm">Online Volunteers</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Volunteers</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalVolunteers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 text-xl">📅</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Activities</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalActivities}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-600 text-xl">⏳</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Work</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pendingWork}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 text-xl">⏱️</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Monthly Hours</p>
                <p className="text-2xl font-bold text-gray-800">{stats.monthlyHours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Performers This Month</h2>
              <button 
                onClick={() => navigate('/reports')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>

            {topPerformers.length > 0 ? (
              <div className="space-y-4">
                {topPerformers.map((volunteer, index) => (
                  <div key={volunteer.volunteer_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{volunteer.name}</h3>
                        <p className="text-sm text-gray-600">{volunteer.volunteer_id} • {volunteer.branch}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{volunteer.total_hours} hrs</p>
                      <p className="text-sm text-gray-600">
                        {volunteer.activity_hours}A + {volunteer.work_hours}W
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">🏆</div>
                <p className="text-gray-500">No performance data available</p>
                <p className="text-gray-400 text-sm">Track activities to see rankings</p>
              </div>
            )}
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Department-wise Hours</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
            <button 
              onClick={() => navigate('/activities')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {recentActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {activity.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>📅 {new Date(activity.activity_date).toLocaleDateString()}</span>
                    <span>⏱️ {activity.duration_hours}h</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <p className="text-gray-500">No recent activities</p>
              <p className="text-gray-400 text-sm">Create new activities to get started</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => navigate('/activities')}
            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Manage Activities</h3>
            <p className="text-gray-600 text-sm">Create and manage NSS activities and events</p>
          </button>

          <button 
            onClick={() => navigate('/mark-attendance')}
            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-green-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Mark Attendance</h3>
            <p className="text-gray-600 text-sm">Take attendance for activities and events</p>
          </button>

          <button 
            onClick={() => navigate('/individual-work')}
            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <span className="text-purple-600 text-xl">💼</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Assign Work</h3>
            <p className="text-gray-600 text-sm">Assign individual tasks to volunteers</p>
          </button>

          <button 
            onClick={() => navigate('/reports')}
            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-orange-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <span className="text-orange-600 text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">View Reports</h3>
            <p className="text-gray-600 text-sm">Analytics and volunteer performance reports</p>
          </button>
        </div>

        {/* Super Admin Only Section */}
        {localStorage.getItem('type') === 'super_admin' && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Super Admin Controls</h3>
                <p className="text-yellow-700">Manage admin accounts and system settings</p>
              </div>
              <button 
                onClick={() => navigate('/admin-management')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Admins
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard