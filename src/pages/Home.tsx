import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  courses,
  initial,
  students,
  TEACHER_NAME,
  todayLabel,
} from '../data/mock'
import { useUiPrefs } from '../context/UiPrefs'
import {
  IconBook,
  IconClipboard,
  IconNotebook,
  IconPlus,
  IconPulse,
  IconSettings,
  IconTrophy,
  IconUsers,
} from '../components/Icons'
import { NewCourseModal } from '../components/NewCourseModal'
import { HomeV50 } from './HomeV50'

export function Home() {
  const { version } = useUiPrefs()
  return version === 'v50' ? <HomeV50 /> : <HomeLegacy />
}

function HomeLegacy() {
  const { version } = useUiPrefs()
  const isV41 = version === 'v41'
  const isV42 = version === 'v42'
  const isV43 = version === 'v43'
  const isV44 = version === 'v44'
  const isV46 = version === 'v46'
  const isV47 = version === 'v47'
  const isV48 = version === 'v48'
  const isV4Home = isV41 || isV42
  const hidePageTop = isV44
  const [modalOpen, setModalOpen] = useState(false)
  const lessonsTotal = courses.reduce((sum, c) => sum + c.lessons, 0)

  const statsCore = (
    <>
      <div className="stat-card">
        <div className="stat-icon blue">
          <IconUsers />
        </div>
        <div>
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Ученики</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon purple">
          <IconBook />
        </div>
        <div>
          <div className="stat-value">{courses.length}</div>
          <div className="stat-label">Курсы</div>
          <div className="stat-extra">{lessonsTotal} уроков</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon green">
          <IconClipboard />
        </div>
        <div>
          <div className="stat-value">0</div>
          <div className="stat-label">Ждут проверки</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon orange">
          <IconNotebook />
        </div>
        <div>
          <div className="stat-value">0</div>
          <div className="stat-label">Домашки в работе</div>
        </div>
      </div>
    </>
  )

  const statsV41 = (
    <>
      {statsCore}
      <button type="button" className="stat-card stat-card-btn">
        <div className="stat-icon gold">
          <IconTrophy />
        </div>
        <div>
          <div className="stat-value">0</div>
          <div className="stat-label">Ачивки</div>
          <div className="stat-extra">Пока нет наград</div>
        </div>
      </button>
      <button type="button" className="stat-card stat-card-btn">
        <div className="stat-icon slate">
          <IconSettings />
        </div>
        <div>
          <div className="stat-label">Настройки</div>
          <div className="stat-extra">Профиль и кабинет</div>
        </div>
      </button>
    </>
  )

  const statsV42 = (
    <div className="metrics-v42">
      <Link to="/students" className="metric-tile tone-blue">
        <span className="metric-tile-icon" aria-hidden>
          <IconUsers />
        </span>
        <span className="metric-tile-label">Ученики</span>
        <span className="metric-tile-value">{students.length}</span>
        <span className="metric-tile-hint">в вашем кабинете</span>
      </Link>

      <Link to="/courses" className="metric-tile tone-purple">
        <span className="metric-tile-icon" aria-hidden>
          <IconBook />
        </span>
        <span className="metric-tile-label">Курсы</span>
        <span className="metric-tile-value">{courses.length}</span>
        <span className="metric-tile-hint">{lessonsTotal} уроков всего</span>
      </Link>

      <Link to="/review" className="metric-tile tone-green">
        <span className="metric-tile-icon" aria-hidden>
          <IconClipboard />
        </span>
        <span className="metric-tile-label">На проверке</span>
        <span className="metric-tile-value is-quiet">0</span>
        <span className="metric-tile-hint">очередь пуста</span>
      </Link>

      <div className="metric-tile tone-orange">
        <span className="metric-tile-icon" aria-hidden>
          <IconNotebook />
        </span>
        <span className="metric-tile-label">Домашки</span>
        <span className="metric-tile-value is-quiet">0</span>
        <span className="metric-tile-hint">сейчас в работе</span>
      </div>

      <button type="button" className="metric-tile metric-tile-action tone-gold">
        <span className="metric-tile-icon" aria-hidden>
          <IconTrophy />
        </span>
        <span className="metric-tile-copy">
          <span className="metric-tile-label">Ачивки</span>
          <span className="metric-tile-hint">Награды появятся по мере прогресса</span>
        </span>
        <span className="metric-tile-go" aria-hidden>
          →
        </span>
      </button>

      <button type="button" className="metric-tile metric-tile-action tone-slate">
        <span className="metric-tile-icon" aria-hidden>
          <IconSettings />
        </span>
        <span className="metric-tile-copy">
          <span className="metric-tile-label">Настройки</span>
          <span className="metric-tile-hint">Профиль и кабинет</span>
        </span>
        <span className="metric-tile-go" aria-hidden>
          →
        </span>
      </button>
    </div>
  )

  const statsV43 = (
    <div className="panels-v43">
      <Link to="/students" className="panel-v43 accent-blue">
        <span className="panel-v43-icon" aria-hidden>
          <IconUsers />
        </span>
        <span className="panel-v43-body">
          <span className="panel-v43-label">Ученики</span>
          <span className="panel-v43-value">{students.length}</span>
          <span className="panel-v43-hint">в вашем кабинете</span>
        </span>
      </Link>

      <Link to="/courses" className="panel-v43 accent-purple">
        <span className="panel-v43-icon" aria-hidden>
          <IconBook />
        </span>
        <span className="panel-v43-body">
          <span className="panel-v43-label">Курсы</span>
          <span className="panel-v43-value">{courses.length}</span>
          <span className="panel-v43-hint">{lessonsTotal} уроков всего</span>
        </span>
      </Link>

      <Link to="/review" className="panel-v43 accent-green">
        <span className="panel-v43-icon" aria-hidden>
          <IconClipboard />
        </span>
        <span className="panel-v43-body">
          <span className="panel-v43-label">На проверке</span>
          <span className="panel-v43-value is-quiet">0</span>
          <span className="panel-v43-hint">очередь пуста</span>
        </span>
      </Link>

      <div className="panel-v43 accent-orange">
        <span className="panel-v43-icon" aria-hidden>
          <IconNotebook />
        </span>
        <span className="panel-v43-body">
          <span className="panel-v43-label">Домашки</span>
          <span className="panel-v43-value is-quiet">0</span>
          <span className="panel-v43-hint">сейчас в работе</span>
        </span>
      </div>

      <button type="button" className="panel-v43 panel-v43-link accent-gold">
        <span className="panel-v43-icon" aria-hidden>
          <IconTrophy />
        </span>
        <span className="panel-v43-body">
          <span className="panel-v43-label">Ачивки</span>
          <span className="panel-v43-hint wide">Награды появятся по мере прогресса</span>
        </span>
        <span className="panel-v43-go" aria-hidden>
          →
        </span>
      </button>

      <Link to="/settings" className="panel-v43 panel-v43-link accent-slate">
        <span className="panel-v43-icon" aria-hidden>
          <IconSettings />
        </span>
        <span className="panel-v43-body">
          <span className="panel-v43-label">Настройки</span>
          <span className="panel-v43-hint wide">Профиль и кабинет</span>
        </span>
        <span className="panel-v43-go" aria-hidden>
          →
        </span>
      </Link>
    </div>
  )

  const campusFeed = (
    <section className="campus-feed">
      <div className="campus-feed-art" aria-hidden>
        <span className="campus-blob b1" />
        <span className="campus-blob b2" />
        <span className="campus-blob b3" />
        <span className="campus-feed-icon">
          <IconPulse />
        </span>
      </div>
      <div className="campus-feed-copy">
        <h2>Пока всё спокойно</h2>
        <p>Когда ученики сдадут домашки, свежие события появятся здесь</p>
      </div>
    </section>
  )

  const activityLane = (
    <section className="activity-v43">
      <div className="activity-v43-head">
        <h2 className="activity-v43-title">Последние активности</h2>
        <span className="activity-v43-badge">пусто</span>
      </div>
      <div className="activity-v43-empty">
        <div className="activity-v43-icon" aria-hidden>
          <IconPulse />
        </div>
        <div>
          <p className="activity-v43-lead">Пока тихо</p>
          <p className="activity-v43-text">
            Здесь появятся сданные и проверенные домашки ваших учеников
          </p>
        </div>
      </div>
    </section>
  )

  const welcomeBanner = (
    <section className="welcome-v44">
      <div className="welcome-v44-copy">
        <p className="welcome-v44-kicker">{capitalize(todayLabel())}</p>
        <h1 className="welcome-v44-title">Добро пожаловать, {TEACHER_NAME}</h1>
        <p className="welcome-v44-sub">
          Кабинет готов — смотрите активность учеников и держите курсы под рукой
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary welcome-v44-cta"
        onClick={() => setModalOpen(true)}
      >
        <IconPlus /> Новый курс
      </button>
    </section>
  )

  const activity = (
    <section className={`card${isV4Home ? ' activity-wide' : ''}`}>
      <div className="card-head">
        <h2 className="card-title">
          {isV4Home ? 'Последние активности' : 'Последняя активность'}
        </h2>
      </div>
      <div className="empty-state">
        <div className="empty-icon">
          <IconPulse />
        </div>
        <p>Здесь появятся сданные и проверенные домашки ваших учеников</p>
      </div>
    </section>
  )

  return (
    <>
      {!hidePageTop && (
        <div className="page-top">
          <div>
            <p className="page-kicker">{capitalize(todayLabel())}.</p>
            <h1 className="page-title">Добро пожаловать, {TEACHER_NAME}!</h1>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <IconPlus /> Новый курс
          </button>
        </div>
      )}

      {isV48 ? (
        <div className="home-v48">
          {campusFeed}
          {statsV43}
        </div>
      ) : isV47 ? (
        <div className="home-v47">
          {campusFeed}

          <div className="campus-grid metrics-v47">
            <Link to="/students" className="metric-tile tone-blue">
              <span className="metric-tile-icon" aria-hidden>
                <IconUsers />
              </span>
              <span className="metric-tile-label">Ученики</span>
              <span className="metric-tile-value">{students.length}</span>
              <span className="metric-tile-hint">в вашем кабинете</span>
            </Link>

            <Link to="/courses" className="metric-tile tone-purple">
              <span className="metric-tile-icon" aria-hidden>
                <IconBook />
              </span>
              <span className="metric-tile-label">Курсы</span>
              <span className="metric-tile-value">{courses.length}</span>
              <span className="metric-tile-hint">{lessonsTotal} уроков</span>
            </Link>

            <Link to="/review" className="metric-tile tone-green">
              <span className="metric-tile-icon" aria-hidden>
                <IconClipboard />
              </span>
              <span className="metric-tile-label">На проверке</span>
              <span className="metric-tile-value is-quiet">0</span>
              <span className="metric-tile-hint">можно выдохнуть</span>
            </Link>

            <div className="metric-tile tone-orange">
              <span className="metric-tile-icon" aria-hidden>
                <IconNotebook />
              </span>
              <span className="metric-tile-label">Домашки</span>
              <span className="metric-tile-value is-quiet">0</span>
              <span className="metric-tile-hint">сейчас в работе</span>
            </div>

            <button type="button" className="metric-tile tone-gold">
              <span className="metric-tile-icon" aria-hidden>
                <IconTrophy />
              </span>
              <span className="metric-tile-label">Ачивки</span>
              <span className="metric-tile-value is-quiet">0</span>
              <span className="metric-tile-hint">награды за прогресс</span>
            </button>

            <button type="button" className="metric-tile tone-slate metric-tile-settings">
              <span className="metric-tile-icon" aria-hidden>
                <IconSettings />
              </span>
              <span className="metric-tile-label">Настройки</span>
              <span className="metric-tile-hint metric-tile-hint-grow">профиль и кабинет</span>
            </button>
          </div>
        </div>
      ) : isV46 ? (
        <div className="home-v46">
          {campusFeed}

          <div className="campus-grid">
            <Link to="/students" className="campus-card tone-sky">
              <span className="campus-icon">
                <IconUsers />
              </span>
              <span className="campus-num">{students.length}</span>
              <span className="campus-label">Ученики</span>
              <span className="campus-note">в вашем кабинете</span>
            </Link>

            <Link to="/courses" className="campus-card tone-grape">
              <span className="campus-icon">
                <IconBook />
              </span>
              <span className="campus-num">{courses.length}</span>
              <span className="campus-label">Курсы</span>
              <span className="campus-note">{lessonsTotal} уроков</span>
            </Link>

            <Link to="/review" className="campus-card tone-leaf">
              <span className="campus-icon">
                <IconClipboard />
              </span>
              <span className="campus-num">0</span>
              <span className="campus-label">На проверке</span>
              <span className="campus-note">можно выдохнуть</span>
            </Link>

            <div className="campus-card tone-sun">
              <span className="campus-icon">
                <IconNotebook />
              </span>
              <span className="campus-num">0</span>
              <span className="campus-label">Домашки</span>
              <span className="campus-note">сейчас в работе</span>
            </div>

            <button type="button" className="campus-card campus-card-link tone-coral">
              <span className="campus-icon">
                <IconTrophy />
              </span>
              <span className="campus-label">Ачивки</span>
              <span className="campus-note">награды за прогресс</span>
            </button>

            <button type="button" className="campus-card campus-card-link tone-slate">
              <span className="campus-icon">
                <IconSettings />
              </span>
              <span className="campus-label">Настройки</span>
              <span className="campus-note">профиль и кабинет</span>
            </button>
          </div>
        </div>
      ) : isV44 ? (
        <div className="home-v44">
          {welcomeBanner}
          {activityLane}
          {statsV43}
        </div>
      ) : isV43 ? (
        <div className="home-v43">
          {activityLane}
          {statsV43}
        </div>
      ) : isV42 ? (
        <div className="home-v42">
          {activity}
          {statsV42}
        </div>
      ) : isV41 ? (
        <div className="home-v41">
          {activity}
          <div className="stats stats-3x2">{statsV41}</div>
        </div>
      ) : (
        <>
          <div className="stats">{statsCore}</div>
          <div className="home-grid">
            {activity}
            <section className="card">
              <div className="card-head">
                <h2 className="card-title">Мои ученики</h2>
                <Link to="/students" className="link-all">
                  Все
                </Link>
              </div>
              {students.slice(0, 5).map((s) => (
                <div key={s.id} className="student-row">
                  <div className="avatar">{initial(s.name)}</div>
                  <div className="student-meta">
                    <div className="student-name">{s.name}</div>
                    <div className="student-level">Уровень {s.level}</div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </>
      )}

      {modalOpen && <NewCourseModal onClose={() => setModalOpen(false)} />}
    </>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
