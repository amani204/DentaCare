import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDoctorStore from '../../store/doctorStore';
import useDT from '../../hooks/useDT';
import api from '../../lib/axios';
import LoginCard from '../../components/ui/loginCard';

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setAuth, lang, toggleLang } = useDoctorStore();
  const t = useDT();

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/doctor/login', { email, password });
      if (data.success) {
        setAuth(data.dtoken, data.doctor);
        navigate('/doctor/dashboard');
      } else {
        setError(data.message || t('error'));
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-[#CDE9FF]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-[#CDE9FF]/5 rounded-full blur-[100px]" />
        {/* Language Switcher */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-sub hover:text-primary-deep hover:bg-primary-deep/5 rounded-lg transition-all bg-white/50 backdrop-blur-sm"
            title="Toggle language"
          >
            <span>{lang === 'en' ? '🇬🇧' : '🇫🇷'}</span>
            <span>{lang === 'en' ? 'English' : 'Français'}</span>
          </button>
        </div>

        {/* Login Card */}
        <LoginCard
  role="doctor"
  simple={true}
  buttonText={t('signIn')}
  isLoading={loading}
  error={error}
  onSubmit={handleSubmit}
/>
      </div>
  
  );
}