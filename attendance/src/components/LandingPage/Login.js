import * as React from 'react'
import LockIcon from '@mui/icons-material/Lock';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useState, useEffect } from 'react'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Link from '@mui/material/Link';
import { path } from '../../path'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header'

const axios = require('axios')

const Login = () => {
  const [value, setValue] = React.useState('1');
  const [roll, setroll] = useState("");
  const [email, setemail] = useState("");
  const [volunteerPwd, setvolunteerPwd] = useState("");
  const [adminPwd, setadminPwd] = useState("");
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleVolunteerLogin = (e) => {
    e.preventDefault();
    if (roll.length && volunteerPwd.length) {
      axios.post(`${path}/loginVolunteer`, {
        roll: roll,
        password: volunteerPwd
      })
        .then(function (response) {
          console.log("Volunteer Login Res: ", response);
          if (response.status === 203) {
            toast.error(response.data.msg);
          }
          else {
            toast.success("Welcome to PICT NSS! 🎉");
            
            // Store token and type
            localStorage.setItem('token', response.data.data.token || response.data.data);
            localStorage.setItem('type', "volunteer");
            
            // Store volunteer data safely
            if (response.data.data.volunteer) {
              localStorage.setItem('volunteerData', JSON.stringify(response.data.data.volunteer));
            } else {
              // If volunteer data is not in the expected format, create a basic one
              const basicVolunteerData = {
                name: 'Volunteer',
                volunteer_id: 'V001',
                roll: roll
              };
              localStorage.setItem('volunteerData', JSON.stringify(basicVolunteerData));
            }
            
            setTimeout(() => {
              navigate('/volunteer')
            }, 2000);
          }
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Login failed. Please try again.");
        });
    }
    else {
      toast.warn("Please fill all the details carefully!!")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');
    
    if (token && type) {
      if (type === 'admin' || type === 'super_admin') {
        navigate('/admin');
      }
      else if (type === 'volunteer') {
        navigate('/volunteer');
      }
    }
  }, [navigate]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (email.length && adminPwd.length) {
      axios.post(`${path}/loginAdmin`, {
        email: email,
        password: adminPwd
      })
        .then(function (response) {
          console.log("Admin Login Res: ", response);
          if (response.status === 203) {
            toast.error(response.data.msg);
          }
          else {
            toast.success("Welcome back, Admin! 👋");
            
            // Store token and type
            localStorage.setItem('token', response.data.data.token || response.data.data);
            localStorage.setItem('type', response.data.data.admin?.role || response.data.admin?.role || 'admin');
            
            // Store admin data safely
            if (response.data.data.admin) {
              localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));
            } else if (response.data.admin) {
              localStorage.setItem('adminData', JSON.stringify(response.data.admin));
            } else {
              // If admin data is not in the expected format, create a basic one
              const basicAdminData = {
                name: 'Admin',
                email: email,
                role: 'admin'
              };
              localStorage.setItem('adminData', JSON.stringify(basicAdminData));
            }
            
            setTimeout(() => {
              navigate('/admin')
            }, 2000);
          }
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Login failed. Please try again.");
        });
    }
    else {
      toast.warn("Please fill all the details carefully!!")
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      <Header />
      <ToastContainer 
        position="top-right"
        autoClose={2000}
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
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <img 
                  src="https://cdn.iconscout.com/icon/premium/png-256-thumb/volunteer-1969787-1661136.png" 
                  alt="NSS Logo" 
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">PICT NSS</h1>
                  <p className="text-blue-100 text-sm">Volunteer Management System</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList 
                  onChange={handleChange} 
                  aria-label="login tabs"
                  className="flex"
                >
                  <Tab 
                    label={
                      <div className="flex items-center space-x-2">
                        <VolunteerActivismIcon fontSize="small" />
                        <span>Volunteer</span>
                      </div>
                    } 
                    value="1" 
                    className="flex-1 py-4"
                  />
                  <Tab 
                    label={
                      <div className="flex items-center space-x-2">
                        <AdminPanelSettingsIcon fontSize="small" />
                        <span>Admin</span>
                      </div>
                    } 
                    value="2" 
                    className="flex-1 py-4"
                  />
                </TabList>
              </Box>

              {/* Volunteer Login */}
              <TabPanel value="1" className="p-6">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="roll" className="block text-sm font-medium text-gray-700 mb-2">
                      Roll Number
                    </label>
                    <input
                      name="roll"
                      type="text"
                      value={roll}
                      onChange={(e) => setroll(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your roll number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={volunteerPwd}
                      onChange={(e) => setvolunteerPwd(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    onClick={handleVolunteerLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    <LockIcon className="w-5 h-5 inline mr-2" />
                    Sign in as Volunteer
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/registerVolunteer" className="text-blue-600 hover:text-blue-500 font-medium">
                      Join NSS
                    </Link>
                  </div>
                </form>
              </TabPanel>

              {/* Admin Login */}
              <TabPanel value="2" className="p-6">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      value={adminPwd}
                      onChange={(e) => setadminPwd(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-admin"
                        name="remember-admin"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-admin" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    onClick={handleAdminLogin}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    <LockIcon className="w-5 h-5 inline mr-2" />
                    Sign in as Admin
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    Need admin access?{' '}
                    <Link href="/registerAdmin" className="text-blue-600 hover:text-blue-500 font-medium">
                      Register Admin
                    </Link>
                  </div>
                </form>
              </TabPanel>
            </TabContext>
          </div>

          {/* Features Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 text-sm font-bold">📊</span>
              </div>
              <h3 className="font-medium text-gray-700">Track Hours</h3>
              <p className="text-xs text-gray-500">Monitor your volunteer work</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-sm font-bold">🏆</span>
              </div>
              <h3 className="font-medium text-gray-700">Earn Recognition</h3>
              <p className="text-xs text-gray-500">Get ranked among volunteers</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 text-sm font-bold">🌟</span>
              </div>
              <h3 className="font-medium text-gray-700">Camp Eligibility</h3>
              <p className="text-xs text-gray-500">Qualify for annual camps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login