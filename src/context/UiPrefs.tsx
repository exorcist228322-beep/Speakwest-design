import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'
export type UiVersion =
  | 'v1'
  | 'v2'
  | 'v3'
  | 'v31'
  | 'v32'
  | 'v33'
  | 'v34'
  | 'v41'
  | 'v42'
  | 'v43'
  | 'v44'
  | 'v46'
  | 'v47'
  | 'v48'
  | 'v50'

const VERSIONS: UiVersion[] = [
  'v1',
  'v2',
  'v3',
  'v31',
  'v32',
  'v33',
  'v34',
  'v41',
  'v42',
  'v43',
  'v44',
  'v46',
  'v47',
  'v48',
  'v50',
]

type UiPrefs = {
  theme: Theme
  version: UiVersion
  setTheme: (theme: Theme) => void
  setVersion: (version: UiVersion) => void
}

const STORAGE_THEME = 'sw-theme'
const STORAGE_VERSION = 'sw-version'

const UiPrefsContext = createContext<UiPrefs | null>(null)

function readTheme(): Theme {
  const v = localStorage.getItem(STORAGE_THEME)
  return v === 'dark' ? 'dark' : 'light'
}

function readVersion(): UiVersion {
  const v = localStorage.getItem(STORAGE_VERSION)
  return VERSIONS.includes(v as UiVersion) ? (v as UiVersion) : 'v50'
}

export function UiPrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window === 'undefined' ? 'light' : readTheme(),
  )
  const [version, setVersionState] = useState<UiVersion>(() =>
    typeof window === 'undefined' ? 'v1' : readVersion(),
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_THEME, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.version = version
    localStorage.setItem(STORAGE_VERSION, version)
  }, [version])

  return (
    <UiPrefsContext.Provider
      value={{
        theme,
        version,
        setTheme: setThemeState,
        setVersion: setVersionState,
      }}
    >
      {children}
    </UiPrefsContext.Provider>
  )
}

export function useUiPrefs() {
  const ctx = useContext(UiPrefsContext)
  if (!ctx) throw new Error('useUiPrefs must be used within UiPrefsProvider')
  return ctx
}
