import { useState } from 'react'
import useAdminStore from '../store/adminStore'
import useT from '../hooks/useT'
import api from '../lib/axios'
import { Globe } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { setAToken, lang, toggleLang } = useAdminStore()  // ← Use toggleLang
  const t = useT()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
      } else {
        setError(data.message || t('error'))
      }
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden">

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 flex gap-1 z-20">
          <button
     onClick={toggleLang}
     className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-sub hover:text-black hover:bg-primary/5 rounded-lg transition-all"
     title="Toggle language"
    >
     <Globe size={16} />
     <span>{lang === 'en' ? 'English' : 'Français'}</span>
     <span className="text-xs text-muted">({lang === 'en' ? 'EN' : 'FR'})</span>
    </button>
      </div>

      {/* card */}
      <div className="glass w-full max-w-sm p-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-xl font-bold text-text mb-2">
            Denta<span className="text-primary">Care</span>
          </h1>
          <p className="sub-text text-xs">{t('adminPanel')}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 rounded-lg px-3 py-2 text-xs mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {t('email')}
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@dentacare.com" 
              required 
              className="input" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {t('password')}
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              className="input" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full mt-1 py-3 rounded-xl"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>

        {/* Footer */}
        <p className="sub-text text-center text-xs mt-6">
          DentaCare Management System © 2026
        </p>
      </div>
    </div>
  )
}