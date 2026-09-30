import Portfolio from './pages/Portfolio.jsx'
import { useTheme } from './utils/useTheme.js'
import { useLanguage } from './i18n/useLanguage.js'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  return (
    <Portfolio
      theme={theme}
      onToggleTheme={toggleTheme}
      language={language}
      onChangeLanguage={setLanguage}
      t={t}
    />
  )
}

export default App
