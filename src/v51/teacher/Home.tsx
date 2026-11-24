import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CalendarPlus, CircleCheckBig, ClipboardCheck, Clock, NotebookPen, Plus, Send, Settings, Users } from 'lucide-react'
import { activity, courses, homework, lessonById, LESSONS, plural, studentById, students, teacher } from '../data'
import { Avatar, HomeBox, HomeCard, Stars } from '../ui'
import { NewCourseDialog } from './NewCourseDialog'
import { greeting, today } from '../format'

const FEED = {
  submitted: { icon: Send, tone: 't-accent', text: 'домашка сдана' },
  checked: { icon: CircleCheckBig, tone: 't-emerald', text: 'домашка проверена' },
  assigned: { icon: CalendarPlus, tone: 't-muted', text: 'домашка задана' },
}

export function TeacherHome() {
  const [creating, setCreating] = useState(false)
  const [now] = useState(() => new Date())
  const toReview = homework.filter((h) => h.status === 'submitted')
  const assigned = homework.filter((h) => h.status === 'assigned')
  const overdue = assigned.filter((h) => h.overdue).length
  const lessons = courses.reduce((sum, c) => sum + c.lessons.length, 0)

  return (
    <div className="stack wide">
      <header className="page-head">
        <div>
          <p className="kicker">{today(now)}</p>
          <h1 className="h1">
            {greeting(now.getHours())}, {teacher.name}
          </h1>
        </div>
        <button type="button" className="btn" onClick={() => setCreating(true)}>
          <Plus size={18} /> Новый курс
        </button>
      </header>

      <section className="cards" aria-label="Сводка">
        <HomeCard to="/teacher/students" icon={Users} tone="accent" label="Ученики" value={students.length} hint="в вашем кабинете" />
        <HomeCard to="/teacher/courses" icon={BookOpen} tone="grape" label="Курсы" value={courses.length} hint={`${plural(lessons, LESSONS)} всего`} />
        <HomeCard to="/teacher/homework" icon={ClipboardCheck} tone="emerald" label="На проверке" value={toReview.length} hint={toReview.length ? 'ждут вашей оценки' : 'очередь пуста'} quiet={!toReview.length} />
        <HomeCard to="/teacher/homework?tab=assigned" icon={NotebookPen} tone="flame" label="Домашки" value={assigned.length} hint="сейчас в работе" quiet={!assigned.length} />
        <HomeCard to="/teacher/homework?tab=assigned" icon={Clock} tone="danger" label="Просрочено" value={overdue} hint={overdue ? 'срок сдачи прошёл' : 'все сдают вовремя'} quiet={!overdue} />
        <HomeCard to="/teacher/settings" icon={Settings} tone="muted" label="Настройки" hint="Профиль и оформление" />
      </section>

      <div className="boxes">
        <HomeBox title="Последняя активность">
          <ol className="feed">
            {activity.map((a) => {
              const kind = FEED[a.kind]
              const Icon = kind.icon
              return (
                <li key={a.id}>
                  <Link to="/teacher/homework">
                    <span className={`feed-icon ${kind.tone}`}>
                      <Icon size={17} />
                    </span>
                    <span className="feed-text">
                      <span className="truncate">
                        <strong>{studentById(a.studentId).name}</strong>: {kind.text}
                      </span>
                      <span className="row-sub truncate">
                        {a.lessonTitle} · {a.ago}
                      </span>
                    </span>
                    {a.stars ? <Stars count={a.stars} /> : null}
                  </Link>
                </li>
              )
            })}
          </ol>
        </HomeBox>

        <HomeBox title="Ждут проверки" link={{ to: '/teacher/homework', label: 'Все домашки' }}>
          {toReview.length ? (
            <ul className="rows tight">
              {toReview.map((h) => (
                <li key={h.id}>
                  <Avatar name={studentById(h.studentId).name} size="xs" />
                  <span className="row-main">
                    <span className="row-title truncate">{studentById(h.studentId).name}</span>
                    <span className="row-sub truncate">
                      {lessonById(h.lessonId)!.lesson.title} · {h.when.toLowerCase()}
                    </span>
                  </span>
                  <Link to={`/teacher/review/${h.id}`} className="btn soft sm">
                    Проверить
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="hbox-empty">Все работы проверены.</p>
          )}
        </HomeBox>
      </div>

      {creating && <NewCourseDialog onClose={() => setCreating(false)} />}
    </div>
  )
}
