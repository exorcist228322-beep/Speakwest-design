import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { classes, initial, students } from '../data/mock'
import {
  assignHomework,
  checkHomework,
  useHomework,
  type Homework as HomeworkItem,
  type HomeworkStatus,
} from '../data/store'
import { IconPlus, IconSearch } from '../components/Icons'
import { Modal } from '../components/Modal'

const tabs: { id: HomeworkStatus; label: string }[] = [
  { id: 'submitted', label: 'На проверке' },
  { id: 'assigned', label: 'Задано' },
  { id: 'checked', label: 'Проверено' },
]

const tabByParam: Record<string, HomeworkStatus> = {
  review: 'submitted',
  assigned: 'assigned',
  checked: 'checked',
}

const paramByTab: Record<HomeworkStatus, string> = {
  submitted: 'review',
  assigned: 'assigned',
  checked: 'checked',
}

function studentOf(h: HomeworkItem) {
  return students.find((s) => s.id === h.studentId)
}

function classOf(h: HomeworkItem) {
  return classes.find((c) => c.id === h.classId)
}

export function Homework() {
  const homework = useHomework()
  const [params, setParams] = useSearchParams()
  const tab = tabByParam[params.get('tab') ?? ''] ?? 'submitted'
  const [query, setQuery] = useState('')
  const [reviewing, setReviewing] = useState<HomeworkItem | null>(null)
  const [assignOpen, setAssignOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const counts = useMemo(() => {
    const c: Record<HomeworkStatus, number> = { submitted: 0, assigned: 0, checked: 0 }
    homework.forEach((h) => (c[h.status] += 1))
    return c
  }, [homework])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return homework.filter((h) => {
      if (h.status !== tab) return false
      if (!q) return true
      const text = [studentOf(h)?.name, classOf(h)?.name, h.title].join(' ').toLowerCase()
      return text.includes(q)
    })
  }, [homework, tab, query])

  function flash(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 1800)
  }

  return (
    <div className="ev-panel">
      <div className="ev-title-row">
        <h1 className="ev-title">Домашки</h1>
        <button type="button" className="ev-btn" onClick={() => setAssignOpen(true)}>
          <IconPlus size={14} /> Задать домашку
        </button>
      </div>

      <div className="ev-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'active' : ''}
            onClick={() => setParams({ tab: paramByTab[t.id] }, { replace: true })}
          >
            {t.label}
            <span className="ev-tab-count">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      <div className="ev-search-row">
        <label className="ev-search">
          <IconSearch />
          <input
            type="search"
            placeholder="Ученик, класс или задание"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="ev-list">
        {shown.map((h) => {
          const s = studentOf(h)
          const c = classOf(h)
          return (
            <article key={h.id} className="ev-student ev-hw">
              <span className={`ev-avatar ev-avatar-sm tone-${Number(h.studentId) % 6}`}>
                {initial(s?.name ?? '?')}
              </span>
              <div className="ev-student-main">
                <div className="ev-student-name">{h.title}</div>
                <div className="ev-student-meta">
                  {s?.name}
                  {c && c.kind === 'group' ? ` · ${c.name}` : ''}
                  {h.lesson ? ` · урок «${h.lesson}»` : ''}
                </div>
                <div className="ev-hw-date">
                  {h.status === 'submitted' && `Сдано ${h.submittedAt}`}
                  {h.status === 'assigned' && `Сдать до ${h.due}`}
                  {h.status === 'checked' && `Проверено · сдано ${h.submittedAt}`}
                </div>
              </div>
              <div className="ev-student-actions">
                {h.status === 'submitted' && (
                  <button type="button" className="ev-btn" onClick={() => setReviewing(h)}>
                    Проверить
                  </button>
                )}
                {h.status === 'assigned' && (
                  <button
                    type="button"
                    className="ev-btn-soft"
                    onClick={() => flash(`Напомнили: ${s?.name}`)}
                  >
                    Напомнить
                  </button>
                )}
                {h.status === 'checked' && (
                  <span className="ev-grade" title="Оценка">
                    {h.grade}
                  </span>
                )}
              </div>
            </article>
          )
        })}

        {shown.length === 0 && (
          <p className="ev-empty">
            {query
              ? 'Ничего не нашли.'
              : tab === 'submitted'
                ? 'Проверять нечего. Новые работы появятся здесь, как только ученики их сдадут.'
                : tab === 'assigned'
                  ? 'Сейчас ничего не задано.'
                  : 'Проверенных работ пока нет.'}
          </p>
        )}
      </div>

      {reviewing && (
        <ReviewModal
          item={reviewing}
          onClose={() => setReviewing(null)}
          onDone={(grade, comment) => {
            checkHomework(reviewing.id, grade, comment)
            setReviewing(null)
            flash('Проверено')
          }}
        />
      )}

      {assignOpen && (
        <AssignModal
          onClose={() => setAssignOpen(false)}
          onDone={(count) => {
            setAssignOpen(false)
            setParams({ tab: 'assigned' }, { replace: true })
            flash(count === 1 ? 'Домашка задана' : `Задано ${count} ученикам`)
          }}
        />
      )}

      {toast && <div className="ev-toast">{toast}</div>}
    </div>
  )
}

function ReviewModal({
  item,
  onClose,
  onDone,
}: {
  item: HomeworkItem
  onClose: () => void
  onDone: (grade: number, comment: string) => void
}) {
  const [grade, setGrade] = useState(5)
  const [comment, setComment] = useState('')
  const s = studentOf(item)

  function submit(e: FormEvent) {
    e.preventDefault()
    onDone(grade, comment.trim())
  }

  return (
    <Modal
      title={item.title}
      hint={`${s?.name} · сдано ${item.submittedAt}`}
      onClose={onClose}
      onSubmit={submit}
      wide
    >
      <div className="ev-answer">
        <div className="ev-answer-row">
          <span>1. I feel happy when I play with my friends.</span>
          <span className="ev-mark ok">верно</span>
        </div>
        <div className="ev-answer-row">
          <span>2. She feel sad because it is raining.</span>
          <span className="ev-mark bad">ошибка</span>
        </div>
        <div className="ev-answer-row">
          <span>3. They are excited about the trip.</span>
          <span className="ev-mark ok">верно</span>
        </div>
      </div>

      <div className="ev-field-label">Оценка</div>
      <div className="ev-chips">
        {[5, 4, 3, 2].map((g) => (
          <button
            key={g}
            type="button"
            className={grade === g ? 'active' : ''}
            onClick={() => setGrade(g)}
          >
            {g}
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        placeholder="Комментарий ученику (необязательно)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Позже
        </button>
        <button type="submit" className="btn btn-primary">
          Принять работу
        </button>
      </div>
    </Modal>
  )
}

function AssignModal({ onClose, onDone }: { onClose: () => void; onDone: (count: number) => void }) {
  const [classId, setClassId] = useState(classes[0].id)
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    const c = classes.find((x) => x.id === classId)
    if (!c || !title.trim()) return
    const dueLabel = due
      ? new Date(due).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
      : 'без срока'
    assignHomework(c.id, c.studentIds, title.trim(), dueLabel)
    onDone(c.studentIds.length)
  }

  return (
    <Modal title="Задать домашку" hint="Домашку получат все ученики класса." onClose={onClose} onSubmit={submit}>
      <select value={classId} onChange={(e) => setClassId(e.target.value)}>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
            {c.kind === 'group' ? ` (${c.studentIds.length} уч.)` : ''}
          </option>
        ))}
      </select>
      <input
        autoFocus
        placeholder="Что сделать"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Срок сдачи" />
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          Задать
        </button>
      </div>
    </Modal>
  )
}
