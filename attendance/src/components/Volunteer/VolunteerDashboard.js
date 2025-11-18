import React, { useState, useEffect } from 'react'
import Header from '../header/Header'
import { path } from '../../path'
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const axios = require('axios')

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState(null);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = () => {
    try {
      const token = localStorage.getItem('token');
      const type = localStorage.getItem('type');
      
      // If no token or wrong user type, redirect to login
      if (!token || type !== 'volunteer') {
        console.log('No valid token found, redirecting to login');
        navigate('/');
        return;
      }

      // Try to get volunteer data from localStorage or use placeholder
      const volunteerData = localStorage.getItem('volunteerData');
      if (volunteerData) {
        try {
          const parsedData = JSON.parse(volunteerData);
          setVolunteer(parsedData);
        } catch (e) {
          console.error('Error parsing volunteer data:', e);
          setVolunteer({ name: 'Volunteer', volunteer_id: 'N/A' });
        }
      } else {
        setVolunteer({ name: 'Volunteer', volunteer_id: 'N/A' });
      }

      // Load data
      getUpcomingActivities();
      getStatistics();

    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication failed. Please login again.');
      setTimeout(() => navigate('/'), 2000);
    }
  }

  const getUpcomingActivities = async () => {
    try {
      // Use stored volunteer data or default values
      const volunteerData = localStorage.getItem('volunteerData');
      let branch = '', semester = '', course = '', year = '';
      
      if (volunteerData) {
        try {
          const parsed = JSON.parse(volunteerData);
          branch = parsed.branch || '';
          semester = parsed.semester || '';
          course = parsed.course || '';
          year = parsed.year || '';
        } catch (e) {
          console.error('Error parsing volunteer data for activities:', e);
        }
      }

      const response = await axios.post(`${path}/getVolunteerActivities`, {
        branch: branch,
        semester: semester,
        course: course,
        year: year
      });

      if (response.status === 200) {
        setActivities(response.data.data || []);
      } else {
        setActivities([]);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error fetching activities:', error);
      setActivities([]);
      setLoading(false);
    }
  }

  const getStatistics = async () => {
    try {
      const volunteerData = localStorage.getItem('volunteerData');
      let volunteerId = 'V001'; // Default fallback
      
      if (volunteerData) {
        try {
          const parsed = JSON.parse(volunteerData);
          volunteerId = parsed.volunteer_id || volunteerId;
        } catch (e) {
          console.error('Error parsing volunteer data for stats:', e);
        }
      }

      const response = await axios.post(`${path}/getMyStatistics`, { 
        volunteer_id: volunteerId 
      });

      if (response.status === 200) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching statistics:', error);
      // Continue without statistics
    }
  }

  const workTypeData = statistics?.work_breakdown ? 
    Object.entries(statistics.work_breakdown).map(([type, data]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      hours: data.hours
    })) : [];

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {volunteer?.name || 'Volunteer'}! 👋</h1>
              <p className="text-blue-100">Volunteer ID: <span className="font-mono bg-blue-700 px-2 py-1 rounded">{volunteer?.volunteer_id || 'N/A'}</span></p>
              {volunteer?.branch && volunteer?.year && (
                <p className="text-blue-100">{volunteer.branch} • Year {volunteer.year}</p>
              )}
            </div>
            <div className="mt-4 md:mt-0 bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm">Total Volunteer Hours</p>
              <p className="text-2xl font-bold">{statistics?.total_hours || 0} hrs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl">📅</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Activities Attended</p>
                <p className="text-2xl font-bold text-gray-800">{statistics?.activities_attended || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 text-xl">⏱️</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Activity Hours</p>
                <p className="text-2xl font-bold text-gray-800">{statistics?.activity_hours || 0} hrs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 text-xl">💼</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Work Hours</p>
                <p className="text-2xl font-bold text-gray-800">{statistics?.work_hours || 0} hrs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Activities</h2>
              <button 
                onClick={() => navigate('/my-attendance')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📅 {new Date(activity.activity_date).toLocaleDateString()}</span>
                          <span>⏱️ {activity.duration_hours} hrs</span>
                          <span>📍 {activity.location}</span>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <p className="text-gray-500">No upcoming activities</p>
                <p className="text-gray-400 text-sm">Check back later for new events</p>
              </div>
            )}
          </div>

          {/* Work Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Work Distribution</h2>
            
            {workTypeData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="hours"
                    >
                      {workTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <p className="text-gray-500">No work data available</p>
                <p className="text-gray-400 text-sm">Complete tasks to see your distribution</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button 
            onClick={() => navigate('/my-attendance')}
            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">My Attendance</h3>
            <p className="text-gray-600 text-sm">View your activity attendance records and status</p>
          </button>

          <button 
            onClick={() => navigate('/my-work')}
            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-green-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <span className="text-green-600 text-xl">💼</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">My Work</h3>
            <p className="text-gray-600 text-sm">Check your assigned individual work and hours</p>
          </button>

          <button 
            onClick={() => navigate('/my-statistics')}
            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <span className="text-purple-600 text-xl">📈</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">My Statistics</h3>
            <p className="text-gray-600 text-sm">Detailed analytics of your volunteer contributions</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default VolunteerDashboard