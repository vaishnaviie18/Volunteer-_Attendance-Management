import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import { ToastContainer, toast } from 'react-toastify';
import { path } from '../../path'
import jwt_decode from "jwt-decode";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const axios = require('axios')

const MyStatistics = () => {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    
    let volunteer = null;
    if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        volunteer = jwt_decode(token);
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

    const workTypes = {
        'design': { label: 'Design', color: '#8884D8' },
        'content': { label: 'Content', color: '#0088FE' },
        'video': { label: 'Video', color: '#FF6B6B' },
        'coordination': { label: 'Coordination', color: '#00C49F' },
        'documentation': { label: 'Documentation', color: '#FFBB28' },
        'other': { label: 'Other', color: '#FF8042' }
    };

    const getMyStatistics = async () => {
        if (volunteer) {
            axios.post(`${path}/getMyStatistics`, { volunteer_id: volunteer.volunteer_id })
                .then(function (response) {
                    console.log("Statistics Response: ", response);
                    if (response.status === 200) {
                        setStatistics(response.data.data);
                    }
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                    toast.error("Failed to load statistics");
                });
        }
    }

    useEffect(() => {
        getMyStatistics();
    }, []);

    const prepareWorkData = () => {
        if (!statistics?.work_breakdown) return [];
        
        return Object.entries(statistics.work_breakdown).map(([type, data]) => ({
            name: workTypes[type]?.label || type,
            hours: data.hours,
            color: workTypes[type]?.color || '#8884D8'
        }));
    };

    const prepareActivityData = () => {
        if (!statistics) return [];
        
        return [
            { name: 'Activity Hours', hours: statistics.activity_hours || 0, color: '#00C49F' },
            { name: 'Work Hours', hours: statistics.work_hours || 0, color: '#0088FE' }
        ];
    };

    const getPerformanceLevel = () => {
        const totalHours = statistics?.total_hours || 0;
        if (totalHours >= 50) return { level: 'Elite', color: 'text-purple-600', bg: 'bg-purple-100' };
        if (totalHours >= 30) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-100' };
        if (totalHours >= 15) return { level: 'Intermediate', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (totalHours >= 5) return { level: 'Beginner', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { level: 'New Volunteer', color: 'text-gray-600', bg: 'bg-gray-100' };
    };

    const performance = getPerformanceLevel();

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">My Statistics</h1>
                    <p className="text-purple-100">Comprehensive overview of your NSS contributions</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : statistics ? (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {statistics.total_hours?.toFixed(1) || 0}
                                </div>
                                <p className="text-gray-600">Total Hours</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {statistics.activity_hours?.toFixed(1) || 0}
                                </div>
                                <p className="text-gray-600">Activity Hours</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {statistics.work_hours?.toFixed(1) || 0}
                                </div>
                                <p className="text-gray-600">Work Hours</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {statistics.activities_attended || 0}
                                </div>
                                <p className="text-gray-600">Activities Attended</p>
                            </div>
                        </div>

                        {/* Performance Level */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">Your Performance Level</h2>
                                    <p className="text-gray-600">
                                        Based on your total volunteer hours and contributions
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-full font-semibold ${performance.bg} ${performance.color}`}>
                                    {performance.level}
                                </div>
                            </div>
                            <div className="mt-4 bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                                    style={{ 
                                        width: `${Math.min((statistics.total_hours / 50) * 100, 100)}%` 
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>0 hrs</span>
                                <span>25 hrs</span>
                                <span>50+ hrs</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Hours Distribution */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Hours Distribution</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={prepareActivityData()}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="hours"
                                            >
                                                {prepareActivityData().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Work Type Breakdown */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Work Type Breakdown</h2>
                                {prepareWorkData().length > 0 ? (
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={prepareWorkData()}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                                                <Legend />
                                                <Bar dataKey="hours" fill="#8884d8">
                                                    {prepareWorkData().map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-gray-400 text-6xl mb-4">📊</div>
                                            <p className="text-gray-500">No individual work data available</p>
                                            <p className="text-gray-400 text-sm">Complete assigned tasks to see breakdown</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Detailed Breakdown</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Activity Summary */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                        Activity Summary
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Activities:</span>
                                            <span className="font-semibold">{statistics.activities_attended || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Hours:</span>
                                            <span className="font-semibold text-green-600">{statistics.activity_hours?.toFixed(1) || 0} hrs</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Average per Activity:</span>
                                            <span className="font-semibold">
                                                {statistics.activities_attended > 0 
                                                    ? (statistics.activity_hours / statistics.activities_attended).toFixed(1) 
                                                    : 0
                                                } hrs
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Work Summary */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                                        Work Summary
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Work Types:</span>
                                            <span className="font-semibold">
                                                {statistics.work_breakdown ? Object.keys(statistics.work_breakdown).length : 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Hours:</span>
                                            <span className="font-semibold text-blue-600">{statistics.work_hours?.toFixed(1) || 0} hrs</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Average per Task:</span>
                                            <span className="font-semibold">
                                                {statistics.work_breakdown && Object.keys(statistics.work_breakdown).length > 0
                                                    ? (statistics.work_hours / Object.values(statistics.work_breakdown).reduce((sum, data) => sum + data.count, 0)).toFixed(1)
                                                    : 0
                                                } hrs
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📈</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Statistics Available</h3>
                        <p className="text-gray-500 mb-6">
                            Start participating in activities and completing tasks to see your statistics.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/my-attendance')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                View Activities
                            </button>
                            <button
                                onClick={() => navigate('/my-work')}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                View Work
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyStatistics