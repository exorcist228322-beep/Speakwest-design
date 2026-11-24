import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  House,
  LogOut,
  NotebookPen,
  Repeat,
  Search,
  Settings,
  Star,
  Trophy,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { VersionSwitcher } from '../components/VersionSwitcher'
import { me, type Course, type Homework, type Tone, courseById, lessonById, studentById } from './data'

export type Role = 'teacher' | 'student'

const NAV: Record<Role, { to: string; label: string; icon: LucideIcon }[]> = {
  teacher: [
    { to: '/teacher', label: 'Главная', icon: House },
    { to: '/teacher/students', label: 'Ученики', icon: GraduationCap },
    { to: '/teacher/courses', label: 'Курсы', icon: BookOpen },
    { to: '/teacher/homework', label: 'Домашки', icon: ClipboardCheck },
    { to: '/teacher/settings', label: 'Настройки', icon: Settings },
  ],
  student: [
    { to: '/student', label: 'Главная', icon: House },
    { to: '/student/courses', label: 'Курсы', icon: BookOpen },
    { to: '/student/homework', label: 'Домашка', icon: NotebookPen },
    { to: '/student/rewards', label: 'Награды', icon: Trophy },
  ],
}

const ICON = { size: 22, strokeWidth: 1.9, 'aria-hidden': true } as const

/** Icon rail: collapsed to icons, slides out over the page on hover or when the name menu is open. */
function Rail({ role, name }: { role: Role; name: string }) {
  const { pathname } = useLocation()
  const [menu, setMenu] = useState({ open: false, at: pathname })
  const root = useRef<HTMLElement>(null)
  const open = menu.open && menu.at === pathname
  const setOpen = (next: boolean) => setMenu({ open: next, at: pathname })

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setMenu((m) => ({ ...m, open: false }))
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu((m) => ({ ...m, open: false }))
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="rail-slot">
      <nav ref={root} aria-label="Разделы" className={`rail${open ? ' is-open' : ''}`}>
        <button type="button" aria-expanded={open} title={name} onClick={() => setOpen(!open)} className={`rail-item${open ? ' is-active' : ''}`}>
          <UserRound {...ICON} />
          <span className="rail-label truncate">{name}</span>
        </button>

        {open && (
          <div role="menu" className="rail-menu">
            {role === 'teacher' && (
              <Link to="/teacher/settings" role="menuitem" className="rail-menu-item">
                <UserRound size={16} /> Профиль
              </Link>
            )}
            {role === 'student' && (
              <Link to="/choose" role="menuitem" className="rail-menu-item">
                <Repeat size={16} /> Сменить ученика
              </Link>
            )}
            <Link to="/login" role="menuitem" className="rail-menu-item danger">
              <LogOut size={16} /> Выйти
            </Link>
          </div>
        )}

        {role === 'student' && (
          <Link to="/student/rewards" title={`Уровень ${me.level}, ${me.xp} опыта`} className="rail-item">
            <span className="rail-level">{me.level}</span>
            <span className="rail-label" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
              Уровень {me.level}
              <Star size={14} strokeWidth={2.4} style={{ fill: 'var(--amber)', color: 'var(--amber)' }} />
              {me.xp}
            </span>
          </Link>
        )}

        {NAV[role].map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === `/${role}`} title={label} className={({ isActive }) => `rail-item${isActive ? ' is-active' : ''}`}>
            <Icon {...ICON} />
            <span className="rail-label">{label}</span>
          </NavLink>
        ))}

        <Link to={`/${role}`} aria-label="SpeakWest Edu, на главную" className="rail-logo">
          <span className="rail-mark">
            <img src="/brand/speakwest-logo-on-light.png" alt="" className="logo-light" />
            <img src="/brand/speakwest-logo-on-dark.png" alt="" className="logo-dark" />
          </span>
        </Link>
      </nav>
    </div>
  )
}

export function Shell({ role, name, children }: { role: Role; name: string; children: ReactNode }) {
  return (
    <div className="v51">
      <Rail role={role} name={name} />
      <main className="main">{children}</main>
      <VersionSwitcher />
    </div>
  )
}

