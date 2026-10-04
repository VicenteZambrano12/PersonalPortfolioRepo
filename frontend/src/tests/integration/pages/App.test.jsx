import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../../App.jsx'
import { en } from '../../../i18n/languages/en.jsx'
import { es } from '../../../i18n/languages/es.jsx'
import { youtubeVideos } from '../../fixtures/youtube.js'

// Full integration test: App wires the real useTheme/useLanguage hooks into
// Portfolio, so this exercises theme + language state end-to-end through the UI.
describe('App (integration)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => youtubeVideos }))
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders the portfolio with the default English copy', () => {
    render(<App />)
    expect(screen.getByText(en.portfolio.heading)).toBeInTheDocument()
  })

  it('toggles the theme and reflects it on <html data-theme>', async () => {
    const user = userEvent.setup()
    render(<App />)

    const initialTheme = document.documentElement.getAttribute('data-theme')
    await user.click(screen.getByRole('button', { name: /toggle color theme/i }))

    expect(document.documentElement.getAttribute('data-theme')).not.toBe(initialTheme)
  })

  it('switches the displayed language when a new one is selected', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText(en.portfolio.heading)).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox'), 'es')

    expect(screen.getByText(es.portfolio.heading)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Canal de YouTube/ }))
    expect(screen.getByText(es.externalLink.latestVideos)).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: youtubeVideos[0].title })).toHaveAttribute('href', youtubeVideos[0].url)
    expect(window.localStorage.getItem('portfolio-language')).toBe('es')
  })
})
