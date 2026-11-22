import { useEffect, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  title: string
  hint?: string
  onClose: () => void
  onSubmit?: (e: FormEvent) => void
  wide?: boolean
  children: ReactNode
}

// Rendered at the top of the app shell, so page wrappers (z-index, position)
// can't trap it, while the version palette on .app-shell still applies.
export function Modal({ title, hint, onClose, onSubmit, wide, children }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const body = (
    <>
      <h2>{title}</h2>
      {hint && <p>{hint}</p>}
      {children}
    </>
  )

  return createPortal(
    <div className="modal-backdrop" onMouseDown={onClose}>
      {onSubmit ? (
        <form
          className={`modal${wide ? ' modal-wide' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={(e) => e.stopPropagation()}
          onSubmit={onSubmit}
        >
          {body}
        </form>
      ) : (
        <div
          className={`modal${wide ? ' modal-wide' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {body}
        </div>
      )}
    </div>,
    document.querySelector('.app-shell') ?? document.body,
  )
}
