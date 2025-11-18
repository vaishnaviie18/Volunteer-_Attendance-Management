import React, { useState } from 'react'
import { path } from '../../path'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../header/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const axios = require('axios')

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.warn("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${path}/forgotPassword`, { email: email });
            
            if (response.status === 200) {
                toast.success("Password reset link sent to your email! Check your inbox.");
                setEmail("");
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 203) {
                toast.error(error.response.data.msg);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
            <Header />
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <div className="flex justify-center items-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <Link 
                        to="/" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
                    >
                        <ArrowBackIcon className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>

                    {/* Password Reset Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl">🔒</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
                            <p className="text-orange-100 mt-2">Enter your email to receive reset instructions</p>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            <form className="space-y-6" onSubmit={handleForgotPassword}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        placeholder="Enter your registered email"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        We'll send a password reset link to this email
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending Reset Link...
                                        </div>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>

                            {/* Additional Info */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start">
                                    <div className="text-blue-500 text-lg mr-3">💡</div>
                                    <div>
                                        <h4 className="font-medium text-blue-800 text-sm">Didn't receive the email?</h4>
                                        <ul className="text-blue-700 text-xs mt-1 space-y-1">
                                            <li>• Check your spam or junk folder</li>
                                            <li>• Make sure you entered the correct email</li>
                                            <li>• Wait a few minutes and try again</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Need help?{' '}
                            <a href="mailto:support@pictnss.edu" className="text-blue-600 hover:text-blue-700 font-medium">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword