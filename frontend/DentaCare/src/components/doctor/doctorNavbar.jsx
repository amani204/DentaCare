import { useLocation, Link } from 'react-router-dom';
import { Languages, ChevronRight, LayoutDashboard, CalendarClock, DollarSign, UserCog } from 'lucide-react';
import useDoctorStore from '../../store/doctorStore';
import useAdminStore from '../../store/adminStore';
import useT from '../../hooks/useT';

export default function DoctorNavbar() {
  const { pathname } = useLocation();
  const { doctor } = useDoctorStore();
  const { lang, toggleLang } = useAdminStore();
  const t = useT();

  // Route metadata maps matching titles and sharp micro-icons
  const routeConfigs = {
    '/doctor/dashboard': { label: t('dashboard'), icon: LayoutDashboard },
    '/doctor/appointments': { label: t('appointments'), icon: CalendarClock },
    '/doctor/earnings': { label: t('earnings'), icon: DollarSign },
    '/doctor/profile': { label: t('profile'), icon: UserCog },
  };

  const currentRoute = routeConfigs[pathname];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/70 backdrop-blur-md border-b border-border/60 transition-all duration-300">
      
      {/* Dynamic Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs">
        <Link 
          to="/doctor/dashboard" 
          className="text-muted hover:text-primary font-medium transition-colors duration-150"
        >
          DentaCare
        </Link>
        
        {currentRoute && (
          <>
            <ChevronRight size={12} className="text-muted/60" />
            <div className="flex items-center gap-1.5 text-text px-2 py-1 rounded-md bg-bg/60 border border-border/30">
              {currentRoute.icon && <currentRoute.icon size={13} className="text-primary/80" />}
              <span className="font-semibold tracking-tight">{currentRoute.label}</span>
            </div>
          </>
        )}
      </div>

      {/* Utilities Center */}
      <div className="flex items-center gap-4">
        
        {/* Balanced Language Button */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-sub hover:text-primary-deep bg-white border border-border/80 hover:border-primary/30 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98]"
          title="Change System Language"
        >
          <Languages size={13} className="text-muted group-hover:text-primary transition-colors" />
          <span className="tracking-wide">
            {lang === 'en' ? 'EN' : 'FR'}
          </span>
          <span className="text-[11px] opacity-40">|</span>
          <span className="text-[13px] leading-none">
            {lang === 'en' ? '🇬🇧' : '🇫🇷'}
          </span>
        </button>

        {/* Separator Divider */}
        <div className="w-[1px] h-5 bg-border/60 hidden sm:block" />

        {/* Minimalist Profile Indicator */}
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative">
            {doctor?.image ? (
              <img
                src={doctor.image}
                alt=""
                className="w-8 h-8 rounded-xl object-cover border border-primary/20 shadow-2xs group-hover:shadow-xs transition-all duration-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-soft to-accent-soft border border-primary/20 flex items-center justify-center text-xs font-bold text-primary-deep shadow-2xs group-hover:shadow-xs transition-all duration-200">
                {doctor?.name?.charAt(0) || 'D'}
              </div>
            )}
            {/* Live system pulse indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white" />
          </div>
          
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-text group-hover:text-primary transition-colors leading-none mb-1.5">
              {doctor?.name || 'Doctor'}
            </span>
            <span className="text-[10px] text-muted tracking-wider uppercase font-medium leading-none">
              {doctor?.speciality || (lang === 'en' ? 'Clinical Profile' : 'Profil Clinique')}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}