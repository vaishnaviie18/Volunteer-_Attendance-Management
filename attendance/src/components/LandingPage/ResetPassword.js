import React, { useState, useEffect } from 'react'
import { path } from '../../path'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '../header/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const axios = require('axios')

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            toast.error("Invalid or missing reset token");
        }
    }, [token]);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return { strength: 0, text: '', color: '' };
        if (password.length < 8) return { strength: 1, text: 'Weak', color: 'bg-red-500' };
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
        
        if (strength === 1) return { strength: 25, text: 'Weak', color: 'bg-red-500' };
        if (strength === 2) return { strength: 50, text: 'Fair', color: 'bg-orange-500' };
        if (strength === 3) return { strength: 75, text: 'Good', color: 'bg-yellow-500' };
        return { strength: 100, text: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!newPassword || !confirmPassword) {
            toast.warn("Please fill in both password fields");
            return;
        }

        if (!validatePassword(newPassword)) {
            toast.warn("Password must be at least 8 characters with uppercase, lowercase, number, and special character!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warn("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${path}/resetPassword`, {
                token: token,
                newPassword: newPassword
            });
            
            if (response.status === 200) {
                toast.success("Password reset successfully! You can now login with your new password.");
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 203) {
                toast.error(error.response.data.msg);
                setTokenValid(false);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (!tokenValid) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
                <Header />
                <div className="flex justify-center items-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <div className="text-red-500 text-6xl mb-4">❌</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
                            <p className="text-gray-600 mb-6">
                                This password reset link is invalid or has expired. Please request a new reset link.
                            </p>
                            <Link 
                                to="/forgot-password"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                            >
                                Request New Link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                        to="/forgot-password" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
                    >
                        <ArrowBackIcon className="w-4 h-4 mr-2" />
                        Back to Reset Request
                    </Link>

                    {/* Password Reset Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl">🔑</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white">Create New Password</h1>
                            <p className="text-green-100 mt-2">Choose a strong and secure password</p>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            <form className="space-y-6" onSubmit={handleResetPassword}>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        placeholder="Enter your new password"
                                    />
                                    
                                    {/* Password Strength Meter */}
                                    {newPassword && (
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600">Password Strength</span>
                                                <span className={`font-medium ${
                                                    passwordStrength.text === 'Weak' ? 'text-red-600' :
                                                    passwordStrength.text === 'Fair' ? 'text-orange-600' :
                                                    passwordStrength.text === 'Good' ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                    {passwordStrength.text}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${passwordStrength.strength}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Password Requirements */}
                                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                                        <div className={`flex items-center ${newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                                            {newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                                        </div>
                                        <div className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}`}>
                                            {/[A-Z]/.test(newPassword) ? '✓' : '○'} Uppercase letter
                                        </div>
                                        <div className={`flex items-center ${/[a-z]/.test(newPassword) ? 'text-green-600' : ''}`}>
                                            {/[a-z]/.test(newPassword) ? '✓' : '○'} Lowercase letter
                                        </div>
                                        <div className={`flex items-center ${/\d/.test(newPassword) ? 'text-green-600' : ''}`}>
                                            {/\d/.test(newPassword) ? '✓' : '○'} Number
                                        </div>
                                        <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-600' : ''}`}>
                                            {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '✓' : '○'} Special character
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-colors ${
                                            confirmPassword && newPassword !== confirmPassword 
                                                ? 'border-red-300 focus:border-red-500' 
                                                : 'border-gray-300 focus:border-green-500'
                                        }`}
                                        placeholder="Confirm your new password"
                                    />
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !validatePassword(newPassword) || newPassword !== confirmPassword}
                                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Resetting Password...
                                        </div>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>

                            {/* Security Tips */}
                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-start">
                                    <div className="text-green-500 text-lg mr-3">🔒</div>
                                    <div>
                                        <h4 className="font-medium text-green-800 text-sm">Security Tips</h4>
                                        <ul className="text-green-700 text-xs mt-1 space-y-1">
                                            <li>• Use a unique password you haven't used elsewhere</li>
                                            <li>• Consider using a password manager</li>
                                            <li>• Never share your password with anyone</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword