import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, UserPlus, Calendar, LogOut } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import useT from '../../hooks/useT';

const NAV = [
  { path: '/admin',             icon: LayoutDashboard, key: 'dashboard' },
  { path: '/admin/doctors',      icon: Stethoscope,     key: 'doctors' },
  { path: '/admin/add-doctor',   icon: UserPlus,        key: 'addDoctor' },
  { path: '/admin/appointments', icon: Calendar,        key: 'appointments' },
];

export default function Sidebar() {
  const { logout } = useAdminStore();
  const navigate = useNavigate();
  const t = useT();

  return (
    <aside className="w-64 flex flex-col bg-white/50 backdrop-blur-sm border-r border-primary/20 shadow-lg">
      {/* Logo */}
        <div className="px-4 py-5 border-b border-border ">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xl font-bold text-text leading-tight mb-1">
              Denta<span className="text-accent-soft">Care</span>
            </p>
            <p className="text-xs text-sub ">{t('adminPanel')}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ path, icon: Icon, key }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/admin'}
            className={({ isActive }) => 
              isActive 
                ? 'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium bg-linear-to-r from-primary/10 to-primary/5 text-primary border-l-2 border-primary'
                : 'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-sub hover:text-primary hover:bg-primary/5 transition-all duration-200'
            }
          >
            <Icon size={18} className="shrink-0" />
            <span>{t(key)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-primary/10">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sub hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 group"
        >
          <LogOut size={18} className="shrink-0 group-hover:rotate-12 transition-transform" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}