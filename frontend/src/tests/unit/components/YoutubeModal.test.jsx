import { render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import YoutubeModal from '../../../components/YoutubeModal.jsx'
import { en } from '../../../i18n/languages/en.jsx'
import { es } from '../../../i18n/languages/es.jsx'
import { YOUTUBE_CHANNEL_URL } from '../../../lib/youtube.js'
import { youtubeVideos } from '../../fixtures/youtube.js'

describe('YoutubeModal', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: async () => youtubeVideos,
    }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it.each([['dark', en], ['light', es]])('shows three thumbnail and title links in the %s theme', async (theme, language) => {
    render(<YoutubeModal theme={theme} t={language.externalLink} onClose={vi.fn()} />)
    const list = await screen.findByRole('list')
    expect(within(list).getAllByRole('link')).toHaveLength(3)
    for (const video of youtubeVideos) {
      const link = within(list).getByRole('link', { name: video.title })
      expect(link).toHaveAttribute('href', video.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      const thumbnail = link.querySelector('img')
      expect(thumbnail).toHaveAttribute('src', `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)
      expect(thumbnail).toHaveAttribute('alt', '')
      expect(thumbnail).toHaveAttribute('loading', 'lazy')
    }
    expect(screen.getByText(language.externalLink.latestVideos)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: language.externalLink.cta })).toHaveAttribute('href', YOUTUBE_CHANNEL_URL)
    expect(document.querySelector('a a')).toBeNull()
  })

  it('shows loading while the data request is pending and aborts on unmount', () => {
    fetch.mockImplementation(() => new Promise(() => {}))
    const { unmount } = render(<YoutubeModal theme="dark" t={en.externalLink} onClose={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent(en.externalLink.videosLoading)
    const signal = fetch.mock.calls[0][1].signal
    unmount()
    expect(signal.aborted).toBe(true)
  })

  it.each(['network', 'http', 'invalid'])('reports a %s failure and keeps the channel link available', async (failure) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    if (failure === 'network') fetch.mockRejectedValue(new Error('Network unavailable'))
    if (failure === 'http') fetch.mockResolvedValue({ ok: false, status: 404 })
    if (failure === 'invalid') fetch.mockResolvedValue({ ok: true, json: async () => [] })
    render(<YoutubeModal theme="dark" t={es.externalLink} onClose={vi.fn()} />)
    expect(await screen.findByRole('alert')).toHaveTextContent(es.externalLink.videosError)
    expect(screen.getByRole('link', { name: es.externalLink.cta })).toHaveAttribute('href', YOUTUBE_CHANNEL_URL)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    await waitFor(() => expect(log).toHaveBeenCalled())
    log.mockRestore()
  })
})
