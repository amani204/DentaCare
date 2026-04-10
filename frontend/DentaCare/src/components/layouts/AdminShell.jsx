import Navbar from "../admin/Navbar";
import Sidebar from "../admin/Sidebar";
// ── Admin protected layout
export function AdminShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  )
}
