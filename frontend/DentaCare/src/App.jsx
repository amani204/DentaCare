import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAdminStore from './store/adminStore'
import Login        from './pages/Login'
import Dashboard    from './pages/Dashboard'
import DoctorsList  from './pages/DoctorsList'
import AddDoctor    from './pages/AddDoctor'
import Appointments from './pages/Appointments'
import Sidebar      from './components/admin/Sidebar'
import Navbar       from './components/admin/Navbar'

export default function App() {
  const { aToken, applyTheme } = useAdminStore()

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {aToken ? (
        <div className="h-screen overflow-hidden flex bg-[#fafafa]">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-5">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/doctors" element={<DoctorsList />} />
                <Route path="/add-doctor" element={<AddDoctor />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}