import Portfolio from './pages/Portfolio.jsx'
import { useTheme } from './utils/useTheme.js'

function App() {
  const { theme, toggleTheme } = useTheme()
  return <Portfolio theme={theme} onToggleTheme={toggleTheme} />
}

export default App
