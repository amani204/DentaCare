
import useAdminStore from '../store/adminStore'
import { translations } from '../lib/i18n'
export default function useT() {
  const lang = useAdminStore((s) => s.lang)
  return (key) => translations[lang]?.[key] ?? translations.en[key] ?? key
}