import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, UserCircle, LogOut } from 'lucide-react';
import useDoctorStore from '../../store/doctorStore';
import useT from '../../hooks/useT';

const NAV = [
  { path: '/doctor/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { path: '/doctor/appointments', icon: CalendarDays, key: 'appointments' },
  { path: '/doctor/profile', icon: UserCircle, key: 'profile' },
];

export default function DoctorSidebar() {
  const { logout, doctor } = useDoctorStore();
  const navigate = useNavigate();
  const t = useT();

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  return (
    <aside className="w-60 flex flex-col bg-white border-r border-slate-100">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <p className="text-[15px] font-semibold tracking-tight text-slate-800">
          Denta<span className="text-accent-soft">Care</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5 tracking-wide uppercase">{t('doctorPortal')}</p>
      </div>

      {/* Doctor Mini Profile */}
      {doctor && (
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt=""
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center text-sm font-bold text-accent-soft ring-1 ring-accent-100">
                {doctor.name?.charAt(0) || 'D'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-700 truncate leading-tight">{doctor.name}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {t(doctor.speciality.toLowerCase().replace(/ /g, '')) || doctor.speciality}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest px-3 pt-1 pb-2">
          Menu
        </p>
        {NAV.map(({ path, icon: Icon, key }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-semibold text-accent-soft bg-accent-soft/20 border border-accent-200'
                : 'flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={15}
                  className={`shrink-0 ${isActive ? 'text-accent-soft' : 'text-slate-400'}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span>{t(key)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 pt-2 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100"
        >
          <LogOut size={15} className="shrink-0" strokeWidth={1.8} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}