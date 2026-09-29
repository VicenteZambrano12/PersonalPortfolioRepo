import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Portfolio from '../../../pages/Portfolio.jsx'
import { en } from '../../../i18n/languages/en.jsx'

// Integration test: wires Portfolio together with real project data,
// translations and doc-url helpers, verifying the card -> modal -> close flow.
describe('Portfolio (integration)', () => {
  it('renders a card for every project plus the external YouTube link', () => {
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )

    expect(screen.getByText(en.projects.pauhelper.title)).toBeInTheDocument()
    expect(screen.getByText(en.projects.orchestratordata.title)).toBeInTheDocument()
    expect(screen.getByText(en.projects.voicesimulator.title)).toBeInTheDocument()
    expect(screen.getByText(en.externalLink.title)).toBeInTheDocument()
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
