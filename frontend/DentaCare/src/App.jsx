// src/App.jsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Admin
import useAdminStore from './store/adminStore'
import AdminLogin    from './pages/admin/Login'
import Dashboard     from './pages/admin/Dashboard'
import DoctorsList   from './pages/admin/DoctorsList'
import AddDoctor     from './pages/admin/AddDoctor'
import Appointments  from './pages/admin/Appointments'
import AdminSidebar  from './components/admin/Sidebar'
import AdminNavbar   from './components/admin/Navbar'

// Doctor
import useDoctorStore  from './store/doctorStore'
import DoctorLogin     from './pages/doctor/DoctorLogin'
import DoctorSidebar   from './components/doctor/DoctorSidebar'
import DoctorNavbar    from './components/doctor/DoctorNavbar'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppts     from './pages/doctor/DoctorAppointments'
import DoctorEarnings  from './pages/doctor/DoctorEarnings'
import DoctorProfile   from './pages/doctor/DoctorProfile'

// Background Component
import { DualGradientBg } from './components/ui/backgrounds'

// ── Admin protected layout
function AdminShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  )
}

// ── Doctor protected layout
function DoctorShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const { aToken } = useAdminStore()
  const { dToken } = useDoctorStore()

  useEffect(() => {
    console.log('App initialized')
  }, [])

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Wrap everything with DualGradientBg */}
      <DualGradientBg>
        <Routes>

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
          <Route path="/doctor/earnings" element={
            dToken ? <DoctorShell><DoctorEarnings /></DoctorShell> : <Navigate to="/doctor/login" />
          } />
          <Route path="/doctor/profile" element={
            dToken ? <DoctorShell><DoctorProfile /></DoctorShell> : <Navigate to="/doctor/login" />
          } />

          {/* ── ADMIN ROUTES ── */}
          <Route path="/" element={
            aToken ? <AdminShell><Dashboard /></AdminShell> : <AdminLogin />
          } />
          <Route path="/doctors" element={
            aToken ? <AdminShell><DoctorsList /></AdminShell> : <Navigate to="/" />
          } />
          <Route path="/add-doctor" element={
            aToken ? <AdminShell><AddDoctor /></AdminShell> : <Navigate to="/" />
          } />
          <Route path="/appointments" element={
            aToken ? <AdminShell><Appointments /></AdminShell> : <Navigate to="/" />
          } />

          {/* Catch all → admin login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </DualGradientBg>
    </BrowserRouter>
  )
}