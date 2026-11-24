import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, DoorOpen, Link2, Play } from 'lucide-react'
import { courses, homework, studentById, students } from '../data'
import { Avatar, Cover, Dialog, SearchField, Sheet } from '../ui'

export function TeacherStudents() {
  const [query, setQuery] = useState('')
  const [inviting, setInviting] = useState<string | null>(null)
  const shown = students.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
  const toReview = homework.filter((h) => h.status === 'submitted').length

  return (
    <Sheet title="Ученики" description="Пригласите ученика по личной ссылке: он войдёт без Google и пароля.">
      {toReview > 0 && (
        <div className="alert">
          <span>Есть непроверенные домашки: {toReview}</span>
          <Link to="/teacher/homework">К проверке</Link>
        </div>
      )}
      <SearchField value={query} onChange={setQuery} placeholder="Поиск ученика" />
      <p className="count">Всего учеников: {students.length}</p>
      {shown.length ? (
        <ul className="rows">
          {shown.map((s) => (
            <li key={s.id}>
              <Link to={`/teacher/students/${s.id}`} className="row-link">
                <Avatar name={s.name} size="xl" />
                <span className="row-main">
                  <span className="row-title lg truncate">{s.name}</span>
                  <span className="row-sub">
                    {s.age} лет, уровень {s.level}
                  </span>
                  <span className={`badge ${s.access.tone}`} style={{ marginTop: 6 }}>
                    {s.access.text}
                  </span>
                </span>
              </Link>
              <span className="row-actions" style={{ paddingLeft: undefined }}>
                <Link to={`/teacher/students/${s.id}`} className="btn sm">
                  <DoorOpen size={16} /> Комната ученика
                </Link>
                <button type="button" className="btn soft sm" onClick={() => setInviting(s.id)}>
                  <Link2 size={16} /> {s.hasLink ? 'Ссылка для входа' : 'Пригласить'}
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="note">Никого не нашли. Попробуйте другое имя.</p>
      )}
      {inviting && (
        <Dialog title={`Ссылка для ${studentById(inviting).name}`} onClose={() => setInviting(null)}>
          <p className="muted">Отправьте ссылку ученику или родителю. По ней ученик входит без пароля на этом устройстве.</p>
          <label className="field">
            Ссылка
            <input readOnly value="https://edu.example.com/invite/demo" />
          </label>
          <button type="button" className="btn block" onClick={() => setInviting(null)}>
            Скопировать
          </button>
        </Dialog>
      )}
    </Sheet>
  )
}

export function StudentRoom() {
  const { studentId = '' } = useParams()
  const student = studentById(studentId) ?? students[0]
  const own = courses.filter((c) => c.studentIds.includes(student.id))

  return (
    <div className="stack wide" style={{ maxWidth: 1140, margin: '0 auto', width: '100%' }}>
      <Link to="/teacher/students" className="back">
        <ChevronLeft size={16} /> Ученики
      </Link>
      <section className="course-hero" style={{ alignItems: 'center' }}>
        <Avatar name={student.name} size="lg" />
        <div className="course-hero-body" style={{ flex: 1 }}>
          <h1 className="h1">
            {student.name} <span className="muted" style={{ fontSize: 18, fontWeight: 500 }}>{student.age} лет</span>
          </h1>
          <span className="badge accent">Уровень {student.level}</span>
        </div>
        <button type="button" className="btn soft sm">
          {student.hasLink ? 'Ссылка для входа' : 'Пригласить'}
        </button>
      </section>
      <h2 className="h2">Учебники</h2>
      {own.length === 0 && <p className="muted">Ученику пока не открыт ни один курс.</p>}
      {own.map((c) => (
        <section key={c.id} className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Cover course={c} size="mini" />
            <div>
              <p style={{ fontWeight: 700 }}>{c.title}</p>
              <p className="row-sub">{c.lessons.length} урока</p>
            </div>
          </div>
          <ul className="rows tight">
            {c.lessons.map((l, i) => {
              const hw = homework.find((h) => h.lessonId === l.id && h.studentId === student.id)
              return (
                <li key={l.id}>
                  <span className="lesson-num">{i + 1}</span>
                  <span className="row-main">
                    <span className="row-title">{l.title}</span>
                  </span>
                  {hw && <span className={`badge ${hw.status === 'checked' ? 'emerald' : hw.overdue ? 'danger' : hw.status === 'submitted' ? 'accent' : 'amber'}`}>{hw.when}</span>}
                  <Link to={`/teacher/courses/${c.id}/lessons/${l.id}`} className="btn sm">
                    <Play size={14} /> Начать
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
