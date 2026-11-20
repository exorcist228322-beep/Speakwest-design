import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  classes as mockClasses,
  courses,
  initial,
  students,
  type ClassRoom,
} from '../data/mock'
import { IconPlus, IconSearch } from '../components/Icons'

type Group = 'all' | 'single' | 'group'

const groups: { id: Group; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'single', label: 'Индивидуальные' },
  { id: 'group', label: 'Групповые' },
]

function studentName(id: string) {
  return students.find((s) => s.id === id)?.name ?? '?'
}

export function Classes() {
  const [list, setList] = useState<ClassRoom[]>(mockClasses)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<Group>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((c) => {
      if (group !== 'all' && c.kind !== group) return false
      if (!q) return true
      const names = [c.name, ...c.studentIds.map(studentName)].join(' ').toLowerCase()
      return names.includes(q)
    })
  }, [list, query, group])

  function flash(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 1800)
  }

  function create(name: string, kind: ClassRoom['kind']) {
    setList((rows) => [
      ...rows,
      { id: `c${Date.now()}`, name, kind, studentIds: [], tone: rows.length % 6 },
    ])
    setCreateOpen(false)
    flash(`Класс «${name}» создан`)
  }

  return (
    <div className="ev-panel">
      <h1 className="ev-title">Классы</h1>

      <div className="ev-search-row">
        <label className="ev-search">
          <IconSearch />
          <input
            type="search"
            placeholder="Поиск классов и учеников"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="ev-chips">
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            className={group === g.id ? 'active' : ''}
            onClick={() => setGroup(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="ev-count">
        <span>Кол-во классов: {shown.length}</span>
      </div>

      <div className="ev-class-grid">
        <button type="button" className="ev-create ev-class-create" onClick={() => setCreateOpen(true)}>
          <span className="ev-create-icon">
            <IconPlus size={14} />
          </span>
          Создать класс
        </button>

        {shown.map((c) => {
          const course = courses.find((x) => x.id === c.courseId)
          return (
            <article key={c.id} className="ev-class">
              <button
                type="button"
                className={`ev-class-cover tone-${c.tone}`}
                onClick={() => flash(`Класс: ${c.name}`)}
              >
                <span className="ev-class-letter">{initial(c.name)}</span>
                <span className="ev-class-kind">
                  {c.kind === 'group' ? 'Групповой' : 'Индивидуальный'}
                </span>
                {c.studentIds.length > 0 && (
                  <span className="ev-class-members" aria-label="Ученики класса">
                    {c.studentIds.slice(0, 4).map((id) => (
                      <span key={id} title={studentName(id)}>
                        {initial(studentName(id))}
                      </span>
                    ))}
                  </span>
                )}
              </button>
              <div className="ev-class-name">{c.name}</div>
              <div className="ev-class-course">
                {course ? (
                  <Link to={`/courses/${course.id}`}>{course.name}</Link>
                ) : (
                  'Курс не выбран'
                )}
              </div>
            </article>
          )
        })}
      </div>

      {shown.length === 0 && (
        <p className="ev-empty">Ничего не нашли. Попробуйте другое имя.</p>
      )}

      {createOpen && <CreateClassModal onClose={() => setCreateOpen(false)} onCreate={create} />}

      {toast && <div className="ev-toast">{toast}</div>}
    </div>
  )
}

function CreateClassModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (name: string, kind: ClassRoom['kind']) => void
}) {
  const [name, setName] = useState('')
  const [kind, setKind] = useState<ClassRoom['kind']>('single')

  function submit(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (n) onCreate(n, kind)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Новый класс</h2>
        <p>Класс — это один ученик или группа. Учеников добавите потом.</p>
        <div className="ev-chips">
          <button
            type="button"
            className={kind === 'single' ? 'active' : ''}
            onClick={() => setKind('single')}
          >
            Индивидуальный
          </button>
          <button
            type="button"
            className={kind === 'group' ? 'active' : ''}
            onClick={() => setKind('group')}
          >
            Групповой
          </button>
        </div>
        <input
          autoFocus
          placeholder="Название класса"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
