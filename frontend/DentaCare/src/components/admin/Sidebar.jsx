
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, UserPlus, Calendar, LogOut } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import useT from '../../hooks/useT';

const NAV = [
  { path: '/',             icon: LayoutDashboard, key: 'dashboard' },
  { path: '/doctors',      icon: Stethoscope,     key: 'doctors' },
  { path: '/add-doctor',   icon: UserPlus,        key: 'addDoctor' },
  { path: '/appointments', icon: Calendar,        key: 'appointments' },
];

export default function Sidebar() {
  const { logout } = useAdminStore();
  const navigate = useNavigate();
  const t = useT();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border ">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xl font-bold text-text leading-tight mb-1">
              Denta<span className="text-primary">Care</span>
            </p>
            <p className="text-xs text-sub ">{t('adminPanel')}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
<nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
  {NAV.map(({ path, icon: Icon, key }) => (
    <NavLink
      key={path}
      to={path}
      end={path === '/'}
      className={({ isActive }) => 
        isActive 
          ? 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-primary/5 text-primary border-l-2 border-primary'
          : 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sub hover:text-primary hover:bg-primary/5 transition-all duration-200'
      }
    >
      <Icon size={18} className="shrink-0" />
      <span>{t(key)}</span>
    </NavLink>
  ))}
</nav>

      {/* Logout */}
      <div className="p-2 border-t border-border ">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sub hover:text-red-500 hover:bg-red-50  transition-all duration-200"
        >
          <LogOut size={18} className="shrink-0" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );

}