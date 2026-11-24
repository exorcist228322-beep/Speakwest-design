import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, UserRound } from 'lucide-react'
import { VersionSwitcher } from '../components/VersionSwitcher'
import { students } from './data'
import { Avatar } from './ui'

function AuthFrame({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <div className="v51 auth">
      <header className="auth-head">
        <span className="auth-logo">
          <img src="/brand/speakwest-logo-on-light.png" alt="SpeakWest" className="logo-light" />
          <img src="/brand/speakwest-logo-on-dark.png" alt="SpeakWest" className="logo-dark" />
          <span className="edu-pill">Edu</span>
        </span>
      </header>
      <main className="auth-card">
        <div className="stack-sm">
          <h1 className="h1">{title}</h1>
          <p style={{ fontSize: 18, color: 'var(--text-2)' }}>{lead}</p>
        </div>
        {children}
      </main>
      <VersionSwitcher />
    </div>
  )
}

/** Sign-in. In the mock the two buttons only pick which cabinet to open. */
export function Login() {
  const navigate = useNavigate()

  return (
    <AuthFrame title="Вход в SpeakWest Edu" lead="Учителя входят через Google. Ученики — по ссылке от учителя.">
      <button type="button" className="google-btn" onClick={() => navigate('/teacher')}>
        <UserRound size={18} /> Войти как учитель
      </button>
      <div className="divider">или</div>
      <button type="button" className="google-btn" onClick={() => navigate('/choose')}>
        <GraduationCap size={18} /> Войти как родитель или ученик
      </button>
    </AuthFrame>
  )
}

/** A parent with several children picks who is studying now. */
export function Choose() {
  return (
    <AuthFrame title="Кто сейчас занимается?" lead="Выберите ученика. Сменить можно в меню аккаунта.">
      <ul className="stack-sm">
        {students.slice(0, 2).map((s) => (
          <li key={s.id}>
            <Link to="/student" className="who">
              <Avatar name={s.name} size="lg" plain />
              <span>
                <span style={{ display: 'block', fontSize: 20, fontWeight: 700 }}>{s.name}</span>
                <span className="muted">{s.age} лет</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/login" className="muted small" style={{ textAlign: 'center', fontWeight: 600 }}>
        Выйти
      </Link>
    </AuthFrame>
  )
}
