import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses, pluralLessons, pluralStudents } from '../data/mock'
import { IconBook, IconPlus } from '../components/Icons'
import { NewCourseModal } from '../components/NewCourseModal'

export function Courses() {
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
