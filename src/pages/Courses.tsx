import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses, pluralLessons, pluralStudents } from '../data/mock'
import { IconBook, IconPlus, IconSearch } from '../components/Icons'
import { NewCourseModal } from '../components/NewCourseModal'
import { useUiPrefs } from '../context/UiPrefs'

export function Courses() {
  const { version } = useUiPrefs()
  return version === 'v50' ? <CoursesV50 /> : <CoursesClassic />
}

function CoursesV50() {
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = courses.filter((c) => !q || c.name.toLowerCase().includes(q))

  return (
    <div className="ev-panel">
      <h1 className="ev-title">Курсы</h1>
      <div className="ev-search-row">
        <label className="ev-search">
          <IconSearch />
          <input
            type="search"
            placeholder="Поиск курсов"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="ev-count">
        <span>Кол-во курсов: {shown.length}</span>
      </div>
      <div className="ev-class-grid">
        <button type="button" className="ev-create ev-class-create" onClick={() => setModalOpen(true)}>
          <span className="ev-create-icon">
            <IconPlus size={14} />
          </span>
          Создать курс
        </button>
        {shown.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`} className="ev-course">
            <span className="ev-course-cover" style={{ background: course.gradient }}>
              <span className="ev-course-cover-title">{course.name}</span>
            </span>
            <span className="ev-class-name">{course.name}</span>
            <span className="ev-class-course">
              {pluralLessons(course.lessons)} · {pluralStudents(course.students)}
            </span>
          </Link>
        ))}
      </div>
      {modalOpen && <NewCourseModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}

function CoursesClassic() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="page-top">
        <div>
          <h1 className="page-title">Курсы</h1>
          <p className="page-sub">Курсы, уроки и задания для ваших учеников.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <IconPlus /> Новый курс
        </button>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`} className="course-card">
            <div className="course-cover" style={{ background: course.gradient }}>
              <div className="course-cover-icon">
                <IconBook size={18} />
              </div>
              <div className="course-cover-title">{course.name}</div>
            </div>
            <div className="course-name">{course.name}</div>
            <div className="course-meta">
              {pluralLessons(course.lessons)} • {pluralStudents(course.students)}
            </div>
          </Link>
        ))}
      </div>

      {modalOpen && <NewCourseModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
