import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PresentationModal from '../../../components/PresentationModal.jsx'
import { en } from '../../../i18n/languages/en.jsx'

const presentation = {
  title: 'PAUHelper - Technical Presentation',
  url: '/src/features/docs/1-pauhelper/technical.html?lang=en',
}

function notify(type, overrides = {}) {
  fireEvent(window, new MessageEvent('message', {
    origin: window.location.origin,
    source: screen.getByTitle(presentation.title).contentWindow,
    data: { type },
    ...overrides,
  }))
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('PresentationModal', () => {
  it('embeds the deck, locks scrolling, and accepts readiness only from its own same-origin frame', () => {
    render(<PresentationModal presentation={presentation} theme="dark" t={en.presentation} onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toHaveAccessibleName(presentation.title)
    expect(screen.getByTitle(presentation.title)).toHaveAttribute('src', `${presentation.url}&embed=1`)
    expect(document.body.style.overflow).toBe('hidden')
    notify('presentation-ready', { origin: 'https://other.example' })
    expect(screen.getByRole('status')).toHaveTextContent(en.presentation.loading)
    notify('presentation-ready', { source: window })
    expect(screen.getByRole('status')).toBeInTheDocument()
    notify('presentation-ready')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('closes with Escape, the close button, frame messages, or a backdrop click', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<PresentationModal presentation={presentation} theme="dark" t={en.presentation} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
    await user.click(screen.getAllByRole('button', { name: en.presentation.close })[0])
    expect(onClose).toHaveBeenCalledTimes(2)
    notify('presentation-close', { origin: 'https://other.example' })
    expect(onClose).toHaveBeenCalledTimes(2)
    notify('presentation-close')
    expect(onClose).toHaveBeenCalledTimes(3)
    await user.click(screen.getByRole('dialog').parentElement)
    expect(onClose).toHaveBeenCalledTimes(4)
  })

  it('wraps focus and restores focus and the previous scroll lock on close', async () => {
    const user = userEvent.setup()
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    document.body.style.overflow = 'hidden'
    const { unmount } = render(<PresentationModal presentation={presentation} theme="dark" t={en.presentation} onClose={() => {}} />)
    const [first, last] = screen.getAllByRole('button', { name: en.presentation.close })
    expect(first).toHaveFocus()
    await user.tab({ shift: true })
    expect(last).toHaveFocus()
    await user.tab()
    expect(first).toHaveFocus()
    unmount()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
    document.body.style.overflow = ''
    trigger.remove()
  })

  it('reports slide initialization failures and loading timeouts explicitly', () => {
    vi.useFakeTimers()
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { unmount } = render(<PresentationModal presentation={presentation} theme="dark" t={en.presentation} onClose={() => {}} />)
    act(() => vi.advanceTimersByTime(15000))
    expect(screen.getByRole('alert')).toHaveTextContent(en.presentation.error)
    expect(error).toHaveBeenCalled()
    unmount()
    render(<PresentationModal presentation={presentation} theme="dark" t={en.presentation} onClose={() => {}} />)
    notify('presentation-error')
    expect(screen.getByRole('alert')).toHaveTextContent(en.presentation.error)
  })
})
