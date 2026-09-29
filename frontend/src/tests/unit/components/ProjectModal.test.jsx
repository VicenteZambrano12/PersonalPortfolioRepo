import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProjectModal from '../../../components/ProjectModal.jsx'
import { en } from '../../../i18n/languages/en.jsx'

const project = {
  title: 'Test Project',
  subtitle: 'Test Subtitle',
  thumbUrl: '/thumb.png',
  fullDescription: 'Full description text',
  modalTags: ['React'],
  techDocUrl: '/tech.pdf',
  nonTechDocUrl: '/user.pdf',
}

describe('ProjectModal', () => {
  it('renders the project details', () => {
    render(<ProjectModal project={project} theme="dark" t={en} onClose={() => {}} />)

    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Full description text')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ProjectModal project={project} theme="dark" t={en} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ProjectModal project={project} theme="dark" t={en} onClose={onClose} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
