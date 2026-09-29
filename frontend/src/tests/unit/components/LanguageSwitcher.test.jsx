import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LanguageSwitcher from '../../../components/LanguageSwitcher.jsx'
import { en } from '../../../i18n/languages/en.jsx'

describe('LanguageSwitcher', () => {
  it('renders an option for every supported language', () => {
    render(<LanguageSwitcher theme="dark" language="en" onChangeLanguage={() => {}} t={en} />)
    expect(screen.getByRole('option', { name: en.languageSwitcher.en })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: en.languageSwitcher.es })).toBeInTheDocument()
  })

  it('selects the active language', () => {
    render(<LanguageSwitcher theme="dark" language="es" onChangeLanguage={() => {}} t={en} />)
    expect(screen.getByRole('combobox')).toHaveValue('es')
  })

  it('calls onChangeLanguage when the user picks a new language', async () => {
    const user = userEvent.setup()
    const onChangeLanguage = vi.fn()
    render(<LanguageSwitcher theme="dark" language="en" onChangeLanguage={onChangeLanguage} t={en} />)

    await user.selectOptions(screen.getByRole('combobox'), 'es')

    expect(onChangeLanguage).toHaveBeenCalledWith('es')
  })
})
