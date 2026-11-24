import { useState } from 'react'
import type { Tone } from '../data'
import { Dialog } from '../ui'

const COLORS: Tone[] = ['accent', 'grape', 'mint', 'sun', 'sky', 'flame']

/** Mock form: nothing is saved, it only shows the fields the live app asks for. */
export function NewCourseDialog({ onClose }: { onClose: () => void }) {
  const [color, setColor] = useState<Tone>('accent')

  return (
    <Dialog title="Новый курс" onClose={onClose}>
      <label className="field">
        Название
        <input placeholder="Например, Starter A1" autoFocus />
      </label>
      <label className="field">
        Описание
        <textarea placeholder="Для кого курс и что в нём будет" />
      </label>
      <div className="field">
        Цвет обложки
        <div className="colors">
          {COLORS.map((c) => (
            <button key={c} type="button" aria-label={c} className={`color-dot c-${c}${color === c ? ' on' : ''}`} onClick={() => setColor(c)} />
          ))}
        </div>
      </div>
      <button type="button" className="btn block" onClick={onClose}>
        Создать курс
      </button>
    </Dialog>
  )
}
