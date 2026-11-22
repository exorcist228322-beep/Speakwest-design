import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { initial, students as mockStudents, type Student } from '../data/mock'
import {
  IconChevronDown,
  IconDoor,
  IconGrid,
  IconInfo,
  IconLink,
  IconPlus,
  IconRows,
  IconSearch,
  IconSliders,
  IconUsers,
} from '../components/Icons'
import { Modal } from '../components/Modal'

// Homework waiting for review; the banner shows only when there is some
const HOMEWORK_TO_REVIEW = 0

type Group = 'all' | 'invited' | 'not_invited'
type View = 'list' | 'grid'
type Sort = 'added' | 'name'

const groups: { id: Group; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'invited', label: 'Приглашены' },
  { id: 'not_invited', label: 'Не приглашены' },
]

const sorts: { id: Sort; label: string }[] = [
  { id: 'added', label: 'По дате добавления' },
  { id: 'name', label: 'По имени' },
]

function statusTone(s: Student) {
  if (s.status === 'last_login') return 'green'
  if (s.status === 'link_ready') return 'orange'
  return 'blue'
}

export function StudentsEdvibe() {
  const [list, setList] = useState<Student[]>(mockStudents)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<Group>('all')
  const [level, setLevel] = useState<number | 'all'>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [view, setView] = useState<View>('list')
  const [sort, setSort] = useState<Sort>('added')
  const [createOpen, setCreateOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const levels = useMemo(() => [...new Set(list.map((s) => s.level))].sort(), [list])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = list.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false
      if (group === 'invited' && s.status === 'not_invited') return false
      if (group === 'not_invited' && s.status !== 'not_invited') return false
      if (level !== 'all' && s.level !== level) return false
      return true
    })
    if (sort === 'name') return [...rows].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    return rows
  }, [list, query, group, level, sort])

  function flash(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 1800)
  }

  function copyLink(s: Student) {
    void navigator.clipboard?.writeText(`https://edu.speakwest.tech/join/${s.id}`)
    flash('Ссылка скопирована')
  }

  function invite(s: Student) {
    setList((rows) =>
      rows.map((r) =>
        r.id === s.id
          ? { ...r, status: 'link_ready', statusText: 'Ссылка готова, входа ещё не было' }
          : r,
      ),
    )
    flash(`Ссылка для ${s.name} готова`)
  }

  function create(name: string, age?: number) {
    const student: Student = {
      id: String(Date.now()),
      name,
      age,
      level: 1,
      status: 'not_invited',
      statusText: 'Ещё не приглашён',
    }
    setList((rows) => [...rows, student])
    setCreateOpen(false)
    flash(`${name} добавлен(а)`)
  }

  return (
    <div className="ev-panel">
      <h1 className="ev-title">Ученики</h1>

      {HOMEWORK_TO_REVIEW > 0 && (
        <div className="ev-alert">
          <IconInfo />
          <span>Есть непроверенные домашние задания</span>
          <Link to="/review" className="ev-alert-btn">
            → Подробнее
          </Link>
        </div>
      )}

      <div className="ev-search-row">
        <label className="ev-search">
          <IconSearch />
          <input
            type="search"
            placeholder="Поиск учеников"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button
          type="button"
          className={`ev-filter-btn${filterOpen || level !== 'all' ? ' active' : ''}`}
          aria-expanded={filterOpen}
          onClick={() => setFilterOpen((v) => !v)}
        >
          <IconSliders /> Фильтр
        </button>
      </div>

      {filterOpen && (
        <div className="ev-filter-panel">
          <span className="ev-filter-label">Уровень</span>
          <div className="ev-chips">
            <button
              type="button"
              className={level === 'all' ? 'active' : ''}
              onClick={() => setLevel('all')}
            >
              Любой
            </button>
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                className={level === l ? 'active' : ''}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

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

      <div className="ev-toolbar">
        <div className="ev-segment" role="group" aria-label="Вид">
          <button
            type="button"
            className={view === 'grid' ? 'active' : ''}
            aria-label="Плиткой"
            aria-pressed={view === 'grid'}
            onClick={() => setView('grid')}
          >
            <IconGrid />
          </button>
          <button
            type="button"
            className={view === 'list' ? 'active' : ''}
            aria-label="Списком"
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
          >
            <IconRows />
          </button>
        </div>
        <label className="ev-sort">
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <IconChevronDown size={14} />
        </label>
      </div>

      <div className="ev-count">
        <span>Кол-во учеников: {shown.length}</span>
      </div>

      <div className={view === 'grid' ? 'ev-grid' : 'ev-list'}>
        <button type="button" className="ev-create" onClick={() => setCreateOpen(true)}>
          <span className="ev-create-icon">
            <IconPlus size={14} />
          </span>
          Создать ученика
        </button>

        {shown.map((s) => {
          const tone = Number(s.id) % 6
          return (
            <article key={s.id} className="ev-student">
              <span className={`ev-avatar tone-${tone}`}>
                {initial(s.name)}
                <span
                  className={`ev-dot${s.status === 'last_login' ? ' on' : ''}`}
                  aria-hidden
                />
              </span>
              <div className="ev-student-main">
                <div className="ev-student-name">{s.name}</div>
                <div className="ev-student-meta">
                  {s.age ? `${s.age} лет · ` : ''}уровень {s.level}
                </div>
                <span className={`ev-status ${statusTone(s)}`}>{s.statusText}</span>
              </div>
              <div className="ev-student-actions">
                <button
                  type="button"
                  className="ev-btn"
                  onClick={() => flash(`Комната: ${s.name}`)}
                >
                  <IconDoor /> Комната ученика
                </button>
                {s.status === 'not_invited' ? (
                  <button type="button" className="ev-btn-soft" onClick={() => invite(s)}>
                    <IconPlus size={14} /> Пригласить
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ev-icon-btn"
                    title="Ссылка для входа"
                    aria-label="Скопировать ссылку для входа"
                    onClick={() => copyLink(s)}
                  >
                    <IconLink />
                  </button>
                )}
                <button
                  type="button"
                  className="ev-icon-btn"
                  title="Профиль ученика"
                  aria-label="Профиль ученика"
                  onClick={() => flash(`Профиль: ${s.name}`)}
                >
                  <IconUsers size={18} />
                </button>
              </div>
            </article>
          )
        })}

        {shown.length === 0 && (
          <p className="ev-empty">Никого не нашли. Попробуйте другое имя или фильтр.</p>
        )}
      </div>

      {createOpen && (
        <CreateStudentModal onClose={() => setCreateOpen(false)} onCreate={create} />
      )}

      {toast && <div className="ev-toast">{toast}</div>}
    </div>
  )
}

function CreateStudentModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (name: string, age?: number) => void
}) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    onCreate(n, age ? Number(age) : undefined)
  }

  return (
    <Modal title="Новый ученик" hint="Потом можно отправить ему ссылку для входа." onClose={onClose} onSubmit={submit}>
        <input
          autoFocus
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          min={4}
          max={99}
          placeholder="Возраст (необязательно)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            Создать
          </button>
        </div>
    </Modal>
  )
}
