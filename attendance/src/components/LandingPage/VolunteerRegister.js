import React, { useState, useEffect } from 'react'
import { path } from '../../path'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';

const axios = require('axios')

const VolunteerRegister = () => {
    const [name, setname] = useState("");
    const [roll, setroll] = useState("");
    const [email, setemail] = useState("");
    const [contact, setcontact] = useState("");
    const [course, setcourse] = useState("");
    const [dept, setdept] = useState("");
    const [sem, setsem] = useState("");
    const [year, setyear] = useState("");
    const [pwd, setpwd] = useState("");
    const [cpwd, setcpwd] = useState("");
    const navigate = useNavigate();
    
    const btechDept = [['CSE', 'Computer Science & Engineering'], ['ECE', 'Electronics & Communication Engineering'], ['EEE', 'Electrical & Electronics Engineering'], ['ME', 'Mechanical Engineering'], ['CE', 'Civil Engineering']];
    const mtechDept = [['CSE', 'Computer Science & Engineering'], ['ECE', 'Electronics & Communication Engineering']];
    
    const handleCourseChange = (e) => {
        setcourse(e.target.value)
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

        if (name.length && roll.length && course.length && dept.length && sem.length && year.length && email.length && (pwd === cpwd)) {
            axios.post(`${path}/registerVolunteer`, {
                roll: roll,
                name: name,
                email: email,
                contact: contact,
                course: course,
                year: year,
                branch: dept,
                semester: sem,
                password: pwd
            })
                .then(function (response) {
                    if (response.status == 203) {
                        toast.error(response.data.msg);
                    }
                    else{
                        localStorage.setItem('token', response.data.res);
                        localStorage.setItem('type', "volunteer");
                        toast.success("Welcome to PICT NSS! 🎉 Check your email for credentials.");
                        setTimeout(() => {
                            navigate('/volunteer')
                        }, 3000);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            toast.warn("Please fill all the details carefully and ensure passwords match!")
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
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
                <div className="max-w-4xl mx-auto">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                        <h1 className="text-3xl font-bold mb-2">Join PICT NSS Club</h1>
                        <p className="text-blue-100 text-lg">Become a volunteer and make a difference in your community</p>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Volunteer Registration</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Personal Information</h3>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Roll Number *
                                    </label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        id="roll"
                                        name='roll'
                                        type="text"
                                        value={roll}
                                        onChange={(e) => setroll(e.target.value)}
                                        placeholder="e.g. B200060CS"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                        id="name"
                                        name='name'
                                        type="text"
                                        value={name}
                                        onChange={(e) => setname(e.target.value)}
                                        placeholder="Your full name"
                                    />
                                </div>

                                {/* Academic Information */}
                                <div className="md:col-span-2 mt-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Academic Information</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course *
                                    </label>
                                    <select 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                        id="course" 
                                        value={course} 
                                        onChange={handleCourseChange} 
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        <option value="btech">B-Tech</option>
                                        <option value="mtech">M-Tech</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department *
                                    </label>
                                    <select 
                                        required 
                                        id="dept"
                                        name='dept'
                                        value={dept}
                                        onChange={(e) => setdept(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Select Department</option>
                                        {course === 'btech' && btechDept.map((dept) => (
                                            <option key={dept[0]} value={dept[0]}>{dept[1]}</option>
                                        ))}
                                        {course === 'mtech' && mtechDept.map((dept) => (
                                            <option key={dept[0]} value={dept[0]}>{dept[1]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Year *
                                    </label>
                                    <select 
                                        required
                                        id="year"
                                        name='year'
                                        value={year}
                                        onChange={(e) => setyear(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Semester *
                                    </label>
                                    <select 
                                        required
                                        id="sem"
                                        name='sem'
                                        value={sem}
                                        onChange={(e) => setsem(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Select Semester</option>
                                        <option value="1">1st Semester</option>
                                        <option value="2">2nd Semester</option>
                                        <option value="3">3rd Semester</option>
                                        <option value="4">4th Semester</option>
                                        <option value="5">5th Semester</option>
                                        <option value="6">6th Semester</option>
                                        <option value="7">7th Semester</option>
                                        <option value="8">8th Semester</option>
                                    </select>
                                </div>

                                {/* Contact Information */}
                                <div className="md:col-span-2 mt-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Contact Information</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        id="email"
                                        required
                                        type="email"
                                        value={email}
                                        name='email'
                                        onChange={(e) => setemail(e.target.value)}
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Number
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                        id="contact"
                                        name='contact'
                                        type="text"
                                        value={contact}
                                        onChange={(e) => setcontact(e.target.value)}
                                        placeholder="10-digit mobile number"
                                    />
                                </div>

                                {/* Security */}
                                <div className="md:col-span-2 mt-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Security</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        id="c_password"
                                        type="password"
                                        required
                                        name='cpwd'
                                        onChange={(e) => setcpwd(e.target.value)}
                                        placeholder="Re-enter your password"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    Join PICT NSS
                                </button>
                            </div>

                            <div className="text-center mt-6">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
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

export default VolunteerRegister