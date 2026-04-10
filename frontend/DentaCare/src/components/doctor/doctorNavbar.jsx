import { useLocation } from 'react-router-dom';
import useDoctorStore from '../../store/doctorStore';
import useT from '../../hooks/useT';
import useAdminStore from '../../store/adminStore';

export default function DoctorNavbar() {
  const { pathname } = useLocation();
  const { doctor } = useDoctorStore();
  const {lang, toggleLang} = useAdminStore();
  const t = useT();

  const titles = {
    '/doctor/dashboard': t('dashboard'),
    '/doctor/appointments': t('appointments'),
    '/doctor/earnings': t('earnings'),
    '/doctor/profile': t('profile'),
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/95 backdrop-blur-sm border-b border-primary/20 shadow-sm">
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-text">
        {titles[pathname] || 'DentaCare'}
      </h2>
      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
           <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-sub hover:text-primary hover:bg-accent-soft/10 rounded-lg transition-all bg-white/50 backdrop-blur-sm"
            title="Toggle language"
          >
            <span>{lang === 'en' ? '🇬🇧' : '🇫🇷'}</span>
            <span>{lang === 'en' ? 'English' : 'Français'}</span>
          </button>
        {/* Doctor Avatar */}
        {doctor?.image ? (
          <img
            src={doctor.image}
            alt="Doctor"
            className="w-9 h-9 rounded-full object-cover border-2 border-accent/30 cursor-pointer hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary-soft border-2 border-primary/30 flex items-center justify-center text-sm font-bold text-primary-deep cursor-pointer hover:bg-primary/20 transition-all">
            {doctor?.name?.charAt(0) || 'D'}
          </div>
        )}
      </div>
    </header>
  );
}