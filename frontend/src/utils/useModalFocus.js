import { useEffect } from 'react'

export function useModalFocus(dialogRef, closeRef, onClose) {
  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current.focus()

    const handleKeyDown = (event) => {
      if (dialogRef.current.closest('[inert]')) return
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const elements = dialogRef.current.querySelectorAll('button:not(:disabled), a[href], select, [tabindex="0"]')
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
  }, [dialogRef, closeRef, onClose])
}
