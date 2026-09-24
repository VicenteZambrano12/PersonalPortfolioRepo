import { getStyles } from '../utils/styles.jsx'

function MainLayout({ theme, header, footer, children }) {
  const { backgroundColor, color } = getStyles(theme).pageContainer

  return (
    <div
      className="antialiased min-h-screen flex flex-col relative transition-colors duration-300"
      style={{ backgroundColor, color }}
    >
      {header}
      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full">{children}</main>
      {footer}
    </div>
  )
}

export default MainLayout
