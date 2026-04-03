import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronRight, Stethoscope, Globe } from 'lucide-react'
import gsap from 'gsap'
import useAdminStore from '../../store/adminStore'
import useT from '../../hooks/useT'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Doctors', href: '/#doctors' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const navigate = useNavigate()
  const { lang, toggleLang } = useAdminStore()
  const t = useT()

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Entrance animation
  useEffect(() => {
    if (!navRef.current) return
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  const handleScroll = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    if (href.includes('#')) {
      const id = href.split('#')[1]
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(href)
    }
  }

  return (
    <>
      {/* Hide navbar when mobile menu is open */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          menuOpen ? 'opacity-0 invisible -translate-y-full' : 'opacity-100 visible translate-y-0'
        } ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-primary/10 py-2'
            : 'bg-white/60 border-b py-4'
        }`}
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-bold text-xl text-text">
              Denta<span className="text-accent-soft">Care</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleScroll(e, href)}
                className="relative text-sub font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:text-primary group"
              >
                {t(label.toLowerCase()) || label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary-soft transition-all duration-300 group-hover:w-6 group-hover:left-1/2 -translate-x-1/2 rounded-full" />
              </a>
            ))}
          </div>

          {/* Language + CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-sub hover:text-primary transition-all duration-200"
              title="Toggle language"
            >
              <Globe size={16} />
              <span>{lang === 'en' ? 'English' : 'Français'}</span>
              <span className="text-xs text-muted">({lang === 'en' ? 'EN' : 'FR'})</span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-border" />

            {/* Book Appointment */}
            <Link to="/doctors" className="btn-primary">
              {t('signIn')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text p-2 rounded-lg hover:bg-primary/5 transition-all duration-200"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Bottom Sheet Mobile Menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[10px] shadow-2xl animate-slide-up">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-text">
                  Denta<span className="text-accent-soft">Care</span>
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-full bg-bg text-sub hover:text-primary transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="px-6 py-4">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleScroll(e, href)}
                  className="flex items-center justify-between py-4 text-lg font-medium text-text/75 border-b border-border last:border-0 hover:text-primary-deep transition-colors"
                >
                  {t(label.toLowerCase()) || label}
                  <ChevronRight size={18} className="text-muted" />
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-border space-y-3">

              {/* Book Appointment Button */}
              <Link
                to="/doctors"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 btn-primary w-full"
              >
                {t('signIn')}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}