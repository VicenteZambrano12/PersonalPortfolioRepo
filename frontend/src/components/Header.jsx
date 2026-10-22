import { getStyles } from '../utils/styles.jsx'
import { socialLinks } from '../config/links.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'

function Header({ theme, onToggleTheme, language, onChangeLanguage, t }) {
  const styles = getStyles(theme)

  return (
    <header
      className="backdrop-blur-md relative z-30 transition-colors duration-300"
      style={styles.siteHeader}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/logo.png" alt="Portfolio logo" width="56" height="56" className="brand-logo w-12 h-12 md:w-14 md:h-14 flex-shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={styles.siteHeaderTitle}>
              Vicente Zambrano Andrada
            </h1>
            <p className="mt-1 text-sm" style={styles.siteHeaderSubtitle}>{t.header.subtitle}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {socialLinks.map(({ id, label, href, icon }) => (
            <a
              key={id}
              href={href || '#'}
              target={href ? '_blank' : undefined}
              rel={href ? 'noopener noreferrer' : undefined}
              className="social-link inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors"
              style={styles.socialIcon}
              aria-label={label}
            >
              <i className={`ph ${icon} text-2xl`} aria-hidden="true"></i>
            </a>
          ))}
          <LanguageSwitcher theme={theme} language={language} onChangeLanguage={onChangeLanguage} t={t} />
          <form action="/auth/logout" method="post">
            <button type="submit" className="social-link rounded-full px-3 text-sm transition-colors" style={styles.socialIcon}>
              {t.header.signOut}
            </button>
          </form>
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle w-11 h-11 rounded-full flex items-center justify-center transition-colors"
            style={styles.themeToggle}
            aria-label={t.header.toggleTheme}
            aria-pressed={theme === 'light'}
            title={theme === 'dark' ? t.header.lightTheme : t.header.darkTheme}
          >
            <i className={`ph-fill ${theme === 'dark' ? 'ph-sun' : 'ph-moon'} text-xl`} aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
