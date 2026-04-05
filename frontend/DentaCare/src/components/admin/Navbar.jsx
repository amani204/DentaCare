
import { useLocation } from 'react-router-dom';
import useAdminStore from '../../store/adminStore';
import useT from '../../hooks/useT';

export default function Navbar() {
  const { pathname } = useLocation();
  const {  lang, toggleLang } = useAdminStore();
  const t = useT();

  const titles = {
    '/': t('dashboard'),
    '/doctors': t('doctors'),
    '/add-doctor': t('addDoctor'),
    '/appointments': t('appointments'),
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white backdrop-blur-sm border border-primary/20 ">
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-text">
        {titles[pathname] || 'DentaCare'}
      </h2>
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
        {/* Admin Avatar */}
        <div className="w-9 h-9 rounded-full bg-accent/50 border-2 border-accent/30 flex items-center justify-center text-sm font-bold text-text cursor-pointer hover:bg-accent/60 transition-all">
          A
        </div>
      </div>
    </header>
  );
}