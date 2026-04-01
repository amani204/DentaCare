import { useLocation } from 'react-router-dom';
import { Search, Globe} from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import useT from '../../hooks/useT';

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggleTheme, lang, toggleLang } = useAdminStore();
  const t = useT();

  const titles = {
    '/': t('dashboard'),
    '/doctors': t('doctors'),
    '/add-doctor': t('addDoctor'),
    '/appointments': t('appointments'),
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-surface border-b border-border">
      {/* Left Search */}
      <h2 className="page-title" style={{ fontSize: '0.9375rem' }}>
        {titles[pathname] || 'DentaCare'}
      </h2>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Language toggle */}
    <button
     onClick={toggleLang}
     className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-sub hover:text-black hover:bg-primary/5 rounded-lg transition-all"
     title="Toggle language"
    >
     <Globe size={16} />
     <span>{lang === 'en' ? 'English' : 'Français'}</span>
     <span className="text-xs text-muted">({lang === 'en' ? 'EN' : 'FR'})</span>
    </button>

        {/* Admin avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-soft border-2 border-primary/30 flex items-center justify-center text-xs font-bold text-primary-hov cursor-pointer flex-shrink-0">
          A
        </div>
      </div>
    </header>
  );
}