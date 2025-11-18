import React, { useState, useEffect } from 'react'
import Header from '../header/Header'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { path } from '../../path'

const axios = require('axios')

const MarkAttendance = () => {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState("");
    const [volunteers, setVolunteers] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [showAttendanceSheet, setShowAttendanceSheet] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Get all activities
    const getActivities = async () => {
        try {
            const response = await axios.post(`${path}/getActivities`, {
                page: 1,
                limit: 100
            });
            if (response.status === 200) {
                setActivities(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            toast.error('Failed to load activities');
        }
    };

    // Get volunteers for selected activity
    const getVolunteersForActivity = async () => {
        if (!selectedActivity) return;

        setLoading(true);
        try {
            // For now, we'll get all volunteers. In a real scenario, you might filter by department/year
            const activity = activities.find(a => a.id == selectedActivity);
            if (!activity) return;

            // Get all volunteers (you might want to filter by relevant criteria)
            const response = await axios.post(`${path}/getDepartmentWiseReport`, {
                // You can add filters here based on activity requirements
            });
            
            if (response.status === 200) {
                const volunteersList = response.data.data.map(volunteer => ({
                    ...volunteer,
                    status: 'absent' // Default status
                }));
                setVolunteers(volunteersList);
                setAttendance(volunteersList);
            }
        } catch (error) {
            console.error('Error fetching volunteers:', error);
            toast.error('Failed to load volunteers');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (volunteerId, status) => {
        setAttendance(prev => prev.map(volunteer => 
            volunteer.volunteer_id === volunteerId ? { ...volunteer, status } : volunteer
        ));
    };

    const handleSubmitAttendance = async () => {
        if (!selectedActivity) {
            toast.warn('Please select an activity first');
            return;
        }

        const attendanceData = attendance.map(volunteer => ({
            volunteer_id: volunteer.volunteer_id,
            status: volunteer.status
        }));

        try {
            await axios.post(`${path}/markAttendance`, {
                activity_id: selectedActivity,
                attendance: attendanceData
            });
            toast.success('Attendance marked successfully!');
            setShowAttendanceSheet(false);
            setSelectedActivity("");
            setVolunteers([]);
            setAttendance([]);
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast.error('Failed to mark attendance');
        }
    };

    const handleActivitySelect = (activityId) => {
        setSelectedActivity(activityId);
        setShowAttendanceSheet(true);
        getVolunteersForActivity();
    };

    useEffect(() => {
        getActivities();
    }, []);

    const selectedActivityData = activities.find(a => a.id == selectedActivity);

    return (
        <div className="min-h-screen bg-gray-50">
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
                    <h1 className="text-3xl font-bold mb-2">Mark Attendance</h1>
                    <p className="text-green-100">Record attendance for NSS activities and events</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Selection */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Select Activity</h2>
                            
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                            selectedActivity == activity.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                                        }`}
                                        onClick={() => handleActivitySelect(activity.id)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                                {activity.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>📅 {new Date(activity.activity_date).toLocaleDateString()}</span>
                                            <span>⏱️ {activity.duration_hours}h</span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            📍 {activity.location}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {activities.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-6xl mb-4">📅</div>
                                    <p className="text-gray-500">No activities available</p>
                                    <p className="text-gray-400 text-sm">Create activities first to mark attendance</p>
                                    <button 
                                        onClick={() => navigate('/activities')}
                                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Create Activity
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attendance Sheet */}
                    <div className="lg:col-span-2">
                        {showAttendanceSheet && selectedActivityData && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            Attendance for {selectedActivityData.name}
                                        </h2>
                                        <p className="text-gray-600">
                                            {new Date(selectedActivityData.activity_date).toLocaleDateString()} • 
                                            {selectedActivityData.location} • 
                                            {selectedActivityData.duration_hours} hours
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {attendance.filter(v => v.status === 'present').length} Present
                                        </span>
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                                            {attendance.filter(v => v.status === 'absent').length} Absent
                                        </span>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Volunteer
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Department
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Year
                                                        </th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {attendance.map((volunteer) => (
                                                        <tr key={volunteer.volunteer_id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {volunteer.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {volunteer.volunteer_id}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {volunteer.branch}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                Year {volunteer.year}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <div className="flex justify-center space-x-2">
                                                                    <button
                                                                        onClick={() => handleStatusChange(volunteer.volunteer_id, 'present')}
                                                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                                            volunteer.status === 'present'
                                                                                ? 'bg-green-500 text-white'
                                                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                        }`}
                                                                    >
                                                                        Present
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusChange(volunteer.volunteer_id, 'absent')}
                                                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                                            volunteer.status === 'absent'
                                                                                ? 'bg-red-500 text-white'
                                                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                                        }`}
                                                                    >
                                                                        Absent
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-8 flex justify-end space-x-4">
                                            <button
                                                onClick={() => {
                                                    setShowAttendanceSheet(false);
                                                    setSelectedActivity("");
                                                    setAttendance([]);
                                                }}
                                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSubmitAttendance}
                                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                                            >
                                                Submit Attendance
                                            </button>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    setAttendance(prev => prev.map(v => ({ ...v, status: 'present' })));
                                                }}
                                                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
                                            >
                                                Mark All Present
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAttendance(prev => prev.map(v => ({ ...v, status: 'absent' })));
                                                }}
                                                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
                                            >
                                                Mark All Absent
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {!showAttendanceSheet && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                                <div className="text-gray-400 text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select an Activity</h3>
                                <p className="text-gray-500">Choose an activity from the list to start marking attendance</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MarkAttendance