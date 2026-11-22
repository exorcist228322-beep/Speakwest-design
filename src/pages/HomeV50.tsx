import { useState, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  classes,
  courses,
  initial,
  schedule,
  students,
  TEACHER_NAME,
  todayLabel,
} from '../data/mock'
import { useGivenAwards, useHomework } from '../data/store'
import {
  IconBook,
  IconClipboard,
  IconNotebook,
  IconPlus,
  IconSettings,
  IconTrophy,
  IconUsers,
} from '../components/Icons'
import { NewCourseModal } from '../components/NewCourseModal'

type Card = {
  to: string
  label: string
  value?: number
  hint: string
  accent: string
  icon: ComponentType<{ size?: number }>
  quiet?: boolean
}

function endTime(start: string, minutes: number) {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export function HomeV50() {
  const homework = useHomework()
  const given = useGivenAwards()
  const [modalOpen, setModalOpen] = useState(false)
  const [now] = useState(() => new Date())

  const toReview = homework.filter((h) => h.status === 'submitted')
  const assigned = homework.filter((h) => h.status === 'assigned').length
  const lessonsTotal = courses.reduce((sum, c) => sum + c.lessons, 0)
  const todayIndex = (now.getDay() + 6) % 7
  const today = schedule
    .filter((l) => l.day === todayIndex)
    .sort((a, b) => a.start.localeCompare(b.start))

  const cards: Card[] = [
    { to: '/students', label: 'Ученики', value: students.length, hint: 'в вашем кабинете', accent: 'blue', icon: IconUsers },
    { to: '/courses', label: 'Курсы', value: courses.length, hint: `${lessonsTotal} уроков всего`, accent: 'purple', icon: IconBook },
    {
      to: '/homework?tab=review',
      label: 'На проверке',
      value: toReview.length,
      hint: toReview.length ? 'ждут вашей оценки' : 'очередь пуста',
      accent: 'green',
      icon: IconClipboard,
      quiet: toReview.length === 0,
    },
    {
      to: '/homework?tab=assigned',
      label: 'Домашки',
      value: assigned,
      hint: 'сейчас в работе',
      accent: 'orange',
      icon: IconNotebook,
      quiet: assigned === 0,
    },
    { to: '/achievements', label: 'Ачивки', value: given.length, hint: 'наград выдано', accent: 'gold', icon: IconTrophy },
    { to: '/settings', label: 'Настройки', hint: 'Профиль и оформление', accent: 'slate', icon: IconSettings },
  ]

  return (
    <>
      <div className="page-top">
        <div>
          <p className="page-kicker">{capitalize(todayLabel())}</p>
          <h1 className="page-title">
            {greeting(now.getHours())}, {TEACHER_NAME}
          </h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <IconPlus /> Новый курс
        </button>
      </div>

      <div className="home-v50">
        <div className="panels-v43">
          {cards.map(({ to, label, value, hint, accent, icon: Icon, quiet }) => (
            <Link
              key={label}
              to={to}
              className={`panel-v43 accent-${accent}${value === undefined ? ' panel-v43-link' : ''}`}
            >
              <span className="panel-v43-icon" aria-hidden>
                <Icon />
              </span>
              <span className="panel-v43-body">
                <span className="panel-v43-label">{label}</span>
                {value !== undefined && (
                  <span className={`panel-v43-value${quiet ? ' is-quiet' : ''}`}>{value}</span>
                )}
                <span className={`panel-v43-hint${value === undefined ? ' wide' : ''}`}>{hint}</span>
              </span>
              {value === undefined && (
                <span className="panel-v43-go" aria-hidden>
                  →
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="home-v50-cols">
          <section className="home-v50-box">
            <div className="home-v50-head">
              <h2>Уроки сегодня</h2>
              <Link to="/schedule">Расписание</Link>
            </div>
            {today.length ? (
              <ul className="home-v50-list">
                {today.map((l) => {
                  const c = classes.find((x) => x.id === l.classId)
                  return (
                    <li key={l.id}>
                      <span className="home-v50-time">
                        {l.start}
                        <small>{endTime(l.start, l.minutes)}</small>
                      </span>
                      <span className={`home-v50-bar tone-${c?.tone ?? 0}`} aria-hidden />
                      <span className="home-v50-what">
                        <strong>{c?.name}</strong>
                        <small>{c?.kind === 'group' ? 'Групповой' : 'Индивидуальный'}</small>
                      </span>
                      <Link to="/classes" className="ev-btn-soft home-v50-go">
                        Открыть класс
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="home-v50-empty">Сегодня уроков нет.</p>
            )}
          </section>

          <section className="home-v50-box">
            <div className="home-v50-head">
              <h2>Ждут проверки</h2>
              <Link to="/homework?tab=review">Все домашки</Link>
            </div>
            {toReview.length ? (
              <ul className="home-v50-list">
                {toReview.map((h) => {
                  const s = students.find((x) => x.id === h.studentId)
                  return (
                    <li key={h.id}>
                      <span className={`ev-avatar ev-avatar-xs tone-${Number(h.studentId) % 6}`}>
                        {initial(s?.name ?? '?')}
                      </span>
                      <span className="home-v50-what">
                        <strong>{s?.name}</strong>
                        <small>
                          {h.title} · сдано {h.submittedAt}
                        </small>
                      </span>
                      <Link to="/homework?tab=review" className="ev-btn-soft home-v50-go">
                        Проверить
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="home-v50-empty">Все работы проверены.</p>
            )}
          </section>
        </div>
      </div>

      {modalOpen && <NewCourseModal onClose={() => setModalOpen(false)} />}
    </>
  )
}

function greeting(hour: number) {
  if (hour < 5) return 'Доброй ночи'
  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'
  return 'Добрый вечер'
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
