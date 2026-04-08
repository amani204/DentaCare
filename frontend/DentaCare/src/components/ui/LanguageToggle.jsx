import useAdminStore from '../../store/adminStore';
import useT from '../../hooks/useT';

export default function LanguageToggle() {
  const { lang, toggleLang } = useAdminStore();
  const t = useT();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-sub hover:text-primary transition-all duration-200"
      title={t('toggleLanguage') || "Toggle language"}
    >
      <span>{lang === 'en' ? '🇬🇧' : '🇫🇷'}</span>
      <span>{lang === 'en' ? 'English' : 'Français'}</span>
      <span className="text-xs text-muted">({lang === 'en' ? 'EN' : 'FR'})</span>
    </button>
  );
}