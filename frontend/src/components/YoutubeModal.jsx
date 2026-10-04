import { useEffect, useRef, useState } from 'react'
import { YOUTUBE_CHANNEL_URL, validateYoutubeVideos } from '../lib/youtube.js'
import { createLogger } from '../utils/logger.js'
import { getStyles } from '../utils/styles.jsx'

const log = createLogger('youtube')

function YoutubeModal({ theme, t, onClose }) {
  const styles = getStyles(theme)
  const [videos, setVideos] = useState(null)
  const [failed, setFailed] = useState(false)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const elements = dialogRef.current.querySelectorAll('button, a[href]')
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

  useEffect(() => {
    const controller = new AbortController()
    async function loadVideos() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}youtube-videos.json`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Video list request failed: HTTP ${response.status}`)
        const data = validateYoutubeVideos(await response.json())
        if (!controller.signal.aborted) setVideos(data)
      } catch (error) {
        if (controller.signal.aborted) return
        log.error('Unable to load latest YouTube videos', { message: error.message })
        setFailed(true)
      }
    }
    loadVideos()
    return () => controller.abort()
  }, [])

  return (
    <div
      className="flex items-center justify-center p-4 sm:p-6"
      style={styles.modalOverlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="youtube-modal-title"
        className="rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        style={styles.modalContent}
      >
        <div className="flex items-center justify-between gap-4 p-6" style={styles.modalHeader}>
          <div>
            <h3 id="youtube-modal-title" className="text-2xl font-bold" style={styles.youtubeTitle}>{t.title}</h3>
            <p style={styles.youtubeSubtitle}>{t.subtitle}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
            style={styles.closeButton}
            aria-label={t.close}
          >
            <i className="ph ph-x text-xl" aria-hidden="true"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar" style={styles.modalBody}>
          <p className="mb-6 text-xl font-semibold italic" style={styles.youtubeTagline}>
            {t.tagline}
          </p>
          <h4 className="font-semibold mb-3" style={styles.youtubeTitle}>{t.latestVideos}</h4>
          {failed ? (
            <p role="alert" className="mb-6" style={styles.cardDescription}>{t.videosError}</p>
          ) : videos ? (
            <ul className="space-y-3 mb-6">
              {videos.map((video) => (
                <li key={video.id}>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg p-3 hover:underline focus-visible:outline-2"
                    style={styles.panel}
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt=""
                      width="480"
                      height="360"
                      loading="lazy"
                      className="w-full sm:w-40 h-auto aspect-video object-cover rounded-md shrink-0"
                    />
                    <span className="flex items-start gap-2 min-w-0 w-full">
                      <i className="ph ph-play-circle shrink-0 mt-1" aria-hidden="true" style={styles.youtubeCta}></i>
                      <span>{video.title}</span>
                      <i className="ph ph-arrow-up-right shrink-0 mt-1 ml-auto" aria-hidden="true"></i>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" className="mb-6" style={styles.cardDescription}>{t.videosLoading}</p>
          )}
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:underline"
            style={styles.youtubeCta}
          >
            {t.cta} <i className="ph ph-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  )
}

export default YoutubeModal
