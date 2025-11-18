import React, { useState, useEffect } from 'react'
import Header from '../header/Header'
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { path } from '../../path'

const axios = require('axios')

const Reports = () => {
    const [topPerformers, setTopPerformers] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [campEligibility, setCampEligibility] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [loading, setLoading] = useState(false);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE'];
    const years = [2024, 2023, 2022];

    const getTopPerformers = async () => {
        setLoading(true);
        try {
            const currentDate = new Date();
            const response = await axios.post(`${path}/getTopPerformers`, {
                month: currentDate.getMonth() + 1,
                year: currentDate.getFullYear(),
                limit: 10
            });
            if (response.status === 200) {
                setTopPerformers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching top performers:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDepartmentWiseReport = async () => {
        try {
            const response = await axios.post(`${path}/getDepartmentWiseReport`, {
                year: selectedYear,
                department: selectedDepartment
            });
            if (response.status === 200) {
                // Process data for charts
                const deptStats = departments.map(dept => {
                    const deptData = response.data.data.filter(v => v.branch === dept);
                    const totalHours = deptData.reduce((sum, v) => sum + (parseFloat(v.total_hours) || 0), 0);
                    const avgHours = deptData.length > 0 ? totalHours / deptData.length : 0;
                    
                    return {
                        name: dept,
                        hours: totalHours,
                        avgHours: parseFloat(avgHours.toFixed(1)),
                        volunteers: deptData.length
                    };
                });
                setDepartmentData(deptStats);
            }
        } catch (error) {
            console.error('Error fetching department report:', error);
        }
    };

    const getCampEligibility = async () => {
        try {
            const response = await axios.post(`${path}/getCampEligibilityList`);
            if (response.status === 200) {
                setCampEligibility(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching camp eligibility:', error);
        }
    };

    useEffect(() => {
        getTopPerformers();
        getDepartmentWiseReport();
        getCampEligibility();
    }, [selectedYear, selectedDepartment]);

    const monthlyData = [
        { month: 'Jan', hours: 120, activities: 8 },
        { month: 'Feb', hours: 180, activities: 12 },
        { month: 'Mar', hours: 150, activities: 10 },
        { month: 'Apr', hours: 220, activities: 15 },
        { month: 'May', hours: 190, activities: 13 },
        { month: 'Jun', hours: 160, activities: 11 }
    ];

    const workTypeDistribution = [
        { name: 'Activities', value: 65 },
        { name: 'Design', value: 15 },
        { name: 'Content', value: 10 },
        { name: 'Coordination', value: 8 },
        { name: 'Other', value: 2 }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
                    <p className="text-orange-100">Comprehensive insights into NSS volunteer performance</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                            <select 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}-{year+1}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <select 
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Department Performance */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Department Performance</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="hours" name="Total Hours" fill="#8884d8" />
                                    <Bar dataKey="avgHours" name="Avg Hours/Volunteer" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Work Type Distribution */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Work Type Distribution</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={workTypeDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {workTypeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Activity Trend</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="hours" name="Total Hours" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="activities" name="Activities" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Performers & Camp Eligibility */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Performers */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Top 10 Performers</h2>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                            </div>
                        ) : (
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
                        )}
                    </div>

                    {/* Camp Eligibility Preview */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Camp Eligibility Preview</h2>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Top 50 Qualify
                            </span>
                        </div>
                        <div className="space-y-3">
                            {campEligibility.slice(0, 10).map((volunteer, index) => (
                                <div key={volunteer.volunteer_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                            index < 3 ? 'bg-green-500' : 'bg-blue-500'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800 text-sm">{volunteer.name}</h3>
                                            <p className="text-xs text-gray-600">{volunteer.volunteer_id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800 text-sm">{volunteer.total_hours} hrs</p>
                                    </div>
                                </div>
                            ))}
                            {campEligibility.length > 10 && (
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        ... and {campEligibility.length - 10} more volunteers
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Total eligible: {Math.min(campEligibility.length, 50)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="text-2xl font-bold mb-2">{departmentData.reduce((sum, dept) => sum + dept.volunteers, 0)}</div>
                        <div className="text-blue-100 text-sm">Total Volunteers</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="text-2xl font-bold mb-2">{departmentData.reduce((sum, dept) => sum + dept.hours, 0)}</div>
                        <div className="text-green-100 text-sm">Total Hours</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="text-2xl font-bold mb-2">{Math.min(campEligibility.length, 50)}</div>
                        <div className="text-purple-100 text-sm">Camp Eligible</div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                        <div className="text-2xl font-bold mb-2">
                            {departmentData.length > 0 ? (departmentData.reduce((sum, dept) => sum + dept.hours, 0) / departmentData.reduce((sum, dept) => sum + dept.volunteers, 0)).toFixed(1) : '0'}
                        </div>
                        <div className="text-orange-100 text-sm">Avg Hours/Volunteer</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reports