// src/components/ui/login-card.jsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Stethoscope, UserCog } from 'lucide-react';
import { cn } from '../../lib/utils';
import useT from '../../hooks/useT';
import useDT from '../../hooks/useDT';

export const LoginCard = ({
  buttonText = "Sign In",
  isLoading = false,
  error = null,
  onSubmit,
  role = "admin", 
  className,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Use appropriate translation hook based on role
  const t = role === 'doctor' ? useDT() : useT();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(email, password);
  };

  // Dynamic content based on role
  const isDoctor = role === 'doctor';
  
  const emailPlaceholder = isDoctor ? "doctor@dentacare.com" : "admin@dentacare.com";
  const welcomeText = isDoctor ? t('welcomeDoctor') : t('welcomeAdmin');
  const buttonTextTranslated = buttonText || t('signIn');
  const Icon = isDoctor ? Stethoscope : UserCog;
  const iconBgClass = "bg-accent-soft/10";
  const iconColorClass = "text-accent-soft";

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-primary/20">
        {/* Logo & Role Icon */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl ${iconBgClass} flex items-center justify-center mx-auto mb-4`}>
            <Icon size={32} className={iconColorClass} />
          </div>
          <h1 className="text-2xl font-bold text-primary-deep mb-1">
            Denta<span className="text-accent-soft">Care</span>
          </h1>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-text">{welcomeText}</h2>
          <p className="text-xs text-muted mt-1">{t('enterCredentials')}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                required
                className="w-full pl-10 pr-3 py-2.5 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-soft hover:bg-accent-soft/80 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('signIn')}
              </>
            ) : (
              <>
                <LogIn size={18} />
                {buttonTextTranslated}
              </>
            )}
          </button>
        </form>

        {/* Role Switch Link */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <a 
            href={isDoctor ? "/" : "/doctor/login"} 
            className="text-xs text-primary hover:text-primary/70 transition-colors"
          >
            {isDoctor ? t('adminLogin') : t('doctorLogin')}
          </a>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted">
            DentaCare Management System © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;