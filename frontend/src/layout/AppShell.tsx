import { Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="app">
      <div className="app__aurora" aria-hidden="true" />
      <div className="app__grid" aria-hidden="true" />
      <div className="app__scanlines" aria-hidden="true" />
      <div className="app__vignette" aria-hidden="true" />

      <div className="app__main">
        <Outlet />
      </div>

      <footer className="foot">
        <span className="foot__mono">GitHub Lookup · Edge Cache Demo</span>
        <span className="foot__divider" aria-hidden="true" />
        <a href="https://djm-tech.dev" target="_blank" rel="noreferrer">
          Portfolio
        </a>
        <span className="foot__divider" aria-hidden="true" />
        <a href="https://djm-apps.com" target="_blank" rel="noreferrer">
          More Apps
        </a>
      </footer>
    </div>
  )
}
