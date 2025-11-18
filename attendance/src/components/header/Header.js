import React, { useState, useEffect } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileType, setProfileType] = useState('');
  const [userName, setUserName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [location]);

  const checkAuth = () => {
    try {
      const type = localStorage.getItem('type');
      const token = localStorage.getItem('token');
      setProfileType(type || '');

      if (token) {
        try {
          // Safe token decoding
          const payload = token.split('.')[1];
          if (payload) {
            const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            const decodedToken = JSON.parse(decodedPayload);
            setUserName(decodedToken.name || decodedToken.email || 'User');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          // If token is invalid, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('type');
          setUserName('');
          setProfileType('');
        }
      } else {
        setUserName('');
        setProfileType('');
      }
    } catch (error) {
      console.error('Error in checkAuth:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('type');
    setProfileType('');
    setUserName('');
    navigate('/');
  }

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  }

  const getWelcomeMessage = () => {
    if (!userName) return null;
    
    let role = '';
    if (profileType === 'volunteer') role = 'Volunteer';
    else if (profileType === 'admin') role = 'Admin';
    else if (profileType === 'super_admin') role = 'Super Admin';
    
    return `${userName} (${role})`;
  }

  // Don't show header on login page to avoid confusion
  if (location.pathname === '/' || 
      location.pathname === '/adminLogin' || 
      location.pathname === '/registerVolunteer' || 
      location.pathname === '/registerAdmin' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/reset-password') {
    return null;
  }

  return (
    <div>
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigation(profileType === 'volunteer' ? '/volunteer' : '/admin')}>
              <img 
                src='https://cdn.iconscout.com/icon/premium/png-256-thumb/volunteer-1969787-1661136.png?f=webp&w=128' 
                alt="NSS Logo" 
                className='w-12 h-12 rounded-full border-2 border-white'
              />
              <div className='flex flex-col'>
                <div className="text-xl font-bold text-white">NSS Volunteer System</div>
                <h2 className='text-green-300 text-sm font-medium'>PICT NSS Club</h2>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {profileType && (
                <>
                  {/* Show welcome message */}
                  <span className="text-blue-100 font-medium">
                    {getWelcomeMessage()}
                  </span>
                  
                  {/* Volunteer Navigation */}
                  {profileType === "volunteer" && (
                    <>
                      <button 
                        onClick={() => handleNavigation('/volunteer')}
                        className='hover:text-blue-200 transition-colors font-medium'
                      >
                        Dashboard
                      </button>
                      <button 
                        onClick={() => handleNavigation('/my-attendance')}
                        className='hover:text-blue-200 transition-colors font-medium'
                      >
                        My Attendance
                      </button>
                      <button 
                        onClick={() => handleNavigation('/my-work')}
                        className='hover:text-blue-200 transition-colors font-medium'
                      >
                        My Work
                      </button>
                      <button 
                        onClick={() => handleNavigation('/my-statistics')}
                        className='hover:text-blue-200 transition-colors font-medium'
                      >
                        Statistics
                      </button>
                    </>
                  )}
                  
                  {/* Admin Navigation */}
                  {(profileType === "admin" || profileType === "super_admin") && (
                    <>
                      <button 
                        onClick={() => handleNavigation('/activities')}
                        className='hover:text-blue-200 transition-colors font-medium'
                      >
                        Activities
                      </button>
                      <button 
                        onClick={() => handleNavigation('/mark-attendance')}
                        className='hover:text-blue-200 transition-colors font-medium'
                      >
                        Attendance
                      </button>
                      <button 
                        onClick={() => handleNavigation('/individual-work')}
                        className='hover:text-blue-200 transition-colors font-medium'
                      >
                        Assign Work
                      </button>
                      <button 
                        onClick={() => handleNavigation('/reports')}
                        className='hover:text-blue-200 transition-colors font-medium'
                      >
                        Reports
                      </button>
                      {profileType === "super_admin" && (
                        <button 
                          onClick={() => handleNavigation('/admin-management')}
                          className='hover:text-blue-200 transition-colors font-medium'
                        >
                          Admin Management
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout} 
                    className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <LogoutIcon fontSize='small' />
                    <span>Logout</span>
                  </button>
                </>
              )}
              
              {/* Show login button if not authenticated */}
              {!profileType && (
                <button 
                  onClick={() => navigate('/')}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Login
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 bg-blue-700 rounded-lg p-4">
              <div className="flex flex-col space-y-3">
                {profileType && (
                  <>
                    {/* Welcome message for mobile */}
                    <span className="text-blue-100 font-medium py-2 text-center border-b border-blue-600 pb-2">
                      {getWelcomeMessage()}
                    </span>
                    
                    {/* Volunteer Mobile Navigation */}
                    {profileType === "volunteer" && (
                      <>
                        <button 
                          onClick={() => handleNavigation('/volunteer')}
                          className='text-white hover:text-blue-200 py-2 text-left'
                        >
                          Dashboard
                        </button>
                        <button 
                          onClick={() => handleNavigation('/my-attendance')}
                          className='text-white hover:text-blue-200 py-2 text-left'
                        >
                          My Attendance
                        </button>
                        <button 
                          onClick={() => handleNavigation('/my-work')}
                          className='text-white hover:text-blue-200 py-2 text-left'
                        >
                          My Work
                        </button>
                        <button 
                          onClick={() => handleNavigation('/my-statistics')}
                          className='text-white hover:text-blue-200 py-2 text-left'
                        >
                          Statistics
                        </button>
                      </>
                    )}
                    
                    {/* Admin Mobile Navigation */}
                    {(profileType === "admin" || profileType === "super_admin") && (
                      <>
                        <button 
                          onClick={() => handleNavigation('/activities')}
                          className='text-white hover:text-blue-200 py-2 text-left'
                        >
                          Activities
                        </button>
                        <button 
                          onClick={() => handleNavigation('/mark-attendance')}
                          className='text-white hover:text-blue-200 py-2 text-left'
                        >
                          Attendance
                        </button>
                        <button 
                          onClick={() => handleNavigation('/individual-work')}
                          className='text-white hover:text-blue-200 py-2 text-left'
                        >
                          Assign Work
                        </button>
                        <button 
                          onClick={() => handleNavigation('/reports')}
                          className='text-white hover:text-blue-200 py-2 text-left'
                        >
                          Reports
                        </button>
                        {profileType === "super_admin" && (
                          <button 
                            onClick={() => handleNavigation('/admin-management')}
                            className='text-white hover:text-blue-200 py-2 text-left'
                          >
                            Admin Management
                          </button>
                        )}
                      </>
                    )}
                    
                    {/* Mobile Logout Button */}
                    <button 
                      onClick={handleLogout} 
                      className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 w-full mt-2"
                    >
                      <LogoutIcon fontSize='small' />
                      <span>Logout</span>
                    </button>
                  </>
                )}
                
                {/* Mobile Login Button */}
                {!profileType && (
                  <button 
                    onClick={() => handleNavigation('/')}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors w-full"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header;