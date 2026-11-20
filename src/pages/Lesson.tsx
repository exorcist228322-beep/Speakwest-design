import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courses } from '../data/mock'
import { IconBook, IconPencil } from '../components/Icons'

export function Lesson() {
  const { courseId = '', lessonId = '' } = useParams()
  const course = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courseId],
  )
  const lesson = useMemo(
    () =>
      course?.lessonsList.find((l) => l.id === lessonId) ?? {
        id: lessonId,
        title: 'Unit 4 Fantastic feelings',
      },
    [course, lessonId],
  )
  const [tab, setTab] = useState<'class' | 'hw'>('class')

  return (
    <div className="lesson-layout">
      <aside className="lesson-side">
        <Link to={`/courses/${courseId}`} className="lesson-side-course">
          <div
            className="lesson-side-cover"
            style={{
              background:
                course?.gradient ??
                'linear-gradient(160deg, #5b7de8 0%, #3d5fc4 100%)',
            }}
          >
            <IconBook size={14} />
          </div>
          {course?.name ?? 'Курс'}
        </Link>
        {(course?.lessonsList ?? [lesson]).map((l) => (
          <Link
            key={l.id}
            to={`/courses/${courseId}/lessons/${l.id}`}
            className={`lesson-row${l.id === lesson.id ? ' active' : ''}`}
            style={{ marginBottom: 4 }}
          >
            {l.title}
          </Link>
        ))}
      </aside>

      <div className="lesson-content">
        <div className="page-top" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title" style={{ fontSize: 24 }}>
              {lesson.title.replace(/^\d+\s*/, '')}
            </h1>
            <button type="button" className="icon-btn" aria-label="Редактировать" style={{ width: 36, height: 36 }}>
              <IconPencil />
            </button>
          </div>
          <button type="button" className="btn btn-primary">
            Начать урок
          </button>
        </div>

        <div className="lesson-tabs">
          <button
            type="button"
            className={`tab${tab === 'class' ? ' active' : ''}`}
            onClick={() => setTab('class')}
          >
            Классная работа
          </button>
          <button
            type="button"
            className={`tab${tab === 'hw' ? ' active' : ''}`}
            onClick={() => setTab('hw')}
          >
            Домашка
          </button>
        </div>

        <div
          className="ai-banner"
          style={{
            background: 'linear-gradient(135deg, #6b5bb8, #8b7ad4)',
            padding: '14px 18px',
          }}
        >
          <p style={{ margin: 0, fontSize: 14 }}>
            AI prepared 15 tasks. Students don&apos;t see them yet
          </p>
          <button type="button" className="btn btn-primary btn-sm">
            Показать ученикам
          </button>
        </div>

        {tab === 'class' ? (
          <>
            <h2 style={{ fontSize: 16, marginBottom: 8 }}>Раздел 1 Lesson 1: Vocabulary</h2>
            <div className="teacher-box">
              <h4>Для учителя</h4>
              <ul>
                <li>Warm-up: The big picture</li>
                <li>Where are they?</li>
                <li>Who&apos;s this?</li>
                <li>How do they feel?</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="empty-page" style={{ marginTop: 8 }}>
            <h2>Домашнее задание</h2>
            <p>Здесь появятся задания для дома. Пока это макет.</p>
          </div>
        )}
      </div>
    </div>
  )
}
