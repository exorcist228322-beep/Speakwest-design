import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Award,
  BookOpen,
  Brush,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Flame,
  NotebookPen,
  PenLine,
  Radio,
  Sparkles,
  Star,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { achievements, courseById, courses, homework, lessonById, LESSONS, me, plural, studentById, WEEKS, xpRules, type HomeworkStatus } from '../data'
import { CourseCard, Cover, Empty, HomeBox, HomeCard, HomeworkRows, SearchField, Sheet, Tabs } from '../ui'
import { today } from '../format'

const mine = homework.filter((h) => h.studentId === me.studentId)
const myCourses = courses.filter((c) => c.studentIds.includes(me.studentId))
const percent = Math.round((me.xp / me.nextLevelXp) * 100)

function Stats() {
  return (
    <>
      <HomeCard to="/student/rewards" icon={Trophy} tone="accent" label="Уровень" value={me.level} hint={`до уровня ${me.level + 1}: ${me.nextLevelXp - me.xp} опыта`} />
      <HomeCard to="/student/rewards" icon={Star} tone="amber" label="Опыт" value={me.xp} hint={`из ${me.nextLevelXp}`} progress={percent} />
      <HomeCard to="/student/rewards" icon={Flame} tone="flame" label="Серия без долгов" value={me.streakWeeks} hint={plural(me.streakWeeks, WEEKS).replace(/^\d+ /, '')} quiet={!me.streakWeeks} />
    </>
  )
}

export function StudentHome() {
  const [now] = useState(() => new Date())
  const todo = mine.filter((h) => h.status === 'assigned')
  const overdue = todo.filter((h) => h.overdue).length
  const lessons = myCourses.reduce((s, c) => s + c.lessons.length, 0)
  const unlocked = achievements.filter((a) => a.current >= a.target).length

  return (
    <div className="stack wide">
      <header>
        <p className="kicker">{today(now)}</p>
        <h1 className="h1">Привет, {studentById(me.studentId).name}!</h1>
      </header>
      <section className="cards" aria-label="Сводка">
        <Stats />
        <HomeCard to="/student/homework" icon={NotebookPen} tone={overdue ? 'danger' : 'emerald'} label="Домашка" value={todo.length} hint={overdue ? `просрочено: ${overdue}` : todo.length ? 'нужно сделать' : 'всё сдано'} quiet={!todo.length} />
        <HomeCard to="/student/courses" icon={BookOpen} tone="grape" label="Курсы" value={myCourses.length} hint={`${plural(lessons, LESSONS)} всего`} />
        <HomeCard to="/student/rewards" icon={Trophy} tone="muted" label="Награды" hint={`Достижения: ${unlocked} из ${achievements.length}`} />
      </section>
      <div className="boxes">
        <HomeBox title="Домашка" link={{ to: '/student/homework', label: 'Вся домашка' }}>
          {todo.length ? <HomeworkRows items={todo} role="student" /> : <p className="hbox-empty">Всё сдано. Новая домашка появится здесь.</p>}
        </HomeBox>
        <HomeBox title="Мои курсы">
          <div className="course-grid compact" style={{ paddingTop: 12 }}>
            {myCourses.map((c) => (
              <CourseCard key={c.id} course={c} to={`/student/courses/${c.id}`} meta={plural(c.lessons.length, LESSONS)} />
            ))}
          </div>
        </HomeBox>
      </div>
    </div>
  )
}

export function StudentCourses() {
  return (
    <Sheet title="Мои курсы">
      <p className="count">Всего курсов: {myCourses.length}</p>
      <div className="course-grid">
        {myCourses.map((c) => (
          <CourseCard key={c.id} course={c} to={`/student/courses/${c.id}`} meta={plural(c.lessons.length, LESSONS)} />
        ))}
      </div>
    </Sheet>
  )
}

