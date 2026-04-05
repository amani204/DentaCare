
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'  

import { DualGradientBg } from '../../components/ui/backgrounds'
import LoginCard from '../../components/ui/loginCard'
import api from '../../lib/axios'
import useT from '../../hooks/useT'
import useAuthStore from '../../store/useAuth'
import useAdminStore from '../../store/adminStore'
import { toast } from 'react-hot-toast'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()  
  const t = useT()
  const { login } = useAuthStore()
  const { lang, toggleLang } = useAdminStore()
  
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [tempEmail, setTempEmail] = useState('')

  // Get the page user was trying to visit before login
  const from = location.state?.from || '/profile'

  // Listen for mode switches from LoginCard
  useEffect(() => {
    const handleSwitchAuthMode = () => {
      setMode(mode === 'login' ? 'signup' : 'login')
      setError('')
    }
    const handleSwitchToForgot = () => setMode('forgot')
    const handleBackToLogin = () => setMode('login')
    const handleBackToForgot = () => setMode('forgot')
    
    window.addEventListener('switchAuthMode', handleSwitchAuthMode)
    window.addEventListener('switchToForgot', handleSwitchToForgot)
    window.addEventListener('backToLogin', handleBackToLogin)
    window.addEventListener('backToForgot', handleBackToForgot)
    
    return () => {
      window.removeEventListener('switchAuthMode', handleSwitchAuthMode)
      window.removeEventListener('switchToForgot', handleSwitchToForgot)
      window.removeEventListener('backToLogin', handleBackToLogin)
      window.removeEventListener('backToForgot', handleBackToForgot)
    }
  }, [mode])

  const handleLogin = async (formData) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/user/login', {
        email: formData.email,
        password: formData.password,
      })
      if (data.success) {
        login(data.token, data.user, 'patient')
        toast.success(t('loginSuccess') || 'Login successful!')
        
        // ✅ Redirect to the page user came from, or profile
        navigate(from)
      } else {
        setError(data.message || t('invalidCredentials'))
      }
    } catch (err) {
      setError(err.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (formData) => {
    setLoading(true)
    setError('')
    
    if (!formData || !formData.password || formData.password.length < 8) {
      setError(t('minPassword') || 'Password must be at least 8 characters')
      setLoading(false)
      return
    }
    
    try {
      const { data } = await api.post('/api/user/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })
      if (data.success) {
        toast.success(t('registrationSuccess') || 'Registration successful! Please login.')
        setMode('login')
      } else {
        setError(data.message || t('registrationFailed'))
      }
    } catch (err) {
      setError(err.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (formData) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/user/send-reset-otp', { email: formData.email })
      if (data.success) {
        setTempEmail(formData.email)
        setMode('verify-otp')
        toast.success(t('otpSent') || 'OTP sent to your email!')
      } else {
        setError(data.message || t('error'))
      }
    } catch (err) {
      setError(err.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (formData) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/user/verify-reset-otp', {
        email: formData.email,
        otp: formData.otp,
      })
      if (data.success) {
        setResetToken(data.token)
        setMode('reset-password')
        toast.success(t('otpVerified') || 'OTP verified! Please set new password.')
      } else {
        setError(data.message || t('invalidOTP'))
      }
    } catch (err) {
      setError(err.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (formData) => {
    setLoading(true)
    setError('')
    
    if (!formData || !formData.newPassword || formData.newPassword.length < 8) {
        setError(t('minPassword') || 'Password must be at least 8 characters')
        setLoading(false)
        return
    }
    
    try {
        const { data } = await api.post('/api/user/reset-password', {
            email: tempEmail,
            otp: formData.otp,
            newPassword: formData.newPassword,
        })
        if (data.success) {
            toast.success(t('passwordResetSuccess') || 'Password reset successful! Please login.')
            setMode('login')
            setTempEmail('')
        } else {
            setError(data.message || t('error'))
        }
    } catch (err) {
        setError(err.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DualGradientBg>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        
        {/* Language Switcher */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-sub hover:text-primary hover:bg-primary/5 rounded-lg transition-all bg-white/50 backdrop-blur-sm"
            title="Toggle language"
          >
            <span>{lang === 'en' ? '🇬🇧' : '🇫🇷'}</span>
            <span>{lang === 'en' ? 'English' : 'Français'}</span>
          </button>
        </div>

        <LoginCard
          mode={mode}
          isLoading={loading}
          error={error}
          buttonText={t('signIn')}
          onSubmit={
            mode === 'login' ? handleLogin :
            mode === 'signup' ? handleRegister :
            mode === 'forgot' ? handleForgotPassword :
            mode === 'verify-otp' ? handleVerifyOTP :
            handleResetPassword
          }
        />
      </div>
    </DualGradientBg>
  )
}