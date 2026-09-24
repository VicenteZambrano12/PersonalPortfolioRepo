import { getStyles } from '../utils/styles.jsx'

function Footer({ theme }) {
  const styles = getStyles(theme)

  return (
    <footer className="py-8 text-center text-sm transition-colors duration-300" style={styles.siteFooter}>
      <p>&copy; {new Date().getFullYear()} Vicente Zambrano Andrada. All rights reserved.</p>
    </footer>
  )
}

export default Footer