/** A section page on one white sheet over the canvas. */
export function Sheet({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="sheet wide">
      <header className="sheet-head">
        <div>
          <h1 className="h1">{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </div>
  )
}

export function Tabs<Id extends string>({ tabs, active, onSelect }: { tabs: { id: Id; label: string; count?: number }[]; active: Id; onSelect: (id: Id) => void }) {
  return (
    <div role="tablist" className="tabs">
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={t.id === active} onClick={() => onSelect(t.id)} className={`tab${t.id === active ? ' active' : ''}`}>
          {t.label}
          {t.count !== undefined && <span className="tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="search">
      <Search size={18} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>
  )
}

export type CardTone = 'accent' | 'grape' | 'emerald' | 'amber' | 'flame' | 'danger' | 'muted'

/** Home entry card: colour bar on the left, soft icon square, value or arrow. */
export function HomeCard(props: { to: string; icon: LucideIcon; tone: CardTone; label: string; hint: string; value?: number; quiet?: boolean; progress?: number }) {
  const { to, icon: Icon, tone, label, hint, value, quiet, progress } = props
  const isLink = value === undefined
  return (
    <Link to={to} className={`hcard${isLink ? ' is-link' : ''}`}>
      <span className={`hcard-bar bar-${tone}`} />
      <span className={`hcard-icon t-${tone}`}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <span className="hcard-body">
        <span className="hcard-label">{label}</span>
        {!isLink && <span className={`hcard-value${quiet ? ' quiet' : ''}`}>{value}</span>}
        {progress !== undefined && (
          <span className="progress" role="progressbar" aria-valuenow={progress}>
            <span className={`bar-${tone}`} style={{ width: `${progress}%` }} />
          </span>
        )}
        <span className="hcard-hint">{hint}</span>
      </span>
      {isLink && <ArrowRight size={18} className="hcard-go" />}
    </Link>
  )
}

export function HomeBox({ title, link, children }: { title: string; link?: { to: string; label: string }; children: ReactNode }) {
  return (
    <section className="hbox">
      <div className="hbox-head">
        <h2 className="h2">{title}</h2>
        {link && (
          <Link to={link.to} className="link">
            {link.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

const TONES = ['t-accent', 't-sky', 't-grape', 't-flame', 't-emerald', 't-amber']

export function Avatar({ name, size = 'row', plain = false }: { name: string; size?: 'xs' | 'row' | 'lg' | 'xl' | 'xxl'; plain?: boolean }) {
  const tone = plain ? 't-accent' : TONES[Array.from(name).reduce((s, c) => s + c.charCodeAt(0), 0) % TONES.length]
  return <span className={`avatar ${size} ${tone}`}>{name.trim().slice(0, 1).toUpperCase()}</span>
}

export function CourseTile({ color }: { color: Tone }) {
  return (
    <span className={`tile t-${color}`}>
      <BookOpen size={20} strokeWidth={2.2} />
    </span>
  )
}

export function Cover({ course, size }: { course: Course; size?: 'small' | 'mini' }) {
  return (
    <span className={`cover c-${course.color}${size ? ` ${size}` : ''}`} aria-hidden>
      <BookOpen size={size === 'mini' ? 16 : 22} strokeWidth={2.2} style={{ opacity: 0.8 }} />
      {size !== 'mini' && <span className="cover-title">{course.title}</span>}
    </span>
  )
}

export function CourseCard({ course, to, meta }: { course: Course; to: string; meta: string }) {
  return (
    <Link to={to} className="course-card">
      <Cover course={course} />
      <span>
        <span className="course-title">{course.title}</span>
        <span className="row-sub" style={{ display: 'block', marginTop: 4 }}>
          {meta}
        </span>
      </span>
    </Link>
  )
}

export function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <span className="stars" aria-label={`Звёзд: ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} size={size} />
      ))}
    </span>
  )
}

/** Homework rows: the student (teacher view) or the course (student view) on the left, the next step on the right. */
export function HomeworkRows({ items, role }: { items: Homework[]; role: Role }) {
  return (
    <ul className="rows">
      {items.map((h) => {
        const course = courseById(h.courseId)!
        const lesson = lessonById(h.lessonId)!.lesson
        const student = studentById(h.studentId)
        const lessonPath = `/${role}/courses/${course.id}/lessons/${lesson.id}?part=homework`
        return (
          <li key={h.id}>
            {role === 'teacher' ? <Avatar name={student.name} /> : <CourseTile color={course.color} />}
            <span className="row-main">
              <span className="row-title truncate">{lesson.title}</span>
              <span className="row-sub truncate">{role === 'teacher' ? `${student.name} · ${course.title}` : course.title}</span>
              <span className={`row-when${h.overdue ? ' overdue' : ''}`}>{h.when}</span>
            </span>
            <span className={`row-actions${role === 'student' ? ' tile-lead' : ''}`}>
              {h.status === 'checked' ? (
                <Link to={role === 'teacher' ? `/teacher/review/${h.id}` : lessonPath} className="stars-pill">
                  <Star size={16} /> {h.stars}
                </Link>
              ) : role === 'teacher' ? (
                h.status === 'submitted' ? (
                  <Link to={`/teacher/review/${h.id}`} className="btn">
                    Проверить
                  </Link>
                ) : (
                  <Link to={lessonPath} className="btn soft">
                    Открыть урок
                  </Link>
                )
              ) : h.status === 'assigned' ? (
                <Link to={lessonPath} className="btn">
                  Сделать
                </Link>
              ) : (
                <Link to={lessonPath} className="btn soft">
                  Открыть
                </Link>
              )}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function Empty({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon size={22} />
      </span>
      <div>
        <p style={{ fontWeight: 700 }}>{title}</p>
        <p className="muted small">{children}</p>
      </div>
    </div>
  )
}

export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="v51 portal" style={{ position: 'fixed', inset: 0, minHeight: 0, zIndex: 70, background: 'none' }}>
      <div className="backdrop" onMouseDown={onClose}>
        <div className="dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
          <div className="dialog-head">
            <h2 className="h2">{title}</h2>
            <button type="button" className="icon-btn" aria-label="Закрыть" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
