import { getStyles } from '../utils/styles.jsx'

const LANGUAGES = ['en', 'es']

function LanguageSwitcher({ theme, language, onChangeLanguage, t }) {
  const styles = getStyles(theme)

  return (
    <select
      value={language}
      onChange={(event) => onChangeLanguage(event.target.value)}
      className="language-switcher h-10 rounded-full px-3 text-sm font-medium transition-colors cursor-pointer"
      style={styles.languageSwitcher}
      aria-label={t.languageSwitcher.label}
    >
      {LANGUAGES.map((code) => (
        <option key={code} value={code}>
          {t.languageSwitcher[code]}
        </option>
      ))}
    </select>
  )
}

export default LanguageSwitcher
