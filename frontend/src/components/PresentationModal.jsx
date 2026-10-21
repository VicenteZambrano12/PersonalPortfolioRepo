import { useEffect, useRef, useState } from 'react'
import { getStyles } from '../utils/styles.jsx'
import { createLogger } from '../utils/logger.js'

const log = createLogger('presentation-modal')

function PresentationModal({ presentation, theme, t, onClose }) {
  const styles = getStyles(theme)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const frameRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current.focus()
    const timeout = setTimeout(() => {
      log.error('Presentation did not become ready', { url: presentation.url })
      setStatus('error')
    }, 15000)

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return
      if (event.data?.type === 'presentation-close') onClose()
      if (event.data?.type === 'presentation-ready') {
        clearTimeout(timeout)
        setStatus('ready')
      }
      if (event.data?.type === 'presentation-error') {
        clearTimeout(timeout)
        log.error('Presentation failed to initialize', { url: presentation.url })
        setStatus('error')
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopImmediatePropagation()
        onClose()
      }
      if (event.key !== 'Tab') return
      const buttons = dialogRef.current.querySelectorAll('button')
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('message', handleMessage)
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      clearTimeout(timeout)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('message', handleMessage)
      document.removeEventListener('keydown', handleKeyDown, true)
      previousFocus?.focus()
    }
  }, [onClose, presentation.url])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-5"
      style={{ ...styles.modalOverlay, zIndex: 100 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="presentation-title"
        className="rounded-2xl shadow-2xl w-full max-w-7xl h-[94dvh] flex flex-col overflow-hidden"
        style={styles.modalContent}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3" style={styles.modalHeader}>
          <h3 id="presentation-title" className="font-bold" style={styles.cardTitle}>{presentation.title}</h3>
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
        {status === 'loading' && <p role="status" className="px-4 py-2" style={styles.cardDescription}>{t.loading}</p>}
        {status === 'error' && <p role="alert" className="px-4 py-2" style={styles.cardDescription}>{t.error}</p>}
        <iframe
          ref={frameRef}
          src={`${presentation.url}&embed=1`}
          title={presentation.title}
          className="w-full flex-1 min-h-0 border-0"
          onError={() => {
            log.error('Presentation frame failed to load', { url: presentation.url })
            setStatus('error')
          }}
        />
        <div className="flex items-center justify-between gap-4 px-4 py-2 text-sm" style={styles.modalHeader}>
          <span style={styles.cardSubtitle}>{t.hint}</span>
          <button type="button" onClick={onClose} style={styles.closeButton} className="shrink-0 rounded-md px-3 py-2">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PresentationModal
