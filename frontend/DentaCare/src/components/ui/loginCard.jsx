// src/components/ui/loginCard.jsx
import { useState, useEffect, useRef } from 'react'
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, User, Phone, ArrowLeft, Send, KeyRound, ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/utils'
import useT from '../../hooks/useT'
import gsap from 'gsap'

export const LoginCard = ({
  buttonText = "Sign In",
  isLoading = false,
  error = null,
  onSubmit,
  onForgotPassword,
  mode = "login",
  simple = false,
  role = 'patient', // 'admin', 'doctor', 'patient'
  className,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  
  const cardRef = useRef(null)
  const formRef = useRef(null)
  
  const t = useT()

  // When simple is true, force mode to 'login'
  const effectiveMode = simple ? 'login' : mode
  const isLogin = effectiveMode === 'login'
  const isSignup = !simple && effectiveMode === 'signup'
  const isForgot = !simple && effectiveMode === 'forgot'
  const isVerifyOTP = !simple && effectiveMode === 'verify-otp'
  const isResetPassword = !simple && effectiveMode === 'reset-password'

  // For admin/doctor, we hide extra flows
  const isStaff = role === 'admin' || role === 'doctor'

  useEffect(() => {
    if (!simple && formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [mode, simple])

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(0.4)' }
      )
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (simple || isStaff) {
      onSubmit?.({ email, password })
    } else {
      if (isLogin) {
        onSubmit?.({ email, password })
      } else if (isSignup) {
        onSubmit?.({ name, email, password, phone })
      } else if (isForgot) {
        onSubmit?.({ email })
      } else if (isVerifyOTP) {
        onSubmit?.({ email, otp: otpCode })
      } else if (isResetPassword) {
        onSubmit?.({ 
          otp: otpCode, 
          newPassword: newPassword,
          confirmPassword: confirmPassword 
        })
      }
    }
  }

  const handleSendOTP = () => {
    if (email) {
      setOtpSent(true)
      onForgotPassword?.({ email })
    }
  }

  // Placeholders - manual for staff, dynamic for patient
  const emailPlaceholder = (role === 'admin' && isStaff ) ? 'admin@dentacare.com' : (role === 'doctor' && isStaff) ?  'doctor@dentacare.com' : 'patient@gmail.com'
  const namePlaceholder = 'Amani Adj'

  const getWelcomeText = () => {
    if (role === 'admin') return t('welcomeAdmin') || 'Welcome Admin'
    if (role === 'doctor') return t('welcomeDoctor') || 'Welcome Doctor'
    if (simple) return t('welcome') || 'Welcome Back'
    if (isSignup) return t('registerPatient') || 'Create Account'
    if (isForgot) return t('forgotPassword') || 'Forgot Password?'
    if (isVerifyOTP) return t('verifyOTP') || 'Verify OTP'
    if (isResetPassword) return t('resetPassword') || 'Reset Password'
    return t('welcomePatient') || 'Welcome Back'
  }
  
  const getSubText = () => {
    // For admin/doctor, no subtext
    if (role === 'admin' || role === 'doctor') return ''
    if (isSignup) return t('createAccount') || 'Create your account'
    if (isForgot) return t('forgotPasswordDesc') || 'Enter your email to receive OTP'
    if (isVerifyOTP) return t('enterOTP') || `Enter the 6-digit code sent to ${email}`
    if (isResetPassword) return t('enterNewPassword') || 'Enter your new password'
    return t('enterCredentials') || 'Sign in to book appointments'
  }
  
  const getIcon = () => {
    if (role === 'admin' || role === 'doctor') return LogIn
    if (isSignup) return UserPlus
    if (isForgot || isVerifyOTP) return Mail
    if (isResetPassword) return KeyRound
    return LogIn
  }
  
  const Icon = getIcon()
  const iconBgClass = "bg-accent-soft/10"
  const iconColorClass = "text-accent-soft"

  return (
    <div ref={cardRef} className={cn("w-full max-w-md mx-auto opacity-0", className)}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-primary/20">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl ${iconBgClass} flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110`}>
            <Icon size={32} className={iconColorClass} />
          </div>
          <h1 className="text-2xl font-bold text-primary-deep mb-1">
            Denta<span className="text-accent-soft">Care</span>
          </h1>
        </div>

        {/* Back button for non-login modes (only patient non-simple) */}
        {!simple && !isStaff && (isForgot || isVerifyOTP || isResetPassword) && (
          <button
            onClick={() => {
              if (isVerifyOTP || isResetPassword) {
                window.dispatchEvent(new CustomEvent('backToForgot'))
              } else {
                window.dispatchEvent(new CustomEvent('backToLogin'))
              }
            }}
            className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={25} /> 
          </button>
        )}

        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-text">{getWelcomeText()}</h2>
          {getSubText() && <p className="text-xs text-muted mt-1">{getSubText()}</p>}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-500 text-sm text-center animate-shake">
            {error}
          </div>
        )}
        
        {!simple && !isStaff && otpSent && !error && isForgot && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
            {t('otpSent') || 'OTP sent to your email!'}
          </div>
        )}
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (only for patient signup) */}
          {!simple && !isStaff && isSignup && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-text mb-1.5">
                {t('fullName') || 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={namePlaceholder}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder}
                required={!isVerifyOTP}
                readOnly={!simple && !isStaff && isVerifyOTP}
                className={`w-full pl-10 pr-3 py-2.5 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all ${!simple && !isStaff && isVerifyOTP ? 'bg-gray-50 text-gray-500' : ''}`}
              />
            </div>
          </div>

          {/* Phone Field (only for patient signup) */}
          {!simple && !isStaff && isSignup && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-text mb-1.5">
                {t('phone') || 'Phone Number'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+213 5XX XX XX XX"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* OTP Field (patient verify-otp mode) */}
          {!simple && !isStaff && isVerifyOTP && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-text mb-1.5">
                {t('otpCode') || 'OTP Code'}
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  required
                  maxLength={6}
                  className="w-full pl-10 pr-3 py-2.5 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-center text-lg tracking-widest"
                />
              </div>
              <p className="text-xs text-muted mt-1 text-center">
                {t('otpHint') || "Enter the 6-digit code sent to your email"}
              </p>
            </div>
          )}

          {/* Password Field */}
          {(isLogin || (!simple && !isStaff && isSignup) || (!simple && !isStaff && isResetPassword)) && (
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {(!simple && !isStaff && isResetPassword) ? (t('newPassword') || 'New Password') : t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={(!simple && !isStaff && isResetPassword) ? newPassword : password}
                  onChange={(e) => (!simple && !isStaff && isResetPassword) ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password Field (patient reset-password mode) */}
          {!simple && !isStaff && isResetPassword && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-text mb-1.5">
                {t('confirmPassword') || 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Forgot Password Link (only for patient login) */}
          {!simple && !isStaff && isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('switchToForgot'))}
                className="text-xs text-primary hover:text-primary/70 transition-colors"
              >
                {t('forgotPassword') || 'Forgot password?'}
              </button>
            </div>
          )}

          {/* Resend OTP button (patient verify-otp) */}
          {!simple && !isStaff && isVerifyOTP && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleSendOTP}
                className="text-xs text-primary hover:text-primary/70 transition-colors"
              >
                {t('resendOTP') || "Didn't receive code? Resend"}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-soft hover:bg-accent-soft/80 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {!simple && !isStaff && isSignup ? (t('creating') || 'Creating...') : 
                 !simple && !isStaff && isForgot ? (t('sending') || 'Sending...') :
                 !simple && !isStaff && isVerifyOTP ? (t('verifying') || 'Verifying...') :
                 !simple && !isStaff && isResetPassword ? (t('resetting') || 'Resetting...') :
                 (t('signIn') || 'Signing in...')}
              </>
            ) : (
              <>
                {!simple && !isStaff && isSignup && <UserPlus size={18} />}
                {!simple && !isStaff && isForgot && <Send size={18} />}
                {!simple && !isStaff && isVerifyOTP && <ShieldCheck size={18} />}
                {!simple && !isStaff && isResetPassword && <KeyRound size={18} />}
                {(simple || isStaff || isLogin) && <LogIn size={18} />}
                {!simple && !isStaff && isSignup ? (t('signIn') || 'Sign Up') : 
                 !simple && !isStaff && isForgot ? (t('sendOTP') || 'Send OTP') :
                 !simple && !isStaff && isVerifyOTP ? (t('verifyOTP') || 'Verify OTP') :
                 !simple && !isStaff && isResetPassword ? (t('resetPassword') || 'Reset Password') :
                 buttonText}
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Link (only for patient login/signup) */}
        {!simple && !isStaff && (isLogin || isSignup) && (
          <div className="mt-6 pt-4 border-t border-border text-center">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('switchAuthMode'))}
              className="text-xs text-primary hover:text-primary/70 transition-colors"
            >
              {isSignup 
                ? (t('alreadyHaveAccount') || 'Already have an account? Sign in →')
                : (t('noAccount') || "Don't have an account? Sign up →")
              }
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-muted">
            DentaCare Management System © 2026
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginCard