import { useState } from 'react'
import { initial, students } from '../data/mock'
import { IconDoor, IconLink, IconPlus } from '../components/Icons'
import { useUiPrefs } from '../context/UiPrefs'
import { StudentsEdvibe } from './StudentsEdvibe'
import { useHomework } from '../data/store'

export function Students() {
  const { version } = useUiPrefs()
  if (version === 'v50') return <StudentsV50 />
  return version === 'v48' ? <StudentsEdvibe /> : <StudentsCards />
}

function StudentsV50() {
  const toReview = useHomework().filter((h) => h.status === 'submitted').length
  return <StudentsEdvibe toReview={toReview} reviewHref="/homework?tab=review" />
}

function StudentsCards() {
  const [toast, setToast] = useState<string | null>(null)

  function flash(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 1800)
  }

  return (
    <>
      <div className="page-top">
        <div>
          <h1 className="page-title">Ученики</h1>
          <p className="page-sub">
            Пригласите ученика по личной ссылке: он войдёт без Google и пароля.
          </p>
        </div>
      </div>

      <div className="students-grid">
        {students.map((s) => (
          <article key={s.id} className="student-card">
            <div className="student-card-top">
              <div className="avatar lg">{initial(s.name)}</div>
              <div className="student-meta">
                <div className="student-name">{s.name}</div>
                <div className="student-level">
                  {s.age ? `${s.age} лет, ` : ''}уровень {s.level}
                </div>
                <span
                  className={`badge ${
                    s.status === 'last_login'
                      ? 'green'
                      : s.status === 'link_ready'
                        ? 'orange'
                        : 'blue'
                  }`}
                >
                  {s.statusText}
                </span>
              </div>
            </div>
            <div className="student-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => flash(`Комната: ${s.name}`)}
              >
                <IconDoor /> Комната ученика
              </button>
              {s.status === 'not_invited' ? (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => flash(`Приглашение отправлено: ${s.name}`)}
                >
                  <IconPlus size={14} /> Пригласить
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    void navigator.clipboard?.writeText(
                      `https://edu.speakwest.tech/join/${s.id}`,
                    )
                    flash('Ссылка скопирована')
                  }}
                >
                  <IconLink /> Ссылка для входа
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1d26',
            color: 'white',
            padding: '10px 16px',
            borderRadius: 10,
            fontSize: 13,
            zIndex: 60,
          }}
        >
          {toast}
        </div>
      )}
    </>
  )
}
