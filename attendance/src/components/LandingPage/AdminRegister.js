import React, { useState, useEffect } from 'react'
import { path } from '../../path'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';

const axios = require('axios')

const AdminRegister = () => {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [contact, setcontact] = useState("");
    const [dept, setdept] = useState("");
    const [pwd, setpwd] = useState("");
    const [cpwd, setcpwd] = useState("");
    const navigate = useNavigate();
    
    const Dept = [
        ['CSE', 'Computer Science & Engineering'], 
        ['ECE', 'Electronics & Communication Engineering'], 
        ['EEE', 'Electrical & Electronics Engineering'], 
        ['ME', 'Mechanical Engineering'], 
        ['CE', 'Civil Engineering']
    ];

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    const handleSubmit = async () => {
        if (!validatePassword(pwd)) {
            toast.warn("Password must be at least 8 characters with uppercase, lowercase, number, and special character!");
            return;
        }

        if (name.length && dept.length && email.length && (pwd === cpwd)) {
            axios.post(`${path}/registerAdmin`, {
                name: name,
                email: email,
                contact: contact,
                branch: dept,
                password: pwd
            })
                .then(function (response) {
                    if (response.status == 203) {
                        toast.error(response.data.msg);
                    }
                    else{
                        localStorage.setItem('token', response.data.res);
                        localStorage.setItem('type', "admin");
                        toast.success("Admin account created successfully! 🎉");
                        setTimeout(() => {
                            navigate('/admin')
                        }, 3000);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    toast.error("Registration failed. Please try again.");
                });
        }
        else {
            toast.warn("Please fill all the details carefully and ensure passwords match!")
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token') != null) {
            var profileType = localStorage.getItem('type');
            if (profileType == 'admin' || profileType == 'super_admin') {
                navigate('/admin');
            }
            else if (profileType == 'volunteer') {
                navigate('/volunteer');
            }
        }
    }, []);

    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
            <Header/>
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
                theme="light"
            />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                        <h1 className="text-3xl font-bold mb-2">Admin Registration</h1>
                        <p className="text-green-100 text-lg">Create admin account for PICT NSS Management</p>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Account Setup</h2>
                            
                            <div className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Personal Information</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            id="name"
                                            name='name'
                                            type="text"
                                            value={name}
                                            onChange={(e) => setname(e.target.value)}
                                            required
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department *
                                        </label>
                                        <select 
                                            required
                                            name='dept'
                                            value={dept}
                                            onChange={(e) => setdept(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        >
                                            <option value="">Select Department</option>
                                            {Dept.map((dept) => (
                                                <option key={dept[0]} value={dept[0]}>{dept[1]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Contact Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            value={email}
                                            name='email'
                                            onChange={(e) => setemail(e.target.value)}
                                            required
                                            type="email"
                                            placeholder="admin.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Number
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            id="contact"
                                            name='contact'
                                            type="text"
                                            value={contact}
                                            onChange={(e) => setcontact(e.target.value)}
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>

                                {/* Security */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Security</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password *
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            id="password"
                                            type="password"
                                            name='pwd'
                                            onChange={(e) => setpwd(e.target.value)}
                                            required
                                            placeholder="Minimum 8 characters"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Must include uppercase, lowercase, number, and special character</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password *
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            id="c_password"
                                            type="password"
                                            required
                                            name='cpwd'
                                            onChange={(e) => setcpwd(e.target.value)}
                                            placeholder="Re-enter your password"
                                        />
                                    </div>
                                </div>

                                {/* Admin Guidelines */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-800 mb-2">Admin Responsibilities</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Create and manage NSS activities</li>
                                        <li>• Mark attendance for events</li>
                                        <li>• Assign individual work to volunteers</li>
                                        <li>• Generate reports and analytics</li>
                                        <li>• Monitor volunteer performance</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    Create Admin Account
                                </button>
                            </div>

                            <div className="text-center mt-6">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <a href="/adminLogin" className="text-green-600 hover:text-green-700 font-medium">
                                        Login here
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminRegister