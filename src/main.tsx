import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const theme = localStorage.getItem('sw-theme')
if (theme === 'dark' || theme === 'light') {
  document.documentElement.dataset.theme = theme
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
