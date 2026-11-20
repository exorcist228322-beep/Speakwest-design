import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  courses,
  initial,
  pluralLessons,
  pluralStudents,
  students,
} from '../data/mock'
import { IconBook, IconMore, IconSliders, IconSparkle } from '../components/Icons'

export function CourseDetail() {
  const { courseId = '' } = useParams()
  const course = useMemo(
    () =>
      courses.find((c) => c.id === courseId) ?? {
        id: courseId,
        name: decodeURIComponent(courseId).replace(/-/g, ' ') || 'Новый курс',
        lessons: 0,
        students: 0,
        description: 'Черновик курса из макета',
        gradient: 'linear-gradient(160deg, #5b7de8 0%, #3d5fc4 100%)',
        lessonsList: [] as { id: string; title: string }[],
        accessStudentIds: [] as string[],
      },
    [courseId],
  )

  const [access, setAccess] = useState<Set<string>>(
    () => new Set(course.accessStudentIds),
  )
  const [lessons, setLessons] = useState(course.lessonsList)
  const [newLesson, setNewLesson] = useState('')

  function toggleAccess(id: string) {
    setAccess((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function addLesson() {
    const title = newLesson.trim()
    if (!title) return
    const id = `l${lessons.length + 1}`
    setLessons((prev) => [...prev, { id, title: `${prev.length + 1} ${title}` }])
    setNewLesson('')
  }

  return (
    <div className="course-layout">
      <div>
        <div className="course-hero">
          <div className="course-hero-cover" style={{ background: course.gradient }}>
            <IconBook size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <h1>{course.name}</h1>
            <div className="meta">
              {pluralLessons(Math.max(lessons.length, course.lessons))} •{' '}
              {pluralStudents(access.size || course.students)}
            </div>
            <p className="desc">{course.description}</p>
            <div className="course-hero-actions">
              <button type="button" className="btn btn-ghost btn-sm">
                <IconSliders /> Настройки
              </button>
              <button type="button" className="btn btn-ghost btn-sm" aria-label="Ещё">
                <IconMore />
              </button>
            </div>
          </div>
        </div>

        <div className="ai-banner">
          <div>
            <h3>Урок из файла</h3>
            <p>Загрузите PDF, Word или фото — AI соберёт урок.</p>
          </div>
          <button type="button" className="btn btn-primary">
            <IconSparkle /> Сделать урок из файла
          </button>
        </div>

        <section className="lessons-card">
          <h2 className="card-title" style={{ marginBottom: 12 }}>
            Уроки
          </h2>
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/courses/${course.id}/lessons/${lesson.id}`}
              className="lesson-row"
            >
              <span>{lesson.title}</span>
              <IconMore />
            </Link>
          ))}
          {lessons.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Пока нет уроков</p>
          )}
          <div className="lesson-add">
            <input
              placeholder="Название нового урока"
              value={newLesson}
              onChange={(e) => setNewLesson(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLesson()}
            />
            <button type="button" className="btn btn-primary btn-sm" onClick={addLesson}>
              + Добавить
            </button>
          </div>
        </section>
      </div>

      <aside className="access-panel">
        <h3>Кому открыт курс</h3>
        {students.map((s) => (
          <label key={s.id} className="access-row">
            <div className="avatar">{initial(s.name)}</div>
            <span style={{ flex: 1, fontSize: 14 }}>{s.name}</span>
            <input
              type="checkbox"
              checked={access.has(s.id)}
              onChange={() => toggleAccess(s.id)}
            />
          </label>
        ))}
      </aside>
    </div>
  )
}
