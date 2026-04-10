import  DoctorNavbar from '../doctor/doctorNavbar'
import  DoctorSidebar from '../doctor/doctorSidebar'
// ── Doctor protected layout
export function DoctorShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <DoctorSidebar/>
      <div className="flex-1 flex flex-col overflow-hidden">
        < DoctorNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}