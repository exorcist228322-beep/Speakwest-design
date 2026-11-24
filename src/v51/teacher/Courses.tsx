import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Ellipsis, Plus, Settings2, Sparkles, Users } from 'lucide-react'
import { courseById, courses, LESSONS, plural, students, STUDENTS } from '../data'
import { CourseCard, Cover, SearchField, Sheet } from '../ui'
import { NewCourseDialog } from './NewCourseDialog'

export function TeacherCourses() {
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const needle = query.trim().toLowerCase()
  const shown = courses.filter((c) => c.title.toLowerCase().includes(needle))

  return (
    <Sheet title="Курсы" description="Курсы, уроки и задания для ваших учеников.">
      <SearchField value={query} onChange={setQuery} placeholder="Поиск курсов" />
      <p className="count">Всего курсов: {courses.length}</p>
      <div className="course-grid">
        {!needle && (
          <button type="button" className="create-tile" onClick={() => setCreating(true)}>
            <span className="create-icon">
              <Plus size={16} strokeWidth={2.6} />
            </span>
            Создать курс
          </button>
        )}
        {shown.map((c) => (
          <CourseCard key={c.id} course={c} to={`/teacher/courses/${c.id}`} meta={`${plural(c.lessons.length, LESSONS)} · ${plural(c.studentIds.length, STUDENTS)}`} />
        ))}
      </div>
      {needle && !shown.length && <p className="note">Таких курсов нет.</p>}
      {creating && <NewCourseDialog onClose={() => setCreating(false)} />}
    </Sheet>
  )
}

export function TeacherCourse() {
  const { courseId = '' } = useParams()
  const course = courseById(courseId) ?? courses[0]
  const [open, setOpen] = useState(course.studentIds)

  return (
    <div className="stack">
      <Link to="/teacher/courses" className="back">
        <ChevronLeft size={16} /> Все курсы
      </Link>
      <section className="course-hero">
        <Cover course={course} size="small" />
        <div className="course-hero-body">
          <h1 className="h1">{course.title}</h1>
          <p className="muted small">
            {plural(course.lessons.length, LESSONS)} · {plural(course.studentIds.length, STUDENTS)}
          </p>
          <p>{course.description}</p>
          <div className="course-hero-actions">
            <button type="button" className="btn secondary sm">
              <Settings2 size={16} /> Настройки
            </button>
            <button type="button" className="icon-btn" aria-label="Ещё">
              <Ellipsis size={18} />
            </button>
          </div>
        </div>
      </section>

      <div className="course-layout">
        <section className="stack-sm">
          <div className="ai-promo">
            <p className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} style={{ color: 'var(--grape)' }} /> Урок из файла
            </p>
            <p className="muted small">Загрузите PDF, Word или фото страниц. AI соберёт урок прямо на экране, а вы его поправите.</p>
            <button type="button" className="btn sm" style={{ alignSelf: 'flex-start' }}>
              <Sparkles size={16} /> Сделать урок из файла
            </button>
          </div>
          <h2 className="h1" style={{ fontSize: 24, marginTop: 8 }}>
            Уроки
          </h2>
          <div className="lesson-rows">
            {course.lessons.length === 0 && <p className="card" style={{ padding: '16px 20px' }}>В курсе пока нет уроков. Добавьте первый.</p>}
            {course.lessons.map((l, i) => (
              <Link key={l.id} to={`/teacher/courses/${course.id}/lessons/${l.id}`} className="lesson-row">
                <span className="lesson-num">{i + 1}</span>
                <span className="lesson-title truncate">{l.title}</span>
                <Ellipsis size={18} className="muted" />
              </Link>
            ))}
          </div>
          <form className="add-row" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Название нового урока" />
            <button type="submit" className="btn">
              <Plus size={18} /> Добавить
            </button>
          </form>
        </section>

        <aside className="side">
          <p className="h2" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={18} style={{ color: 'var(--accent)' }} /> Кому открыт курс
          </p>
          <p className="muted small" style={{ marginTop: -8 }}>
            Отмеченные ученики видят курс у себя.
          </p>
          {students.map((s) => (
            <label key={s.id} className="check-row">
              <span className="avatar xs t-accent">{s.name[0]}</span>
              <span style={{ flex: 1, fontWeight: 600 }}>{s.name}</span>
              <input type="checkbox" checked={open.includes(s.id)} onChange={() => setOpen(open.includes(s.id) ? open.filter((x) => x !== s.id) : [...open, s.id])} />
            </label>
          ))}
        </aside>
      </div>
    </div>
  )
}
