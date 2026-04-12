import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight, User, LogOut, Shield, Stethoscope } from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showStaffDropdown, setShowStaffDropdown] = useState(false)
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const staffDropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout, role } = useAuthStore()
  const t = useT()

  useFadeIn(navRef, { y: -20, duration: 0.8, delay: 0.2 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [menuOpen])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close staff dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (staffDropdownRef.current && !staffDropdownRef.current.contains(event.target)) {
        setShowStaffDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigation = (e, link) => {
    e.preventDefault()
    setMenuOpen(false)

    if (link.isHash) {
      const targetId = link.sectionId
      if (location.pathname !== '/') {
        navigate('/')
        const checkElement = setInterval(() => {
          const el = document.getElementById(targetId)
          if (el) {
            clearInterval(checkElement)
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
        setTimeout(() => clearInterval(checkElement), 2000)
      } else {
        const el = document.getElementById(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(link.href)
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowDropdown(false)
  }

  const getInitials = (name) => name?.split(' ').slice(0, 2).map(w => w[0]).join('') || 'U'

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
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <span className="font-bold text-xl text-text">
              Denta<span className="text-accent-soft">Care</span>
            </span>
          </Link>

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

          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <div className="w-px h-6 bg-border" />

            {/* Staff Dropdown */}
            <div className="relative" ref={staffDropdownRef}>
              <button
                onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-sub hover:text-primary transition-all duration-200 rounded-lg hover:bg-primary/5"
              >
                <Shield size={16} />
                <span className="hidden lg:inline">{t('staff') || 'Staff'}</span>
              </button>
              {showStaffDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowStaffDropdown(false)
                        navigate('/admin/login')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sub hover:bg-gray-50 hover:text-text transition"
                    >
                      <Shield size={16} /> {t('adminLogin') || 'Admin Login'}
                    </button>
                    <button
                      onClick={() => {
                        setShowStaffDropdown(false)
                        navigate('/doctor/login')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sub hover:bg-gray-50 hover:text-text transition"
                    >
                      <Stethoscope size={16} /> {t('doctorLogin') || 'Doctor Login'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-border" />

            {isAuthenticated && role === 'patient' ? (
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
              <Link to="/Auth" className="btn-primary">
                {t('signIn')}
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text p-2 rounded-lg hover:bg-primary/5 transition-all duration-200"
            aria-label="Open navigation menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[10px] shadow-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-border rounded-full" />
            </div>

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

            <div className="px-6 py-4 border-t border-border space-y-3">
              {/* Staff login options in mobile menu */}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/admin/login')
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-sub font-medium hover:bg-primary/5 transition"
              >
                <Shield size={16} /> {t('adminLogin') || 'Admin Login'}
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/doctor/login')
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-sub font-medium hover:bg-primary/5 transition"
              >
                <Stethoscope size={16} /> {t('doctorLogin') || 'Doctor Login'}
              </button>

              <div className="border-t border-border pt-3">
                <div onClick={() => setMenuOpen(false)}>
                  <LanguageToggle />
                </div>
              </div>

              {isAuthenticated && role === 'patient' ? (
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