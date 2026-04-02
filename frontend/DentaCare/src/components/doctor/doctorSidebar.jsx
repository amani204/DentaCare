
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, DollarSign, UserCircle, LogOut, Stethoscope } from 'lucide-react';
import useDoctorStore from '../../store/doctorStore';
import useT from '../../hooks/useT';

const NAV = [
  { path: '/doctor/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { path: '/doctor/appointments', icon: CalendarDays, key: 'appointments' },
  { path: '/doctor/earnings', icon: DollarSign, key: 'earnings' },
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
    <aside className="w-64 flex flex-col bg-linear-to-b from-[#091E5D] via-[#0d2875] to-[#1a3a8f] shadow-xl relative overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xl font-bold text-primary-soft leading-tight mb-1">
              Denta<span className="text-primary">Care</span>
            </p>
            <p className="text-xs text-white/50">{t('doctorPortal')}</p>
          </div>
        </div>
      </div>
      {/* Doctor Mini Profile */}
      {doctor && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-white/10 border border-white/15">
          <div className="flex items-center gap-3">
            {doctor.image ? (
              <img src={doctor.image} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary-soft/50" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-soft/20 flex items-center justify-center text-base font-bold text-primary-soft">
                {doctor.name?.charAt(0) || 'D'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{doctor.name}</p>
              <p className="text-xs text-white/50 truncate">{doctor.speciality}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ path, icon: Icon, key }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/doctor/dashboard'}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-white/15 text-white border-l-2 border-primary-soft'
                : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200'
            }
          >
            <Icon size={18} className="shrink-0" />
            <span>{t(key)}</span>
            {({ isActive }) => isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-soft" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut size={18} className="shrink-0 group-hover:rotate-12 transition-transform" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}