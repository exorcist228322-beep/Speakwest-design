import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { BookOpen, FileText, House, Image, PenLine, Play, Shapes, TextCursorInput } from 'lucide-react'
import { courses, lessonById, studentById } from './data'
import { Avatar, Cover, Dialog, type Role } from './ui'

/** A lesson with a few sample tasks. The live app has a full task engine; the mock only shows how tasks look. */
export function LessonPage({ role }: { role: Role }) {
  const { lessonId = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const part = params.get('part') === 'homework' ? 'homework' : 'class'
  const found = lessonById(lessonId) ?? { course: courses[0], lesson: courses[0].lessons[0] }
  const { course, lesson } = found
  const [picked, setPicked] = useState<string[]>([])
  const [starting, setStarting] = useState(false)

  return (
    <div className="lesson-layout wide">
      <aside className="outline" aria-label="Уроки курса">
        <Link to={`/${role}/courses/${course.id}`} className="outline-course">
          <Cover course={course} size="mini" /> {course.title}
        </Link>
        {course.lessons.map((l, i) => (
          <Link key={l.id} to={`/${role}/courses/${course.id}/lessons/${l.id}`} className={l.id === lesson.id ? 'active' : ''}>
            <span className="lesson-num">{i + 1}</span> {l.title}
          </Link>
        ))}
      </aside>

      <div className="stack">
        <header className="page-head">
          <h1 className="h1">{lesson.title}</h1>
          {role === 'teacher' && (
            <button type="button" className="btn" onClick={() => setStarting(true)}>
              <Play size={16} /> Начать урок
            </button>
          )}
        </header>

        <div className="seg">
          <button type="button" className={part === 'class' ? 'active' : ''} onClick={() => setParams({}, { replace: true })}>
            <BookOpen size={16} /> Классная работа
          </button>
          <button type="button" className={part === 'homework' ? 'active' : ''} onClick={() => setParams({ part: 'homework' }, { replace: true })}>
            <House size={16} /> Домашка
          </button>
        </div>

        <p className="section-label">
          <span className="section-chip">РАЗДЕЛ 1</span> {part === 'class' ? 'Warm-up' : 'Practice at home'}
        </p>

        {role === 'teacher' && (
          <div className="teacher-note">
            <span className="badge accent" style={{ alignSelf: 'flex-start' }}>
              Для учителя
            </span>
            <p className="small">Начните с вопроса «How are you today?», потом покажите картинку и разберите новые слова.</p>
          </div>
        )}

        <article className="ex">
          <div className="ex-head">
            <span className="ex-num">1.1</span>
            <div>
              <p className="ex-kind">
                <FileText size={14} /> Текст
              </p>
              <p className="ex-title">Прочитай правило</p>
            </div>
          </div>
          <div className="rule">
            <p style={{ fontWeight: 700, marginBottom: 6 }}>to be: am, is, are</p>
            <ul>
              <li>I am happy.</li>
              <li>She is sad.</li>
              <li>They are tired.</li>
            </ul>
          </div>
        </article>

        <article className="ex">
          <div className="ex-head">
            <span className="ex-num">1.2</span>
            <div>
              <p className="ex-kind">
                <TextCursorInput size={14} /> Пропуски
              </p>
              <p className="ex-title">Вставь пропущенные слова</p>
            </div>
          </div>
          <p style={{ lineHeight: 2.4 }}>
            I<input className="gap" aria-label="Пропуск 1" />happy today. My friends<input className="gap" aria-label="Пропуск 2" />at school.
          </p>
        </article>

        <article className="ex">
          <div className="ex-head">
            <span className="ex-num">1.3</span>
            <div>
              <p className="ex-kind">
                <Shapes size={14} /> Слова к картинкам
              </p>
              <p className="ex-title">Выбери слова, которые подходят к картинке</p>
            </div>
          </div>
          <div className="card" style={{ display: 'grid', placeItems: 'center', height: 160, background: 'var(--surface-2)', color: 'var(--muted)' }}>
            <Image size={40} />
          </div>
          <div className="chips">
            {['happy', 'sad', 'angry', 'tired'].map((w) => (
              <button key={w} type="button" className={`chip${picked.includes(w) ? ' on' : ''}`} onClick={() => setPicked(picked.includes(w) ? picked.filter((x) => x !== w) : [...picked, w])}>
                {w}
              </button>
            ))}
          </div>
        </article>

        <article className="ex">
          <div className="ex-head">
            <span className="ex-num">1.4</span>
            <div>
              <p className="ex-kind">
                <PenLine size={14} /> Эссе
              </p>
              <p className="ex-title">Напиши три предложения о том, как ты себя чувствуешь.</p>
            </div>
          </div>
          <textarea className="essay" placeholder="Пиши здесь…" />
          {role === 'student' && part === 'homework' && (
            <button type="button" className="btn" style={{ alignSelf: 'flex-start' }}>
              Сдать домашку
            </button>
          )}
        </article>
      </div>

      {starting && (
        <Dialog title="С кем урок?" onClose={() => setStarting(false)}>
          <p className="muted small">Ученик увидит приглашение у себя в Edu и подключится одним нажатием.</p>
          {course.studentIds.map((id) => (
            <Link key={id} to={`/teacher/live/${lesson.id}?student=${id}`} className="who" onClick={() => setStarting(false)}>
              <Avatar name={studentById(id).name} size="xs" />
              <span style={{ fontWeight: 700 }}>{studentById(id).name}</span>
            </Link>
          ))}
        </Dialog>
      )}
    </div>
  )
}
