import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight, User, LogOut, Shield, Stethoscope, ChevronDown } from 'lucide-react'
import useAuthStore from '../../store/useAuth'
import useT from '../../hooks/useT'
import { useFadeIn } from '../../hooks/gsap'
import LanguageToggle from '../ui/LanguageToggle'

const NAV_LINKS = [
  { label: 'Home', href: '/', isHash: false },
  { label: 'About', href: '/about', isHash: false },
  { label: 'Services', href: '/#services', isHash: true, sectionId: 'services' },
  { label: 'Doctors', href: '/doctors', isHash: false },
  { label: 'Contact', href: '/#contact', isHash: true, sectionId: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showStaffDropdown, setShowStaffDropdown] = useState(false)
  const lastScrollY = useRef(0)
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const staffDropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout, role } = useAuthStore()
  const t = useT()

  useFadeIn(navRef, { y: -20, duration: 0.8, delay: 0.2 })

  // Scroll: glassmorphism + hide-on-scroll-down / show-on-scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (y > 80) {
        setHidden(y > lastScrollY.current)
      } else {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [menuOpen])

  // Consolidated outside-click handler for both dropdowns
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
      if (staffDropdownRef.current && !staffDropdownRef.current.contains(e.target)) {
        setShowStaffDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close dropdowns on route change
  useEffect(() => {
    setShowDropdown(false)
    setShowStaffDropdown(false)
  }, [location.pathname])

  const handleNavigation = useCallback((e, link) => {
    e.preventDefault()
    setMenuOpen(false)

    if (link.isHash) {
      if (location.pathname !== '/') {
        navigate('/')
        const check = setInterval(() => {
          const el = document.getElementById(link.sectionId)
          if (el) { clearInterval(check); el.scrollIntoView({ behavior: 'smooth' }) }
        }, 100)
        setTimeout(() => clearInterval(check), 2000)
      } else {
        document.getElementById(link.sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(link.href)
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }
  }, [location.pathname, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowDropdown(false)
  }

  const getInitials = (name) =>
    name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'U'

  const isActive = (link) => {
    if (link.isHash) return false
    if (link.href === '/') return location.pathname === '/'
    return location.pathname.startsWith(link.href)
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled
            ? 'bg-white/70 backdrop-blur-lg shadow-md border-b border-primary/10 py-2'
            : 'bg-white/95 border-b border-transparent py-4'
        }`}
        style={{ opacity: 0 }}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 shrink-0"
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
                className={`relative text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 group ${
                  isActive(link)
                    ? 'text-primary'
                    : 'text-sub hover:text-primary'
                }`}
              >
                {t(link.label.toLowerCase()) || link.label}
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-primary-soft rounded-full transition-all duration-300 ${
                    isActive(link) ? 'w-5' : 'w-0 group-hover:w-5'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />

            <div className="w-px h-5 bg-border" />

            {/* Staff dropdown */}
            <div className="relative" ref={staffDropdownRef}>
              <button
                onClick={() => setShowStaffDropdown((v) => !v)}
                aria-expanded={showStaffDropdown}
                aria-haspopup="true"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-sub hover:text-neutral-900 transition-all duration-200"
              >
                <Shield size={15} />
                <span className="hidden lg:inline">{t('staff') || 'Staff'}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${showStaffDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Staff dropdown menu */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50 transition-all duration-200 origin-top-right ${
                  showStaffDropdown
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="py-1.5">
                  <StaffMenuItem
                    icon={<Shield size={15} />}
                    label={t('adminLogin') || 'Admin Login'}
                    onClick={() => { setShowStaffDropdown(false); navigate('/admin/login') }}
                  />
                  <StaffMenuItem
                    icon={<Stethoscope size={15} />}
                    label={t('doctorLogin') || 'Doctor Login'}
                    onClick={() => { setShowStaffDropdown(false); navigate('/doctor/login') }}
                  />
                </div>
              </div>
            </div>

            <div className="w-px h-5 bg-border" />

            {/* Auth section */}
            {isAuthenticated && role === 'patient' ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  aria-expanded={showDropdown}
                  aria-haspopup="true"
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-neutral-900/5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40"
                >
                  <Avatar user={user} getInitials={getInitials} size="sm" />
                  <span className="text-sm font-medium text-text hidden lg:inline leading-none">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-sub transition-transform duration-200 hidden lg:block ${showDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* User dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50 transition-all duration-200 origin-top-right ${
                    showDropdown
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-border bg-neutral-50">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                    <p className="text-xs text-sub truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-1.5">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-sub hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                    >
                      <User size={15} /> {t('myProfile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-100  transition-colors duration-200"
                    >
                      <LogOut size={15} /> {t('logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/Auth" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors duration-200 shadow-sm"
              >
                {t('signIn') || 'Sign In'}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-text p-2 rounded-lg hover:bg-neutral-900/5 transition-all duration-200"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`block transition-all duration-300 ${menuOpen ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100'}`}>
              <Menu size={24} />
            </span>
            {menuOpen ? <X size={24} /> : null}
          </button>
        </div>
      </nav>

      {/* ── Mobile sheet ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-400 ease-out md:hidden ${
          menuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="px-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-text">
              Denta<span className="text-accent-soft">Care</span>
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 rounded-full bg-gray-100 text-sub hover:text-neutral-900 transition-all"
              aria-label="Close menu"
            >
              <X size={17} />
            </button>
          </div>

          {isAuthenticated && role === 'patient' && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl">
              <Avatar user={user} getInitials={getInitials} size="md" />
              <div className="min-w-0">
                <p className="font-semibold text-text truncate">{user?.name}</p>
                <p className="text-xs text-sub truncate">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        <nav className="px-6 py-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavigation(e, link)}
              className={`flex items-center justify-between py-3.5 text-base font-medium border-b border-border/60 last:border-0 transition-colors ${
                isActive(link) ? 'text-primary' : 'text-text/75 hover:text-primary-deep'
              }`}
            >
              {t(link.label.toLowerCase()) || link.label}
              <ChevronRight size={16} className="text-muted shrink-0" />
            </a>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-border space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setMenuOpen(false); navigate('/admin/login') }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-500 text-sub text-sm font-medium hover:bg-gray-50 hover:text-black transition duration-200"
            >
              <Shield size={15} /> {t('adminLogin') || 'Admin'}
            </button>
            <button
              onClick={() => { setMenuOpen(false); navigate('/doctor/login') }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-500 text-sub text-sm font-medium hover:bg-gray-50 hover:text-black transition duration-200"
            >
              <Stethoscope size={15} /> {t('doctorLogin') || 'Doctor'}
            </button>
          </div>

          <div className="pt-1 pb-0.5">
            <div onClick={() => setMenuOpen(false)}>
              <LanguageToggle />
            </div>
          </div>

          {isAuthenticated && role === 'patient' ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-500 text-sub text-sm font-medium hover:bg-gray-50 hover:text-black transition duration-200"
              >
                <User size={15} /> {t('myProfile')}
              </Link>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition duration-200"
              >
                <LogOut size={15} /> {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/Auth"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors duration-200 shadow-sm"
            >
              {t('signIn')}
            </Link>
          )}
        </div>
        <div className="h-safe-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      </div>
    </>
  )
}

// ── Sub-components ──────────────────────────────────────────

function Avatar({ user, getInitials, size = 'sm' }) {
  const dim = size === 'md' ? 'w-10 h-10 text-base' : 'w-9 h-9 text-sm'
  return user?.image ? (
    <img
      src={user.image}
      alt={user.name}
      className={`${dim} rounded-full object-cover border-2 border-primary-soft shrink-0`}
    />
  ) : (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-primary-deep to-primary flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {getInitials(user?.name)}
    </div>
  )
}

function StaffMenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sub hover:bg-gray-50 hover:text-black transition-colors duration-200"
    >
      {icon} {label}
    </button>
  )
}