import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChevronLeft, Headphones, Square, Video } from 'lucide-react'
import { courses, lessonById, studentById } from '../data'

/** Live lesson header: the teacher shows tasks to one student in real time. The mock has no real connection. */
export function TeacherLive() {
  const { lessonId = '' } = useParams()
  const [params] = useSearchParams()
  const { course, lesson } = lessonById(lessonId) ?? { course: courses[0], lesson: courses[0].lessons[0] }
  const student = studentById(params.get('student') ?? 's1')

  return (
    <div className="stack">
      <Link to={`/teacher/courses/${course.id}/lessons/${lesson.id}`} className="back">
        <ChevronLeft size={16} /> {lesson.title}
      </Link>
      <section className="live-head">
        <div>
          <p className="small" style={{ color: 'var(--danger)', fontWeight: 700 }}>
            ● Живой урок
          </p>
          <h1 className="h1" style={{ fontSize: 24 }}>
            {lesson.title}: {student.name}
          </h1>
          <p className="muted small">{student.name} пока не на уроке</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button type="button" className="btn secondary sm">
            <Video size={16} /> Звонок
          </button>
          <button type="button" className="btn sm">
            <Headphones size={16} /> Слушаем вместе
          </button>
          <Link to={`/teacher/courses/${course.id}/lessons/${lesson.id}`} className="btn live sm">
            <Square size={14} /> Завершить урок
          </Link>
        </div>
      </section>
      <article className="ex">
        <div className="ex-head">
          <span className="ex-num">1.1</span>
          <p className="ex-title" style={{ flex: 1 }}>
            Вставь пропущенные слова
          </p>
          <button type="button" className="btn secondary sm">
            Показать ученику
          </button>
        </div>
        <p style={{ lineHeight: 2.4 }}>
          I<input className="gap" aria-label="Пропуск 1" />happy today.
        </p>
      </article>
    </div>
  )
}
