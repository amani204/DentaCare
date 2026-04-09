import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'  
import LoginCard from '../../components/ui/loginCard'
import LanguageToggle from '../../components/ui/LanguageToggle'
import { useFadeIn } from '../../hooks/gsap'
import api from '../../lib/axios'
import useT from '../../hooks/useT'
import useAuthStore from '../../store/useAuth'
import { toast } from 'react-hot-toast'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()  
  const t = useT()
  const { login } = useAuthStore()
  
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [tempEmail, setTempEmail] = useState('')

  const cardContainerRef = useRef(null)
  const from = location.state?.from || '/profile'

  useFadeIn(cardContainerRef, { y: 30, scale: 0.96, duration: 0.6 })

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
      const { data } = await api.post('/user/login', {
        email: formData.email,
        password: formData.password,
      })
      if (data.success) {
        login(data.token, data.user, 'patient')
        toast.success(t('loginSuccess') || 'Login successful!')
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
      const { data } = await api.post('/user/register', {
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
      const { data } = await api.post('/user/send-reset-otp', { email: formData.email })
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
      const { data } = await api.post('/user/verify-reset-otp', {
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
        const { data } = await api.post('/user/reset-password', {
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-[#CDE9FF]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-[#CDE9FF]/5 rounded-full blur-[100px]" />
        <div className="absolute top-6 right-6">
          <LanguageToggle />
        </div>
        <div ref={cardContainerRef} className="opacity-0">
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
      </div>
  )
}