import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = { onClose: () => void }

export function NewCourseModal({ onClose }: Props) {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    const id = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, '-') || 'new-course')
    onClose()
    navigate(`/courses/${id}`)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Новый курс</h2>
        <p>Макет: создаёт черновик и открывает страницу курса.</p>
        <input
          autoFocus
          placeholder="Название курса"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea placeholder="Описание (необязательно)" rows={3} />
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            Создать
          </button>
        </div>
      </form>
    </div>
  )
}
