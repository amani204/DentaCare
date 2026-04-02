import useDoctorStore from '../store/doctorStore'
import { translations } from '../lib/i18n'
export default function useDT() {
  const lang = useDoctorStore((s) => s.lang)
  return (key) => translations[lang]?.[key] ?? translations.en[key] ?? key
}