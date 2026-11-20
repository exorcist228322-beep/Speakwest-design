import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { TEACHER_NAME } from '../data/mock'
import { useUiPrefs } from '../context/UiPrefs'
import {
  IconBook,
  IconChevronDown,
  IconClipboard,
  IconGradCap,
  IconHome,
  IconLogout,
  IconMoon,
  IconSun,
  IconUsers,
} from './Icons'

const navDefault = [
  { to: '/', label: 'Главная', icon: IconHome, end: true },
  { to: '/courses', label: 'Курсы', icon: IconGradCap },
  { to: '/students', label: 'Ученики', icon: IconUsers },
  { to: '/review', label: 'Проверка', icon: IconClipboard },
]

const navV32 = [
  { to: '/', label: 'Главная', icon: IconHome, end: true },
  { to: '/courses', label: 'Курсы', icon: IconBook },
  { to: '/students', label: 'Ученики', icon: IconGradCap },
  { to: '/review', label: 'Проверка', icon: IconClipboard },
]

export function Layout() {
  const location = useLocation()
  const { theme, version, setTheme, setVersion } = useUiPrefs()
  const isV32Family =
    version === 'v32' ||
    version === 'v33' ||
    version === 'v34' ||
    version === 'v41' ||
    version === 'v42' ||
    version === 'v43' ||
    version === 'v44' ||
    version === 'v46' ||
    version === 'v47'
  const isRail = version === 'v3' || version === 'v31' || isV32Family
  const isV31 = version === 'v31'
  const showEagle = isV31 || isV32Family
  const nav = isV32Family ? navV32 : navDefault
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMenuOpen(false)
    setUserOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!userRef.current?.contains(e.target as Node)) setUserOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setUserOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const sidebarClass = [
    isRail ? 'sidebar rail' : `sidebar${menuOpen ? ' drawer' : ' collapsed'}`,
    isV32Family && userOpen ? 'expanded' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const dropdown = userOpen && (
    <div className={`user-dropdown${isV32Family ? ' user-dropdown-rail' : ''}`} role="menu">
      <div className="user-dropdown-label">Тема</div>
      <div className="theme-switch">
        <button
          type="button"
          className={theme === 'light' ? 'active' : ''}
          onClick={() => setTheme('light')}
        >
          <IconSun size={15} /> Светлая
        </button>
        <button
          type="button"
          className={theme === 'dark' ? 'active' : ''}
          onClick={() => setTheme('dark')}
        >
          <IconMoon size={15} /> Тёмная
        </button>
      </div>
      <div className="user-dropdown-divider" />
      <button
        type="button"
        className="user-dropdown-item danger"
        role="menuitem"
        onClick={() => {
          setUserOpen(false)
          window.alert('Выход (макет)')
        }}
      >
        <IconLogout size={16} /> Выйти
      </button>
    </div>
  )

  return (
    <div className={`app-shell version-${version}`}>
      {!isV32Family && (
        <header className="header">
          <div className="header-left">
            {!isRail && (
              <button
                type="button"
                className="burger"
                aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="burger-lines" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            )}
            {!isV31 && (
              <NavLink to="/" className="logo">
                <img
                  src="/logo-speakwest.png?v=trans"
                  alt="speakwest"
                  className="logo-img"
                />
              </NavLink>
            )}
          </div>
          <div className="header-right">
            <div className="user-menu" ref={userRef}>
              <button
                type="button"
                className={`user-trigger${userOpen ? ' open' : ''}`}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                onClick={() => setUserOpen((v) => !v)}
              >
                {TEACHER_NAME}
                <IconChevronDown size={14} />
              </button>
              {dropdown}
            </div>
          </div>
        </header>
      )}

      <div className="body-row">
        {!isRail && (
          <div
            className={`sidebar-overlay${menuOpen ? ' visible' : ''}`}
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
        )}
        <aside className={sidebarClass}>
          <div className="sidebar-nav">
            {isV32Family && (
              <div className="user-menu user-menu-rail" ref={userRef}>
                <button
                  type="button"
                  className={`nav-item user-rail-btn${userOpen ? ' open' : ''}`}
                  aria-expanded={userOpen}
                  aria-haspopup="menu"
                  title={TEACHER_NAME}
                  onClick={() => setUserOpen((v) => !v)}
                >
                  <span className="nav-icon">
                    <IconUsers size={22} />
                  </span>
                  <span className="nav-label">{TEACHER_NAME}</span>
                </button>
                {dropdown}
              </div>
            )}
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                title={label}
              >
                <span className="nav-icon">
                  <Icon size={22} />
                </span>
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
          </div>

          {showEagle && (
            <NavLink to="/" className="logo-rail" title="speakwest">
              <span className="logo-eagle-wrap">
                <img src="/logo-eagle.png?v=4" alt="" className="logo-eagle" />
              </span>
              <img
                src="/logo-wordmark.png"
                alt="speakwest"
                className="logo-wordmark"
              />
            </NavLink>
          )}
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>

      <div className="version-switcher" role="group" aria-label="Версия макета">
        <span className="version-switcher-label">Макет</span>
        <button type="button" className={version === 'v1' ? 'active' : ''} onClick={() => setVersion('v1')}>
          v1
        </button>
        <button type="button" className={version === 'v2' ? 'active' : ''} onClick={() => setVersion('v2')}>
          v2
        </button>
        <button type="button" className={version === 'v3' ? 'active' : ''} onClick={() => setVersion('v3')}>
          v3
        </button>
        <button type="button" className={version === 'v31' ? 'active' : ''} onClick={() => setVersion('v31')}>
          3.1
        </button>
        <button type="button" className={version === 'v32' ? 'active' : ''} onClick={() => setVersion('v32')}>
          3.2
        </button>
        <button type="button" className={version === 'v33' ? 'active' : ''} onClick={() => setVersion('v33')}>
          3.3
        </button>
        <button type="button" className={version === 'v34' ? 'active' : ''} onClick={() => setVersion('v34')}>
          3.4
        </button>
        <button type="button" className={version === 'v41' ? 'active' : ''} onClick={() => setVersion('v41')}>
          4.1
        </button>
        <button type="button" className={version === 'v42' ? 'active' : ''} onClick={() => setVersion('v42')}>
          4.2
        </button>
        <button type="button" className={version === 'v43' ? 'active' : ''} onClick={() => setVersion('v43')}>
          4.3
        </button>
        <button type="button" className={version === 'v44' ? 'active' : ''} onClick={() => setVersion('v44')}>
          4.4
        </button>
        <button type="button" className={version === 'v46' ? 'active' : ''} onClick={() => setVersion('v46')}>
          4.6
        </button>
        <button type="button" className={version === 'v47' ? 'active' : ''} onClick={() => setVersion('v47')}>
          4.7
        </button>
      </div>
    </div>
  )
}
