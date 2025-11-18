import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import { ToastContainer, toast } from 'react-toastify';
import { path } from '../../path'
import jwt_decode from "jwt-decode";

const axios = require('axios')

const MyWork = () => {
    const navigate = useNavigate();
    const [work, setWork] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    
    let volunteer = null;
    if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        volunteer = jwt_decode(token);
    }

    const workTypes = {
        'design': { label: 'Design', color: 'bg-purple-100 text-purple-800', icon: '🎨' },
        'content': { label: 'Content', color: 'bg-blue-100 text-blue-800', icon: '📝' },
        'video': { label: 'Video', color: 'bg-red-100 text-red-800', icon: '🎬' },
        'coordination': { label: 'Coordination', color: 'bg-green-100 text-green-800', icon: '🤝' },
        'documentation': { label: 'Documentation', color: 'bg-yellow-100 text-yellow-800', icon: '📋' },
        'other': { label: 'Other', color: 'bg-gray-100 text-gray-800', icon: '💼' }
    };

    const getMyWork = async () => {
        if (volunteer) {
            axios.post(`${path}/getMyWork`, { volunteer_id: volunteer.volunteer_id })
                .then(function (response) {
                    console.log("Work Response: ", response);
                    if (response.status === 200) {
                        setWork(response.data.data || []);
                    }
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                    toast.error("Failed to load work records");
                });
        }
    }

    useEffect(() => {
        getMyWork();
    }, []);

    const filteredWork = work.filter(record => {
        if (filter === 'all') return true;
        return record.work_type === filter;
    });

    const getTotalHours = () => {
        return work.reduce((total, record) => total + parseFloat(record.hours_spent), 0);
    };

    const getWorkTypeStats = () => {
        const stats = {};
        work.forEach(record => {
            if (!stats[record.work_type]) {
                stats[record.work_type] = 0;
            }
            stats[record.work_type] += parseFloat(record.hours_spent);
        });
        return stats;
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
                <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">My Individual Work</h1>
                    <p className="text-green-100">Track your assigned tasks and contributions</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header with Stats */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Work Assignments</h2>
                                <p className="text-gray-600 mt-1">
                                    Total Tasks: <span className="font-semibold">{work.length}</span> • 
                                    Total Hours: <span className="font-semibold text-green-600">{getTotalHours().toFixed(1)} hrs</span>
                                </p>
                            </div>
                            
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                        filter === 'all' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All Work
                                </button>
                                {Object.entries(workTypes).map(([type, info]) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(type)}
                                        className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                            filter === type 
                                            ? `${info.color.replace('bg-', 'bg-').replace('text-', 'text-')}` 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {info.icon} {info.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Work List */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            </div>
                        ) : filteredWork.length > 0 ? (
                            <div className="space-y-6">
                                {filteredWork.map((record) => (
                                    <div key={record.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                            {/* Work Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-4">
                                                    <div className={`w-12 h-12 ${workTypes[record.work_type]?.color.replace('text-', 'bg-').split(' ')[0]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                        <span className="text-xl">
                                                            {workTypes[record.work_type]?.icon}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${workTypes[record.work_type]?.color}`}>
                                                                {workTypes[record.work_type]?.label}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                📅 {new Date(record.work_date).toLocaleDateString('en-IN', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                            {record.description || `${workTypes[record.work_type]?.label} Work`}
                                                        </h3>
                                                        
                                                        {record.description && record.description.length > 100 && (
                                                            <p className="text-gray-600">
                                                                {record.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hours and Status */}
                                            <div className="mt-4 lg:mt-0 lg:text-right lg:pl-4">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {record.hours_spent} hrs
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Assigned by Admin
                                                </p>
                                                <div className="mt-2 text-xs text-gray-400">
                                                    Added: {new Date(record.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">💼</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    {filter === 'all' ? 'No Work Assignments' : `No ${workTypes[filter]?.label} Work`}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {filter === 'all' 
                                        ? "You haven't been assigned any individual work yet." 
                                        : `You don't have any ${workTypes[filter]?.label.toLowerCase()} assignments.`
                                    }
                                </p>
                                {filter !== 'all' && (
                                    <button
                                        onClick={() => setFilter('all')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        View All Work
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Work Type Breakdown */}
                {work.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Work Type Breakdown</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {Object.entries(getWorkTypeStats()).map(([type, hours]) => (
                                <div key={type} className="text-center p-4 border border-gray-200 rounded-lg">
                                    <div className={`w-12 h-12 ${workTypes[type]?.color.replace('text-', 'bg-').split(' ')[0]} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                        <span className="text-xl">{workTypes[type]?.icon}</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">{hours.toFixed(1)}h</div>
                                    <div className="text-sm text-gray-600">{workTypes[type]?.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyWork