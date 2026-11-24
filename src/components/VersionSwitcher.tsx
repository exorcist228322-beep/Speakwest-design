import { useUiPrefs } from '../context/UiPrefs'
import { VERSIONS, type UiVersion } from '../context/versions'

function label(version: UiVersion) {
  return version.length === 2 ? version : `${version[1]}.${version[2]}`
}

export function VersionSwitcher() {
  const { version, setVersion } = useUiPrefs()

  return (
    <div className="version-switcher" role="group" aria-label="Версия макета">
      <span className="version-switcher-label">Макет</span>
      {VERSIONS.map((v) => (
        <button key={v} type="button" className={version === v ? 'active' : ''} onClick={() => setVersion(v)}>
          {label(v)}
        </button>
      ))}
    </div>
  )
}
