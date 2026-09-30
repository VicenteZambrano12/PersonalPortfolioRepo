import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from '../../../components/Footer.jsx'
import { en } from '../../../i18n/languages/en.jsx'

describe('Footer', () => {
  it('renders the current year and translated rights text', () => {
    render(<Footer theme="dark" t={en} />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(en.footer.rights))).toBeInTheDocument()
  })
})
