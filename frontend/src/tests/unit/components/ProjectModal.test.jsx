import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProjectModal from '../../../components/ProjectModal.jsx'
import { en } from '../../../i18n/languages/en.jsx'
import { es } from '../../../i18n/languages/es.jsx'

const project = {
  title: 'Test Project',
  subtitle: 'Test Subtitle',
  thumbUrl: '/thumb.png',
  fullDescription: 'Full description text',
  modalTags: ['React'],
  slug: 'test-project',
}

describe('ProjectModal', () => {
  it('renders the project details', () => {
    render(<ProjectModal project={project} theme="dark" t={en} onClose={() => {}} />)

    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Full description text')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: project.title })).toHaveAttribute('aria-modal', 'true')
    expect(screen.queryByRole('link', { name: /Open Live App/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: en.modal.openLiveApp })).toBeDisabled()
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument()
  })

  it('requests an integrated presentation for each audience', async () => {
    const user = userEvent.setup()
    const onOpenPresentation = vi.fn()
    render(<ProjectModal project={project} theme="dark" t={en} onClose={() => {}} onOpenPresentation={onOpenPresentation} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.indexOf(screen.getByRole('button', { name: en.modal.viewBusinessPresentation })))
      .toBeLessThan(buttons.indexOf(screen.getByRole('button', { name: en.modal.viewTechnicalPresentation })))
    await user.click(screen.getByRole('button', { name: en.modal.viewTechnicalPresentation }))
    expect(onOpenPresentation).toHaveBeenLastCalledWith(project, 'technical')
    await user.click(screen.getByRole('button', { name: en.modal.viewBusinessPresentation }))
    expect(onOpenPresentation).toHaveBeenLastCalledWith(project, 'business')
  })

  it.each(['light', 'dark'])('renders the live app link when a URL is configured in %s mode', (theme) => {
    render(
      <ProjectModal
        project={{ ...project, liveUrl: 'https://orchestrator.example.com' }}
        theme={theme}
        t={en}
        onClose={() => {}}
      />
    )

    expect(screen.getByRole('link', { name: /Open Live App/ })).toHaveAttribute(
      'href',
      'https://orchestrator.example.com'
    )
    expect(screen.getByRole('link', { name: /Open Live App/ })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: /Open Live App/ })).toBeVisible()
  })

  it.each([en, es])('keeps the demo action visible with an explanation when no URL is configured ($code)', (t) => {
    render(<ProjectModal project={project} theme="light" t={t} onClose={() => {}} />)
    const button = screen.getByRole('button', { name: t.modal.openLiveApp })
    expect(button).toBeVisible()
    expect(button).toBeDisabled()
    expect(button).toHaveAccessibleDescription(t.modal.demoUnavailable)
    expect(screen.queryByRole('link', { name: t.modal.openLiveApp })).not.toBeInTheDocument()
  })

  it('still wakes the on-demand demo when its configured link is clicked', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true })
    try {
      render(
        <ProjectModal
          project={{ ...project, liveUrl: 'https://demo.example.com', vmStarterUrl: 'https://starter.example.com' }}
          theme="dark"
          t={en}
          onClose={() => {}}
        />
      )
      const link = screen.getByRole('link', { name: en.modal.openLiveApp })
      link.addEventListener('click', (event) => event.preventDefault())
      await user.click(link)
      expect(fetchMock).toHaveBeenCalledWith('https://starter.example.com')
    } finally {
      fetchMock.mockRestore()
    }
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

  it('contains focus and restores the trigger and previous scroll lock', async () => {
    const user = userEvent.setup()
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    document.body.style.overflow = 'hidden'
    const { unmount } = render(<ProjectModal project={project} theme="light" t={en} onClose={() => {}} />)
    const close = screen.getByRole('button', { name: en.modal.close })
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: en.modal.viewTechnicalPresentation })).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
    unmount()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
    document.body.style.overflow = ''
    trigger.remove()
  })
})
