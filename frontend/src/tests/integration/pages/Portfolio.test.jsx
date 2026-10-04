import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Portfolio from '../../../pages/Portfolio.jsx'
import { en } from '../../../i18n/languages/en.jsx'
import { youtubeVideos } from '../../fixtures/youtube.js'

// Integration test: wires Portfolio together with real project data,
// translations and doc-url helpers, verifying the card -> modal -> close flow.
describe('Portfolio (integration)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => youtubeVideos }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('opens the latest YouTube videos in a popup from its card', async () => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )

    expect(screen.getByText(en.projects.pauhelper.title)).toBeInTheDocument()
    expect(screen.getByText(en.projects.orchestratordata.title)).toBeInTheDocument()
    expect(screen.getByText(en.projects.voicesimulator.title)).toBeInTheDocument()
    expect(screen.getByText(en.externalLink.title)).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
    const card = screen.getByRole('button', { name: /YouTube Channel/ })
    await user.click(card)
    const dialog = screen.getByRole('dialog', { name: en.externalLink.title })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(await screen.findByRole('link', { name: youtubeVideos[0].title })).toHaveAttribute('href', youtubeVideos[0].url)
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(3)
    expect(document.body.style.overflow).toBe('hidden')
    await user.click(within(dialog).getByRole('button', { name: en.externalLink.close }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
    expect(card).toHaveFocus()
  })

  it('traps keyboard focus and closes on Escape or a backdrop click, but not content clicks', async () => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )
    const card = screen.getByRole('button', { name: /YouTube Channel/ })
    await user.click(card)
    const dialog = screen.getByRole('dialog')
    const close = within(dialog).getByRole('button', { name: 'Close' })
    await screen.findByRole('list')
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(within(dialog).getByRole('link', { name: en.externalLink.cta })).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
    await user.click(within(dialog).getByText(en.externalLink.latestVideos))
    expect(dialog).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(card).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.click(screen.getByRole('dialog').parentElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(card).toHaveFocus()
  })

  it('opens the project modal with the right content when a card is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )

    await user.click(screen.getByText(en.projects.pauhelper.title))

    expect(screen.getByText(en.projects.pauhelper.fullDescription)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: en.modal.viewTechnicalDocs })).toHaveAttribute(
      'href',
      '/assets/projects/1-pauhelper/docs/en/techdoc.pdf'
    )
  })

  it('closes the modal when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )

    await user.click(screen.getByText(en.projects.pauhelper.title))
    expect(screen.getByText(en.projects.pauhelper.fullDescription)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByText(en.projects.pauhelper.fullDescription)).not.toBeInTheDocument()
  })

  it('propagates theme toggle and language change callbacks from the header', async () => {
    const user = userEvent.setup()
    const onToggleTheme = vi.fn()
    const onChangeLanguage = vi.fn()
    render(
      <Portfolio
        theme="dark"
        onToggleTheme={onToggleTheme}
        language="en"
        onChangeLanguage={onChangeLanguage}
        t={en}
      />
    )

    await user.click(screen.getByRole('button', { name: /toggle color theme/i }))
    expect(onToggleTheme).toHaveBeenCalledTimes(1)

    await user.selectOptions(screen.getByRole('combobox'), 'es')
    expect(onChangeLanguage).toHaveBeenCalledWith('es')
  })
})
