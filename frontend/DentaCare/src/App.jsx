import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Admin
import useAdminStore from './store/adminStore'
import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import DoctorsList from './pages/admin/DoctorsList'
import AddDoctor from './pages/admin/AddDoctor'
import Appointments from './pages/admin/Appointments'
// Doctor
import useDoctorStore from './store/doctorStore'
import DoctorLogin from './pages/doctor/DoctorLogin'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppts from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'

// Website
import HomePage from './pages/website/Home'
import About from './pages/website/About'
import Auth from './pages/website/Auth'
import DoctorsPage from './pages/website/DoctorsPage'
import DoctorDetailsPage from './pages/website/DoctorDetailsPage'
import ProfilePage from './pages/website/profilepage'
import { AdminShell } from './components/layouts/AdminShell'
import { DoctorShell } from './components/layouts/DoctorShell'
export default function App() {
  const { aToken } = useAdminStore()
  const { dToken } = useDoctorStore()

  useEffect(() => {
    console.log('App initialized')
  }, [])
  console.log('Current aToken:', aToken);
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
        <Routes>
          {/* ── WEBSITE PUBLIC ROUTES ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/doctors" element={<DoctorsPage/>} />
          <Route path="/doctors/:docId" element={<DoctorDetailsPage/>} />
        
          {/* ── DOCTOR ROUTES ── */}
          <Route path="/doctor/login" element={
            dToken ? <Navigate to="/doctor/dashboard" /> : <DoctorLogin />
          } />
          <Route path="/doctor/dashboard" element={
            dToken ? <DoctorShell><DoctorDashboard /></DoctorShell> : <Navigate to="/doctor/login" />
          } />
          <Route path="/doctor/appointments" element={
            dToken ? <DoctorShell><DoctorAppts /></DoctorShell> : <Navigate to="/doctor/login" />
          } />
          <Route path="/doctor/profile" element={
            dToken ? <DoctorShell><DoctorProfile /></DoctorShell> : <Navigate to="/doctor/login" />
          } />

          {/* ── ADMIN ROUTES ── */}
          <Route path="/admin/login" element={
            aToken ? <Navigate to="/admin" /> : <AdminLogin />
          } />
          
           <Route path="/admin" element={
            aToken ? <AdminShell><Dashboard /></AdminShell> : <Navigate to="/admin/login" />
           } />
          <Route path="/admin/doctors" element={
            aToken ? <AdminShell><DoctorsList /></AdminShell> : <Navigate to="/admin" />
          } />
          <Route path="/admin/add-doctor" element={
            aToken ? <AdminShell><AddDoctor /></AdminShell> : <Navigate to="/admin" />
          } />
          <Route path="/admin/appointments" element={
            aToken ? <AdminShell><Appointments /></AdminShell> : <Navigate to="/admin" />
          } />

          {/* Catch all → home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
  )
}