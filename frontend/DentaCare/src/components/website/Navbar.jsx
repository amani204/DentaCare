import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight, Globe, User, LogOut } from 'lucide-react'
import gsap from 'gsap'
import useAdminStore from '../../store/adminStore'
import useAuthStore from '../../store/useAuth'
import useT from '../../hooks/useT'

const NAV_LINKS = [
  { label: 'Home', href: '/', isHash: false },
  { label: 'About', href: '/about', isHash: false },
  { label: 'Services', href: '/#services', isHash: true, sectionId: 'services' },
  { label: 'Doctors', href: '/#doctors',  isHash: true, sectionId: 'doctors'},
  { label: 'Contact', href: '/#contact', isHash: true, sectionId: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, toggleLang } = useAdminStore()
  const { user, isAuthenticated, logout, role } = useAuthStore()
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigation = (e, link) => {
    e.preventDefault()
    setMenuOpen(false)

    if (link.isHash) {
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const el = document.getElementById(link.sectionId)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        const el = document.getElementById(link.sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(link.href)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowDropdown(false)
  }

  const getInitials = (name) => {
    return name?.split(' ').slice(0, 2).map(w => w[0]).join('') || 'U'
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          menuOpen ? 'opacity-0 invisible -translate-y-full' : 'opacity-100 visible translate-y-0'
        } ${
          scrolled
            ? 'bg-white/60 backdrop-blur-md shadow-lg border-b border-primary/10 py-2'
            : 'bg-white/95 border-b py-4'
        }`}
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <span className="font-bold text-xl text-text">
              Denta<span className="text-accent-soft">Care</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigation(e, link)}
                className="relative text-sub font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:text-primary group"
              >
                {t(link.label.toLowerCase()) || link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary-soft transition-all duration-300 group-hover:w-6 group-hover:left-1/2 -translate-x-1/2 rounded-full" />
              </a>
            ))}
          </div>

          {/* Right section - Language + Auth */}
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

            {/* Conditional Auth Section */}
            {isAuthenticated && role === 'patient' ? (
              // Logged in - Show Profile Dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary-soft"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-deep to-primary flex items-center justify-center text-white font-semibold">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-text hidden lg:inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
                    <div className="p-3 border-b border-border bg-gray-50">
                      <p className="text-sm font-semibold text-text">{user?.name}</p>
                      <p className="text-xs text-sub">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-sub hover:bg-gray-50 hover:text-text transition"
                      >
                        <User size={16} /> {t('myProfile')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} /> {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in - Show Sign In button
              <Link to="/Auth" className="btn-primary">
                {t('signIn')}
              </Link>
            )}
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

            {/* Header with User Info if logged in */}
            <div className="px-6 pt-4 pb-2 border-b border-border">
              <div className="flex items-center justify-between">
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
              
              {/* Mobile User Info when logged in */}
              {isAuthenticated && role === 'patient' && (
                <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl">
                  {user?.image ? (
                    <img src={user.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-deep to-primary flex items-center justify-center text-white font-semibold">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-text">{user?.name}</p>
                    <p className="text-xs text-sub">{user?.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link)}
                  className="flex items-center justify-between py-4 text-lg font-medium text-text/75 border-b border-border last:border-0 hover:text-primary-deep transition-colors"
                >
                  {t(link.label.toLowerCase()) || link.label}
                  <ChevronRight size={18} className="text-muted" />
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-border space-y-3">
              {/* Language Toggle */}
              <button
                onClick={() => { toggleLang(); setMenuOpen(false) }}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-sub hover:text-primary transition-all duration-200"
              >
                <Globe size={16} />
                <span>{lang === 'en' ? 'English' : 'Français'}</span>
                <span className="text-xs text-muted">({lang === 'en' ? 'EN' : 'FR'})</span>
              </button>

              {isAuthenticated && role === 'patient' ? (
                // Mobile - Logged in actions
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-primary text-primary font-medium hover:bg-primary/5 transition"
                  >
                    <User size={16} /> {t('myProfile')}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  >
                    <LogOut size={16} /> {t('logout')}
                  </button>
                </>
              ) : (
                // Mobile - Not logged in
                <Link
                  to="/Auth"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 btn-primary w-full"
                >
                  {t('signIn')}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}