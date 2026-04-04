// src/components/ui/login-card.jsx
import { useState, useEffect, useRef } from 'react'
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, User, Phone, ArrowLeft, Send, KeyRound, ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/utils'
import useT from '../../hooks/useT'
import gsap from 'gsap'

export const LoginCard = ({
  buttonText = "SignIn",
  isLoading = false,
  error = null,
  onSubmit,
  onForgotPassword,
  mode = "login", // 'login', 'signup', 'forgot', 'verify-otp', 'reset-password'
  className,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Forgot password states
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  
  const cardRef = useRef(null)
  const formRef = useRef(null)
  
  const t = useT()

  // Define mode booleans
  const isLogin = mode === 'login'
  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'
  const isVerifyOTP = mode === 'verify-otp'
  const isResetPassword = mode === 'reset-password'

  // GSAP animation when mode changes
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [mode])

  // Entrance animation for card
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
  
  if (mode === 'login') {
    onSubmit?.({ email, password })
  } else if (mode === 'signup') {
    onSubmit?.({ name, email, password, phone })
  } else if (mode === 'forgot') {
    onSubmit?.({ email })
  } else if (mode === 'verify-otp') {
    onSubmit?.({ email, otp: otpCode })
  } else if (mode === 'reset-password') {
    onSubmit?.({ 
      otp: otpCode, 
      newPassword: newPassword,
      confirmPassword: confirmPassword 
    })
  }
}

  const handleSendOTP = () => {
    if (email) {
      setOtpSent(true)
      onForgotPassword?.({ email })
    }
  }

  const emailPlaceholder = "patient@dentacare.com"
  const namePlaceholder = "Amani Adj"
  const getWelcomeText = () => {
    if (isSignup) return t('registerPatient') || 'Create Account'
    if (isForgot) return t('forgotPassword') || 'Forgot Password?'
    if (isVerifyOTP) return t('verifyOTP') || 'Verify OTP'
    if (isResetPassword) return t('resetPassword') || 'Reset Password'
    return t('welcomePatient') || 'Welcome Back'
  }
  
  const getSubText = () => {
    if (isSignup) return t('createAccount') || 'Create your account'
    if (isForgot) return t('forgotPasswordDesc') || 'Enter your email to receive OTP'
    if (isVerifyOTP) return t('enterOTP') || `Enter the 6-digit code sent to ${email}`
    if (isResetPassword) return t('enterNewPassword') || 'Enter your new password'
    return t('enterCredentials') || 'Sign in to book appointments'
  }
  
  const getIcon = () => {
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
        {/* Logo */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl ${iconBgClass} flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110`}>
            <Icon size={32} className={iconColorClass} />
          </div>
          <h1 className="text-2xl font-bold text-primary-deep mb-1">
            Denta<span className="text-accent-soft">Care</span>
          </h1>
        </div>

        {/* Back button for non-login modes */}
        {(isForgot || isVerifyOTP || isResetPassword) && (
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

        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-text">{getWelcomeText()}</h2>
          <p className="text-xs text-muted mt-1">{getSubText()}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-500 text-sm text-center animate-shake">
            {error}
          </div>
        )}
        
        {/* Success Message for OTP Sent */}
        {otpSent && !error && isForgot && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
            {t('otpSent') || 'OTP sent to your email!'}
          </div>
        )}
        
        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (only for signup) */}
          {isSignup && (
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

          {/* Email Field (login, signup, forgot, verify-otp) */}
          {(isLogin || isSignup || isForgot || isVerifyOTP) && (
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
                  readOnly={isVerifyOTP}
                  className={`w-full pl-10 pr-3 py-2.5 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all ${isVerifyOTP ? 'bg-gray-50 text-gray-500' : ''}`}
                />
              </div>
            </div>
          )}

          {/* Phone Field (only for signup) */}
          {isSignup && (
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

          {/* OTP Field (verify-otp mode) */}
          {isVerifyOTP && (
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

          {/* Password Field (login, signup, reset-password) */}
          {(isLogin || isSignup || isResetPassword) && (
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {isResetPassword ? (t('newPassword') || 'New Password') : t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={isResetPassword ? newPassword : password}
                  onChange={(e) => isResetPassword ? setNewPassword(e.target.value) : setPassword(e.target.value)}
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

          {/* Confirm Password Field (reset-password mode only) */}
          {isResetPassword && (
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

          {/* Forgot Password Link (only for login) */}
          {isLogin && (
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

          {/* Resend OTP button (verify-otp mode) */}
          {isVerifyOTP && (
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-soft hover:bg-accent-soft/80 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isSignup ? (t('creating') || 'Creating...') : 
                 isForgot ? (t('sending') || 'Sending...') :
                 isVerifyOTP ? (t('verifying') || 'Verifying...') :
                 isResetPassword ? (t('resetting') || 'Resetting...') :
                 (t('signIn') || 'Signing in...')}
              </>
            ) : (
              <>
                {isSignup && <UserPlus size={18} />}
                {isForgot && <Send size={18} />}
                {isVerifyOTP && <ShieldCheck size={18} />}
                {isResetPassword && <KeyRound size={18} />}
                {isLogin && <LogIn size={18} />}
                {isSignup ? (t('signIn') || 'Sign Up') : 
                 isForgot ? (t('sendOTP') || 'Send OTP') :
                 isVerifyOTP ? (t('verifyOTP') || 'Verify OTP') :
                 isResetPassword ? (t('resetPassword') || 'Reset Password') :
                 buttonText}
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Link (only for login and signup) */}
        {(isLogin || isSignup) && (
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

        {/* Footer */}
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