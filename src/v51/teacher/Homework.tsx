import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChevronLeft, Star } from 'lucide-react'
import { courseById, homework, lessonById, studentById, type HomeworkStatus } from '../data'
import { HomeworkRows, SearchField, Sheet, Tabs } from '../ui'

type Tab = 'review' | 'assigned' | 'checked'

const TABS: { id: Tab; label: string; status: HomeworkStatus }[] = [
  { id: 'review', label: 'На проверке', status: 'submitted' },
  { id: 'assigned', label: 'Задано', status: 'assigned' },
  { id: 'checked', label: 'Проверено', status: 'checked' },
]

const EMPTY: Record<Tab, string> = {
  review: 'Проверять нечего. Новые работы появятся здесь, как только ученики их сдадут.',
  assigned: 'Сейчас ничего не задано. Домашку задают на странице урока.',
  checked: 'Проверенных работ пока нет.',
}

export function TeacherHomework() {
  const [params, setParams] = useSearchParams()
  const tab = (TABS.find((t) => t.id === params.get('tab'))?.id ?? 'review') as Tab
  const [query, setQuery] = useState('')
  const status = TABS.find((t) => t.id === tab)!.status
  const needle = query.trim().toLowerCase()
  const shown = homework.filter((h) => {
    if (h.status !== status) return false
    const text = `${studentById(h.studentId).name} ${lessonById(h.lessonId)!.lesson.title} ${courseById(h.courseId)!.title}`
    return text.toLowerCase().includes(needle)
  })

  return (
    <Sheet title="Домашки">
      <Tabs
        tabs={TABS.map((t) => ({ id: t.id, label: t.label, count: homework.filter((h) => h.status === t.status).length }))}
        active={tab}
        onSelect={(id) => {
          setQuery('')
          setParams({ tab: id }, { replace: true })
        }}
      />
      <SearchField value={query} onChange={setQuery} placeholder="Ученик, курс или урок" />
      {shown.length ? <HomeworkRows items={shown} role="teacher" /> : <p className="note">{needle ? 'Ничего не нашли.' : EMPTY[tab]}</p>}
    </Sheet>
  )
}

/** Review screen: the student's answers, stars and a comment. Nothing is saved in the mock. */
export function TeacherReview() {
  const { homeworkId = '' } = useParams()
  const hw = homework.find((h) => h.id === homeworkId) ?? homework[0]
  const { lesson, course } = lessonById(hw.lessonId)!
  const [stars, setStars] = useState(hw.stars ?? 3)

  return (
    <div className="stack">
      <Link to="/teacher/homework" className="back">
        <ChevronLeft size={16} /> Домашки
      </Link>
      <header>
        <h1 className="h1">{studentById(hw.studentId).name}</h1>
        <p className="muted">
          {course.title}: {lesson.title}
        </p>
        <span className={`badge ${hw.status === 'checked' ? 'emerald' : 'accent'}`} style={{ marginTop: 8 }}>
          {hw.when}
        </span>
      </header>

      <article className="ex">
        <div className="ex-head">
          <span className="ex-num">1.1</span>
          <div>
            <p className="ex-kind">Пропуски</p>
            <p className="ex-title">Вставь пропущенные слова</p>
          </div>
        </div>
        <p>
          I <span className="badge emerald">am</span> happy today. She <span className="badge danger">are</span> sad.
        </p>
        <p className="muted small">1 из 2 верно</p>
      </article>

      <article className="ex">
        <div className="ex-head">
          <span className="ex-num">1.2</span>
          <div>
            <p className="ex-kind">Эссе</p>
            <p className="ex-title">Напиши пять предложений о своих чувствах.</p>
          </div>
        </div>
        <p className="card" style={{ padding: 14 }}>
          I am happy when I play football. I feel sad when it rains. My brother is angry today.
        </p>
      </article>

      <section className="ex">
        <p className="h2">Оценка</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" aria-label={`${n} из 3`} onClick={() => setStars(n)} style={{ color: n <= stars ? 'var(--amber)' : 'var(--border-strong)' }}>
              <Star size={32} style={{ fill: 'currentColor' }} />
            </button>
          ))}
        </div>
        <label className="field">
          Комментарий ученику
          <textarea placeholder="Что получилось и что поправить" />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn">
            Отправить проверку
          </button>
          <button type="button" className="btn secondary">
            Вернуть на доработку
          </button>
        </div>
      </section>
    </div>
  )
}
