import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import { ToastContainer, toast } from 'react-toastify';
import { path } from '../../path'
import jwt_decode from "jwt-decode";

const axios = require('axios')

const VolunteerAttendance = () => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, present, absent
    
    let volunteer = null;
    if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        volunteer = jwt_decode(token);
    }

    const getMyAttendance = async () => {
        if (volunteer) {
            axios.post(`${path}/getMyAttendance`, { volunteer_id: volunteer.volunteer_id })
                .then(function (response) {
                    console.log("Attendance Response: ", response);
                    if (response.status === 200) {
                        setAttendance(response.data.data || []);
                    }
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                    toast.error("Failed to load attendance records");
                });
        }
    }

    useEffect(() => {
        getMyAttendance();
    }, []);

    const filteredAttendance = attendance.filter(record => {
        if (filter === 'all') return true;
        return record.status === filter;
    });

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
        if (status === 'present') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (status === 'absent') {
            return `${baseClasses} bg-red-100 text-red-800`;
        }
        return `${baseClasses} bg-gray-100 text-gray-800`;
    };

    const getActivityTypeIcon = (category) => {
        const icons = {
            'Social Service': '🤝',
            'Awareness Campaign': '📢',
            'Cleanliness Drive': '🧹',
            'Tree Plantation': '🌳',
            'Blood Donation': '🩸',
            'Other': '📅'
        };
        return icons[category] || '📅';
    };

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
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">My Attendance</h1>
                    <p className="text-blue-100">Track your participation in NSS activities</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header with Stats */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
                                <p className="text-gray-600 mt-1">
                                    Total Activities: <span className="font-semibold">{attendance.length}</span> • 
                                    Present: <span className="font-semibold text-green-600">
                                        {attendance.filter(a => a.status === 'present').length}
                                    </span> • 
                                    Absent: <span className="font-semibold text-red-600">
                                        {attendance.filter(a => a.status === 'absent').length}
                                    </span>
                                </p>
                            </div>
                            
                            {/* Filter Buttons */}
                            <div className="flex space-x-2 mt-4 md:mt-0">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filter === 'all' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('present')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filter === 'present' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Present
                                </button>
                                <button
                                    onClick={() => setFilter('absent')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filter === 'absent' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Absent
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Attendance List */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredAttendance.length > 0 ? (
                            <div className="space-y-4">
                                {filteredAttendance.map((record) => (
                                    <div key={record.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            {/* Activity Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xl">
                                                            {getActivityTypeIcon(record.category)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-800">
                                                                {record.name}
                                                            </h3>
                                                            <span className={getStatusBadge(record.status)}>
                                                                {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                                                            </span>
                                                        </div>
                                                        
                                                        {record.description && (
                                                            <p className="text-gray-600 mb-3">
                                                                {record.description}
                                                            </p>
                                                        )}
                                                        
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                📅 {new Date(record.activity_date).toLocaleDateString('en-IN', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="flex items-center">
                                                                ⏱️ {record.duration_hours} hours
                                                            </span>
                                                            {record.location && (
                                                                <span className="flex items-center">
                                                                    📍 {record.location}
                                                                </span>
                                                            )}
                                                            {record.category && (
                                                                <span className="flex items-center">
                                                                    🏷️ {record.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status and Hours */}
                                            <div className="mt-4 lg:mt-0 lg:text-right">
                                                <div className={`text-2xl font-bold ${
                                                    record.status === 'present' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {record.status === 'present' ? record.duration_hours : 0} hrs
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {record.status === 'present' ? 'Credited' : 'Not Credited'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    {filter === 'all' ? 'No Attendance Records' : `No ${filter} Records`}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {filter === 'all' 
                                        ? "You haven't attended any activities yet." 
                                        : `You don't have any ${filter} records.`
                                    }
                                </p>
                                {filter !== 'all' && (
                                    <button
                                        onClick={() => setFilter('all')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        View All Records
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Card */}
                {attendance.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {attendance.length}
                            </div>
                            <p className="text-gray-600">Total Activities</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {attendance.filter(a => a.status === 'present').length}
                            </div>
                            <p className="text-gray-600">Present</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">
                                {attendance.filter(a => a.status === 'absent').length}
                            </div>
                            <p className="text-gray-600">Absent</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VolunteerAttendance