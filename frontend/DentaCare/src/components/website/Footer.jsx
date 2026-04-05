import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useT from '../../hooks/useT'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const t = useT()
  const footerRef = useRef(null)

  useEffect(() => {
    if (!footerRef.current) return
    const cols = footerRef.current.querySelectorAll('.footer-col')
    gsap.fromTo(cols,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none none' } 
      }
    )
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  // 1. Define the specific paths for your main navigation
  const quickLinks = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'services', path: '/#services' },
    { name: 'doctors', path: '/doctors' },
    { name: 'contact', path: '/#contact' }
  ]

  return (
    <footer className="bg-bg text-text/70">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div ref={footerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
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

          {/* Quick Links - UPDATED LOGIC */}
          <div className="footer-col opacity-0">
            <h4 className="text-text font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-text/50 hover:text-text transition-colors duration-200"
                  >
                    {t(`nav${item.name.charAt(0).toUpperCase() + item.name.slice(1)}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - Fixed to always point to home sections */}
          <div className="footer-col opacity-0">
            <h4 className="text-text font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footerServices')}
            </h4>
            <ul className="space-y-2">
              {[
                'generalDentistry',
                'cosmeticDentistry',
                'orthodontics',
                'oralSurgery',
                'pediatricDentistry',
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/#services"
                    className="text-sm text-text/50 hover:text-text transition-colors duration-200"
                  >
                    {t(`service${service.charAt(0).toUpperCase() + service.slice(1)}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Info */}
          <div className="footer-col opacity-0">
            <h4 className="text-text font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footerPatient')}
            </h4>
            <ul className="space-y-2">
              {[
                { key: 'bookAppointment', link: '/doctors' },
                { key: 'patientPortal', link: '/login' },
                { key: 'privacyPolicy', link: '/privacy' },
                { key: 'termsOfService', link: '/terms' },
              ].map(({ key, link }) => (
                <li key={key}>
                  <Link
                    to={link}
                    className="text-sm text-text/50 hover:text-text transition-colors duration-200"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text/40">
          <p>© 2026 DentaCare. {t('footerRights')}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-accent-soft transition-colors">{t('privacyPolicy')}</Link>
            <Link to="/terms" className="hover:text-accent-soft transition-colors">{t('termsOfService')}</Link>
            <Link to="/cookies" className="hover:text-accent-soft transition-colors">{t('cookiePolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}