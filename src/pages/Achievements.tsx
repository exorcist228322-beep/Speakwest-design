import { useMemo, useState, type FormEvent } from 'react'
import { initial, students } from '../data/mock'
import { awards, giveAward, useGivenAwards } from '../data/store'
import { IconPlus, IconTrophy } from '../components/Icons'
import { Modal } from '../components/Modal'

type Tab = 'given' | 'all'

export function Achievements() {
  const given = useGivenAwards()
  const [tab, setTab] = useState<Tab>('given')
  const [giveOpen, setGiveOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const countByAward = useMemo(() => {
    const m = new Map<string, number>()
    given.forEach((g) => m.set(g.awardId, (m.get(g.awardId) ?? 0) + 1))
    return m
  }, [given])

  return (
    <div className="ev-panel">
      <div className="ev-title-row">
        <h1 className="ev-title">Ачивки</h1>
        <button type="button" className="ev-btn" onClick={() => setGiveOpen(true)}>
          <IconPlus size={14} /> Выдать награду
        </button>
      </div>

      <div className="ev-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'given'}
          className={tab === 'given' ? 'active' : ''}
          onClick={() => setTab('given')}
        >
          Выданы
          <span className="ev-tab-count">{given.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'all'}
          className={tab === 'all' ? 'active' : ''}
          onClick={() => setTab('all')}
        >
          Все награды
          <span className="ev-tab-count">{awards.length}</span>
        </button>
      </div>

      {tab === 'given' ? (
        <div className="ev-list">
          {given.map((g) => {
            const s = students.find((x) => x.id === g.studentId)
            const a = awards.find((x) => x.id === g.awardId)
            return (
              <article key={g.id} className="ev-student ev-hw">
                <span className={`ev-avatar ev-avatar-sm tone-${Number(g.studentId) % 6}`}>
                  {initial(s?.name ?? '?')}
                </span>
                <div className="ev-student-main">
                  <div className="ev-student-name">{s?.name}</div>
                  <div className="ev-student-meta">{a?.hint}</div>
                </div>
                <span className="ev-award-chip">
                  <IconTrophy size={16} /> {a?.title}
                </span>
                <span className="ev-hw-date ev-award-date">{g.date}</span>
              </article>
            )
          })}
          {given.length === 0 && (
            <p className="ev-empty">Наград пока нет. Выдайте первую после урока.</p>
          )}
        </div>
      ) : (
        <div className="ev-award-grid">
          {awards.map((a) => (
            <article key={a.id} className="ev-award">
              <span className="ev-award-icon">
                <IconTrophy size={22} />
              </span>
              <div className="ev-award-title">{a.title}</div>
              <div className="ev-award-hint">{a.hint}</div>
              <div className="ev-award-count">
                {countByAward.get(a.id) ? `Получили: ${countByAward.get(a.id)}` : 'Ещё никто'}
              </div>
            </article>
          ))}
        </div>
      )}

      {giveOpen && (
        <GiveModal
          onClose={() => setGiveOpen(false)}
          onDone={(name) => {
            setGiveOpen(false)
            setTab('given')
            setToast(`Награда у ${name}`)
            window.setTimeout(() => setToast(null), 1800)
          }}
        />
      )}

      {toast && <div className="ev-toast">{toast}</div>}
    </div>
  )
}

function GiveModal({ onClose, onDone }: { onClose: () => void; onDone: (name: string) => void }) {
  const [studentId, setStudentId] = useState(students[0].id)
  const [awardId, setAwardId] = useState(awards[0].id)

  function submit(e: FormEvent) {
    e.preventDefault()
    giveAward(awardId, studentId)
    onDone(students.find((s) => s.id === studentId)?.name ?? '')
  }

  return (
    <Modal title="Выдать награду" hint="Ученик увидит её у себя в кабинете." onClose={onClose} onSubmit={submit}>
      <select value={studentId} onChange={(e) => setStudentId(e.target.value)} aria-label="Ученик">
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <select value={awardId} onChange={(e) => setAwardId(e.target.value)} aria-label="Награда">
        {awards.map((a) => (
          <option key={a.id} value={a.id}>
            {a.title} — {a.hint.toLowerCase()}
          </option>
        ))}
      </select>
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          Выдать
        </button>
      </div>
    </Modal>
  )
}
