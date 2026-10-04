import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import YoutubeCard from '../../../components/YoutubeCard.jsx'
import { en } from '../../../i18n/languages/en.jsx'

describe('YoutubeCard', () => {
  it('is a keyboard-accessible popup trigger without inline video links', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<YoutubeCard theme="dark" t={en.externalLink} onSelect={onSelect} />)
    const card = screen.getByRole('button', { name: /YouTube Channel/ })
    expect(card).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    await user.click(card)
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onSelect).toHaveBeenCalledTimes(3)
  })
})