export function StudentCourse() {
  const { courseId = '' } = useParams()
  const course = courseById(courseId) ?? myCourses[0]

  return (
    <div className="stack">
      <Link to="/student/courses" className="back">
        <ChevronLeft size={16} /> Мои курсы
      </Link>
      <section className="course-hero">
        <Cover course={course} size="small" />
        <div className="course-hero-body">
          <h1 className="h1">{course.title}</h1>
          <p className="muted small">{plural(course.lessons.length, LESSONS)}</p>
        </div>
      </section>
      <ol className="lesson-rows">
        {course.lessons.map((l, i) => (
          <li key={l.id}>
            <Link to={`/student/courses/${course.id}/lessons/${l.id}`} className="lesson-row">
              <span className="lesson-num">{i + 1}</span>
              <span className="lesson-title truncate">{l.title}</span>
              <ChevronRight size={20} className="muted" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

type Tab = 'todo' | 'waiting' | 'checked'

const TABS: { id: Tab; label: string; status: HomeworkStatus }[] = [
  { id: 'todo', label: 'Нужно сделать', status: 'assigned' },
  { id: 'waiting', label: 'На проверке', status: 'submitted' },
  { id: 'checked', label: 'Проверено', status: 'checked' },
]

const EMPTY: Record<Tab, string> = {
  todo: 'Всё сдано, так держать!',
  waiting: 'Сейчас ничего не ждёт проверки.',
  checked: 'Проверенной домашки пока нет.',
}

export function StudentHomework() {
  const [params, setParams] = useSearchParams()
  const tab = (TABS.find((t) => t.id === params.get('tab'))?.id ?? 'todo') as Tab
  const [query, setQuery] = useState('')
  const status = TABS.find((t) => t.id === tab)!.status
  const shown = mine.filter((h) => h.status === status && `${lessonById(h.lessonId)!.lesson.title} ${courseById(h.courseId)!.title}`.toLowerCase().includes(query.trim().toLowerCase()))

  if (!mine.length) {
    return (
      <Sheet title="Домашка">
        <Empty icon={NotebookPen} title="Домашки пока нет">
          Учитель задаст её после урока, и она появится здесь.
        </Empty>
      </Sheet>
    )
  }

  return (
    <Sheet title="Домашка">
      <Tabs tabs={TABS.map((t) => ({ id: t.id, label: t.label, count: mine.filter((h) => h.status === t.status).length }))} active={tab} onSelect={(id) => setParams({ tab: id }, { replace: true })} />
      <SearchField value={query} onChange={setQuery} placeholder="Урок или курс" />
      {shown.length ? <HomeworkRows items={shown} role="student" /> : <p className="note">{EMPTY[tab]}</p>}
    </Sheet>
  )
}

const ICONS: Record<string, LucideIcon> = {
  'first-homework': NotebookPen,
  'homework-10': Trophy,
  'on-time-5': CalendarCheck,
  'three-stars': Star,
  'stars-30': Sparkles,
  'streak-3': Flame,
  'sharp-20': Crosshair,
  'writer-5': PenLine,
  'artist-5': Brush,
  'live-5': Radio,
  'level-5': Award,
}

export function StudentRewards() {
  const unlocked = achievements.filter((a) => a.current >= a.target).length

  return (
    <div className="stack wide">
      <section className="cards" style={{ maxWidth: 1140, width: '100%', margin: '0 auto' }}>
        <Stats />
      </section>
      <Sheet title="Достижения" description={`Открыто ${unlocked} из ${achievements.length}.`}>
        <ul className="achievements">
          {achievements.map((a) => {
            const Icon = ICONS[a.id] ?? Award
            const on = a.current >= a.target
            return (
              <li key={a.id} className={`ach${on ? ' on' : ''}`}>
                <span className="ach-icon">
                  <Icon size={22} strokeWidth={2.2} />
                </span>
                <span className="ach-body">
                  <span style={{ fontWeight: 700 }}>{a.title}</span>
                  <span className="muted small">{a.description}</span>
                  {on ? (
                    <span className="small" style={{ color: 'var(--amber)', fontWeight: 600 }}>
                      Получено
                    </span>
                  ) : (
                    <span className="ach-track">
                      <span className="progress">
                        <span className="bar-accent" style={{ width: `${(a.current / a.target) * 100}%` }} />
                      </span>
                      {a.current}/{a.target}
                    </span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
        <section className="stack-sm" style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <h2 className="h2">Как получить опыт</h2>
          <dl className="rules">
            {xpRules.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Sheet>
    </div>
  )
}
