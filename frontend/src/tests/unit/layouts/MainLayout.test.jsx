import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MainLayout from '../../../layouts/MainLayout.jsx'

describe('MainLayout', () => {
  it('renders the header, children and footer in order', () => {
    render(
      <MainLayout theme="dark" header={<div>HEADER</div>} footer={<div>FOOTER</div>}>
        <p>CONTENT</p>
      </MainLayout>
    )

    const main = screen.getByText('CONTENT').closest('main')
    expect(main).toBeInTheDocument()
    expect(screen.getByText('HEADER')).toBeInTheDocument()
    expect(screen.getByText('FOOTER')).toBeInTheDocument()
  })
})
