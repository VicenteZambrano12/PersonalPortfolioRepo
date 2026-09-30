import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProjectCard from '../../../components/ProjectCard.jsx'

const project = {
  icon: 'ph-robot',
  title: 'Test Project',
  subtitle: 'Test Subtitle',
  description: 'A short description',
  tags: ['React', 'Vite'],
}

describe('ProjectCard', () => {
  it('renders the project title, subtitle, description and tags', () => {
    render(<ProjectCard project={project} theme="dark" onSelect={() => {}} />)

    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    expect(screen.getByText('A short description')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Vite')).toBeInTheDocument()
  })

  it('calls onSelect when the card is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<ProjectCard project={project} theme="dark" onSelect={onSelect} />)

    await user.click(screen.getByText('Test Project'))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
