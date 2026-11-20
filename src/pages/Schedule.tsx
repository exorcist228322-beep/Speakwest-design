import { useEffect, useMemo, useRef, useState } from 'react'
import { classes, schedule, type ScheduledLesson } from '../data/mock'
import { IconChevronLeft, IconChevronRight, IconPlus } from '../components/Icons'

const FIRST_HOUR = 8
const LAST_HOUR = 22
const HOUR_PX = 56
const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function mondayOf(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const shift = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - shift)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function fromMinutes(total: number) {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

function weekLabel(monday: Date) {
  const sunday = addDays(monday, 6)
  // day + month gives the genitive form: «22 ноября»
  const dayMonth = (d: Date) => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${dayMonth(sunday)}`
  }
  return `${dayMonth(monday)} – ${dayMonth(sunday)}`
}

export function Schedule() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [now, setNow] = useState(() => new Date())
  const [toast, setToast] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const monday = useMemo(() => addDays(mondayOf(now), weekOffset * 7), [now, weekOffset])
  const days = useMemo(() => DAY_NAMES.map((_, i) => addDays(monday, i)), [monday])
  const hours = useMemo(
    () => Array.from({ length: LAST_HOUR - FIRST_HOUR }, (_, i) => FIRST_HOUR + i),
    [],
  )

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    // open the grid around the afternoon, where lessons usually are
    scrollRef.current?.scrollTo({ top: (13 - FIRST_HOUR) * HOUR_PX })
  }, [])

  function flash(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 1800)
  }

  function lessonText(l: ScheduledLesson) {
    const start = toMinutes(l.start)
    return `${l.start} – ${fromMinutes(start + l.minutes)}`
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const nowInRange = nowMinutes >= FIRST_HOUR * 60 && nowMinutes <= LAST_HOUR * 60
  const lessonsThisWeek = schedule.length

  return (
    <div className="ev-panel">
      <div className="ev-title-row">
        <h1 className="ev-title">Расписание</h1>
        <button type="button" className="ev-btn" onClick={() => flash('Добавить урок (макет)')}>
          <IconPlus size={14} /> Добавить урок
        </button>
      </div>

      <div className="ev-week-bar">
        <div className="ev-week-nav">
          <button
            type="button"
            className="ev-icon-btn"
            aria-label="Прошлая неделя"
            onClick={() => setWeekOffset((w) => w - 1)}
          >
            <IconChevronLeft />
          </button>
          <span className="ev-week-label">{weekLabel(monday)}</span>
          <button
            type="button"
            className="ev-icon-btn"
            aria-label="Следующая неделя"
            onClick={() => setWeekOffset((w) => w + 1)}
          >
            <IconChevronRight />
          </button>
        </div>
        <button
          type="button"
          className="ev-btn-soft"
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset(0)}
        >
          Сегодня
        </button>
        <span className="ev-week-count">Уроков на неделе: {lessonsThisWeek}</span>
      </div>

      <div className="ev-cal" ref={scrollRef}>
        <div className="ev-cal-inner">
          <div className="ev-cal-head">
            <span />
            {days.map((d, i) => (
              <span key={i} className={sameDay(d, now) ? 'today' : ''}>
                <span className="ev-cal-dayname">{DAY_NAMES[i]}</span>
                <span className="ev-cal-date">{d.getDate()}</span>
              </span>
            ))}
          </div>

          <div className="ev-cal-body" style={{ height: hours.length * HOUR_PX }}>
            <div className="ev-cal-hours">
              {hours.map((h) => (
                <span key={h} style={{ height: HOUR_PX }}>
                  {h}:00
                </span>
              ))}
            </div>

            {days.map((d, i) => {
              const isToday = sameDay(d, now)
              return (
                <div key={i} className={`ev-cal-day${isToday ? ' today' : ''}`}>
                  {schedule
                    .filter((l) => l.day === i)
                    .map((l) => {
                      const cls = classes.find((c) => c.id === l.classId)
                      const top = ((toMinutes(l.start) - FIRST_HOUR * 60) / 60) * HOUR_PX
                      const height = (l.minutes / 60) * HOUR_PX
                      return (
                        <button
                          key={l.id}
                          type="button"
                          className={`ev-cal-lesson tone-${cls?.tone ?? 0}`}
                          style={{ top, height }}
                          onClick={() => flash(`${cls?.name}: ${lessonText(l)}`)}
                        >
                          <span className="ev-cal-lesson-name">{cls?.name}</span>
                          <span className="ev-cal-lesson-time">{lessonText(l)}</span>
                        </button>
                      )
                    })}
                  {isToday && nowInRange && (
                    <span
                      className="ev-cal-now"
                      style={{ top: ((nowMinutes - FIRST_HOUR * 60) / 60) * HOUR_PX }}
                      aria-hidden
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {toast && <div className="ev-toast">{toast}</div>}
    </div>
  )
}
