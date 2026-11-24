import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useUiPrefs, type Theme } from '../../context/UiPrefs'
import { teacher } from '../data'
import { Avatar, Sheet, Tabs } from '../ui'

const THEMES: { id: Theme; label: string; icon: typeof Sun; canvas: string; rail: string; line: string; card: string }[] = [
  { id: 'light', label: 'Светлая', icon: Sun, canvas: '#eaf4ff', rail: '#d9ebff', line: '#0f1b33', card: '#ffffff' },
  { id: 'dark', label: 'Тёмная', icon: Moon, canvas: '#07111f', rail: '#0d1a2e', line: '#eef5ff', card: '#0f1c31' },
]

export function TeacherSettings() {
  const [tab, setTab] = useState<'profile' | 'look'>('profile')
  const { theme, setTheme } = useUiPrefs()

  return (
    <Sheet title="Настройки">
      <Tabs
        tabs={[
          { id: 'profile', label: 'Профиль' },
          { id: 'look', label: 'Оформление' },
        ]}
        active={tab}
        onSelect={setTab}
      />
      {tab === 'profile' ? (
        <div className="stack" style={{ maxWidth: 768 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar name={teacher.name} size="xxl" plain />
            <div>
              <p style={{ fontSize: 18, fontWeight: 700 }}>{teacher.name}</p>
              <p className="muted">Преподаватель</p>
            </div>
          </div>
          <div className="fields">
            <label className="field">
              Имя
              <input readOnly value={teacher.name} />
            </label>
            <label className="field">
              Почта
              <input readOnly value={teacher.email} />
            </label>
          </div>
          <p style={{ color: 'var(--text-2)' }}>Имя и почта берутся из аккаунта SpeakWest, здесь их не поменять.</p>
        </div>
      ) : (
        <div className="stack-sm">
          <h2 className="h2">Тема</h2>
          <div className="themes">
            {THEMES.map(({ id, label, icon: Icon, canvas, rail, line, card }) => (
              <button key={id} type="button" aria-pressed={theme === id} onClick={() => setTheme(id)} className={`theme${theme === id ? ' active' : ''}`}>
                <span className="theme-preview" style={{ background: canvas }}>
                  <span className="theme-rail" style={{ background: rail }} />
                  <span className="theme-body">
                    <span className="theme-line" style={{ background: line }} />
                    <span className="theme-cards">
                      <span style={{ background: card }} />
                      <span style={{ background: card }} />
                      <span style={{ background: card }} />
                    </span>
                  </span>
                </span>
                <span className="theme-label">
                  <Icon size={16} /> {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Sheet>
  )
}
