import { useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { useScrollFade } from '../../hooks/gsap';
import useT from '../../hooks/useT';

export default function Footer() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const footerRef = useRef(null);

  useScrollFade(footerRef, {
    selector: '.footer-col',
    y: 30,
    stagger: 0.1,
    start: 'top 90%',
  });

  const handleNavigation = (e, path, isHash = false, sectionId = null) => {
    e.preventDefault();

    if (isHash && sectionId) {
      if (location.pathname !== '/') {
        navigate('/');
        const checkElement = setInterval(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            clearInterval(checkElement);
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        setTimeout(() => clearInterval(checkElement), 2000);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  const quickLinks = [
    { name: 'home', path: '/', isHash: false },
    { name: 'about', path: '/about', isHash: false },
    { name: 'services', path: '/#services', isHash: true, sectionId: 'services' },
    { name: 'doctors', path: '/doctors', isHash: false },
    { name: 'contact', path: '/#contact', isHash: true, sectionId: 'contact' },
  ];

  return (
    <footer className="bg-bg text-text/70">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div
          ref={footerRef}
          id="footer-container"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10"
        >
          {/* Brand Column */}
          <div className="footer-col opacity-0 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-text">
                Denta<span className="text-accent-soft">Care</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-xs">
              {t('footerDesc')}
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-accent-soft shrink-0" />
                <span>{t('footerAddress')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-accent-soft shrink-0" />
                <span>+213 21 00 00 00</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-accent-soft shrink-0" />
                <span>Amani@dentacare.dz</span>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text/50 hover:text-accent-soft hover:bg-white/10 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col opacity-0">
            <h3 className="text-text font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footerQuickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  {item.isHash ? (
                    <a
                      href={item.path}
                      onClick={(e) => handleNavigation(e, item.path, true, item.sectionId)}
                      className="text-sm text-text/50 hover:text-text transition-colors duration-200 cursor-pointer"
                    >
                      {t(`nav${item.name.charAt(0).toUpperCase() + item.name.slice(1)}`)}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="text-sm text-text/50 hover:text-text transition-colors duration-200"
                    >
                      {t(`nav${item.name.charAt(0).toUpperCase() + item.name.slice(1)}`)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col opacity-0">
            <h3 className="text-text font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footerServices')}
            </h3>
            <ul className="space-y-2">
              {[
                { key: 'generalDentistry', label: 'serviceGeneralDentistry' },
                { key: 'cosmeticDentistry', label: 'serviceCosmeticDentistry' },
                { key: 'orthodontics', label: 'serviceOrthodontics' },
                { key: 'oralSurgery', label: 'serviceOralSurgery' },
                { key: 'pediatricDentistry', label: 'servicePediatricDentistry' },
              ].map((service) => (
                <li key={service.key}>
                  <a
                    href="/#services"
                    onClick={(e) => handleNavigation(e, '/#services', true, 'services')}
                    className="text-sm text-text/50 hover:text-text transition-colors duration-200 cursor-pointer"
                  >
                    {t(service.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text/40">
          <p>© 2026 DentaCare. {t('footerRights')}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-accent-soft transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link to="/terms" className="hover:text-accent-soft transition-colors">
              {t('termsOfService')}
            </Link>
            <Link to="/cookies" className="hover:text-accent-soft transition-colors">
              {t('cookiePolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}