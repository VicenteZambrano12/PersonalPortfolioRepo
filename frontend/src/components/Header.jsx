import { getStyles } from '../utils/styles.jsx'
import { socialLinks } from '../config/links.jsx'
import robotIcon from '../assets/robot-icon.svg'
import LanguageSwitcher from './LanguageSwitcher.jsx'

function Header({ theme, onToggleTheme, language, onChangeLanguage, t }) {
  const styles = getStyles(theme)

  return (
    <header
      className="backdrop-blur-md sticky top-0 z-30 shadow-sm transition-colors duration-300"
      style={styles.siteHeader}
    >
      <div className="max-w-5xl mx-auto px-6 py-8 md:py-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={robotIcon} alt="Portfolio logo" className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={styles.siteHeaderTitle}>
              Vicente Zambrano Andrada
            </h1>
            <p className="mt-2 text-lg" style={styles.siteHeaderSubtitle}>{t.header.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {socialLinks.map(({ id, label, href, icon }) => (
            <a
              key={id}
              href={href || '#'}
              target={href ? '_blank' : undefined}
              rel={href ? 'noopener noreferrer' : undefined}
              className="social-link transition-colors"
              style={styles.socialIcon}
              aria-label={label}
            >
              <i className={`ph ${icon} text-3xl`}></i>
            </a>
          ))}
          <LanguageSwitcher theme={theme} language={language} onChangeLanguage={onChangeLanguage} t={t} />
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={styles.themeToggle}
            aria-label="Toggle color theme"
          >
            <i className={`ph-fill ${theme === 'dark' ? 'ph-sun' : 'ph-moon'} text-xl`}></i>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
