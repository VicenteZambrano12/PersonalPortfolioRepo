import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Header from '../../../components/Header.jsx'
import { en } from '../../../i18n/languages/en.jsx'

describe('Header', () => {
  it('renders the site title and translated subtitle', () => {
    render(
      <Header theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )

    expect(screen.getByText('Vicente Zambrano Andrada')).toBeInTheDocument()
    expect(screen.getByText(en.header.subtitle)).toBeInTheDocument()
  })

  it('calls onToggleTheme when the theme button is clicked', async () => {
    const user = userEvent.setup()
    const onToggleTheme = vi.fn()
    render(
      <Header theme="dark" onToggleTheme={onToggleTheme} language="en" onChangeLanguage={() => {}} t={en} />
    )

    await user.click(screen.getByRole('button', { name: /toggle color theme/i }))

    expect(onToggleTheme).toHaveBeenCalledTimes(1)
  })
})
