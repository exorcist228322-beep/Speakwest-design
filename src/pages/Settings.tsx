import { useState, type FormEvent } from 'react'
import { initial, TEACHER_NAME } from '../data/mock'
import { useUiPrefs, type Theme } from '../context/UiPrefs'
import { IconMoon, IconSun } from '../components/Icons'

type Tab = 'profile' | 'look'

const themes: { id: Theme; label: string; icon: typeof IconSun }[] = [
  { id: 'light', label: 'Светлая', icon: IconSun },
  { id: 'dark', label: 'Тёмная', icon: IconMoon },
]

export function Settings() {
  const { theme, setTheme } = useUiPrefs()
  const [tab, setTab] = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)

  function save(e: FormEvent) {
    e.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="ev-panel">
      <h1 className="ev-title">Настройки</h1>

      <div className="ev-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'profile'}
          className={tab === 'profile' ? 'active' : ''}
          onClick={() => setTab('profile')}
        >
          Профиль
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'look'}
          className={tab === 'look' ? 'active' : ''}
          onClick={() => setTab('look')}
        >
          Оформление
        </button>
      </div>

      {tab === 'profile' ? (
        <form className="ev-settings" onSubmit={save}>
          <div className="ev-photo">
            <span className="ev-avatar ev-avatar-xl tone-0">{initial(TEACHER_NAME)}</span>
            <div>
              <div className="ev-photo-name">{TEACHER_NAME}</div>
              <div className="ev-photo-role">Преподаватель</div>
              <button type="button" className="ev-link-btn">
                Сменить фото
              </button>
            </div>
          </div>

          <div className="ev-form-grid">
            <label className="ev-field">
              <span>Имя</span>
              <input defaultValue={TEACHER_NAME} />
            </label>
            <label className="ev-field">
              <span>Фамилия</span>
              <input placeholder="Фамилия" />
            </label>
            <label className="ev-field">
              <span>Почта</span>
              <input type="email" placeholder="name@mail.com" />
            </label>
            <label className="ev-field">
              <span>Телефон</span>
              <input type="tel" placeholder="+7 700 000 00 00" />
            </label>
            <label className="ev-field">
              <span>Часовой пояс</span>
              <select defaultValue="almaty">
                <option value="almaty">Алматы (GMT+5)</option>
                <option value="moscow">Москва (GMT+3)</option>
                <option value="kyiv">Киев (GMT+2)</option>
                <option value="berlin">Берлин (GMT+1)</option>
              </select>
            </label>
            <label className="ev-field">
              <span>Язык интерфейса</span>
              <select defaultValue="ru">
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>

          <div className="ev-form-actions">
            <button type="submit" className="ev-btn">
              Сохранить
            </button>
            {saved && <span className="ev-saved">Сохранено</span>}
          </div>
        </form>
      ) : (
        <div className="ev-settings">
          <h2 className="ev-subtitle">Тема</h2>
          <div className="ev-theme-grid">
            {themes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`ev-theme ev-theme-${id}${theme === id ? ' active' : ''}`}
                aria-pressed={theme === id}
                onClick={() => setTheme(id)}
              >
                <span className="ev-theme-preview" aria-hidden>
                  <span className="ev-theme-rail" />
                  <span className="ev-theme-body">
                    <span className="ev-theme-line" />
                    <span className="ev-theme-cards">
                      <span />
                      <span />
                      <span />
                    </span>
                  </span>
                </span>
                <span className="ev-theme-label">
                  <Icon size={16} /> {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
