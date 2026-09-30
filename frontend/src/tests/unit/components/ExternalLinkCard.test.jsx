import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ExternalLinkCard from '../../../components/ExternalLinkCard.jsx'

describe('ExternalLinkCard', () => {
  it('renders as a link pointing to the given href, opened in a new tab', () => {
    render(
      <ExternalLinkCard
        href="https://youtube.com/"
        icon="ph-youtube-logo"
        title="YouTube Channel"
        subtitle="Content Creator"
        tagline="AI explained for skeptics"
        cta="Visit Channel"
        theme="dark"
      />
    )

    const link = screen.getByRole('link', { name: /YouTube Channel/ })
    expect(link).toHaveAttribute('href', 'https://youtube.com/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(screen.getByText('Visit Channel')).toBeInTheDocument()
    expect(screen.getByText('AI explained for skeptics')).toBeInTheDocument()
  })
})
