import useAdminStore from '../store/adminStore'
import useDoctorStore from '../store/doctorStore' 
import { translations } from '../lib/i18n'

export default function useT() {
  // Listen to both. If one changes, the hook re-renders.
  const adminLang = useAdminStore((s) => s.lang)
  const doctorLang = useDoctorStore((s) => s.lang)
  
  // Use doctorLang if it exists (for doctor app), otherwise fallback to admin
  const lang = doctorLang || adminLang || 'en'

  return (key) => translations[lang]?.[key] ?? translations.en[key] ?? key
}