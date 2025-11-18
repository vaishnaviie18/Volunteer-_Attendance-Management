import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header'
import Login from './components/LandingPage/Login';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import VolunteerRegister from './components/LandingPage/VolunteerRegister';
import AdminRegister from './components/LandingPage/AdminRegister';
import VolunteerDashboard from './components/Volunteer/VolunteerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Admin/Login';
import ActivityManagement from './components/Activities/ActivityManagement';
import MarkAttendance from './components/Admin/MarkAttendance';
import VolunteerAttendance from './components/Volunteer/VolunteerAttendance';
import IndividualWork from './components/Admin/IndividualWork';
import Reports from './components/Admin/Reports';
import AdminManagement from './components/Admin/AdminManagement';
import MyWork from './components/Volunteer/MyWork';
import MyStatistics from './components/Volunteer/MyStatistics';
import ForgotPassword from './components/LandingPage/ForgotPassword';
import ResetPassword from './components/LandingPage/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/registerVolunteer" element={<VolunteerRegister />} />
          <Route path="/registerAdmin" element={<AdminRegister />} />
          <Route path="/adminLogin" element={<AdminLogin />} />

          {/* Volunteer protected routes */}
          <Route path="/volunteer" element={
            <ProtectedRoute>
              <VolunteerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/my-attendance" element={
            <ProtectedRoute>
              <VolunteerAttendance />
            </ProtectedRoute>
          } />
          <Route path="/my-work" element={
            <ProtectedRoute>
              <MyWork />
            </ProtectedRoute>
          } />
          <Route path="/my-statistics" element={
            <ProtectedRoute>
              <MyStatistics />
            </ProtectedRoute>
          } />

          {/* Admin protected routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/activities" element={
            <ProtectedRoute>
              <ActivityManagement />
            </ProtectedRoute>
          } />
          <Route path="/mark-attendance" element={
            <ProtectedRoute>
              <MarkAttendance />
            </ProtectedRoute>
          } />
          <Route path="/individual-work" element={
            <ProtectedRoute>
              <IndividualWork />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/admin-management" element={
            <ProtectedRoute>
              <AdminManagement />
            </ProtectedRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;