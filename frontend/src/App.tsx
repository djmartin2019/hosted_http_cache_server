import { useCallback, useId, useState, type ReactNode } from 'react'
import { getUser, type GitHubUserPayload } from './lib/api'
import './App.css'

type Status = 'idle' | 'loading' | 'error' | 'ready'

function IconSpark() {
  return (
    <svg className="app__spark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  )
}

function IconRepos() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" />
      <path d="M8 10h8M8 14h5" strokeLinecap="round" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" strokeLinecap="round" />
      <path d="M17 11h1a3 3 0 0 1 3 3v1" strokeLinecap="round" />
    </svg>
  )
}

function IconFollowing() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M14 4h6v6M10 14 20 4M8 20H4v-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatTile({
  label,
  value,
  icon,
  delay,
}: {
  label: string
  value: string | number
  icon: ReactNode
  delay: string
}) {
  return (
    <div className="stat-tile" style={{ '--d': delay } as React.CSSProperties}>
      <span className="stat-tile__glyph" aria-hidden="true">
        {icon}
      </span>
      <span className="stat-tile__label">{label}</span>
      <span className="stat-tile__value">{value}</span>
    </div>
  )
}

function UserPanel({ user }: { user: GitHubUserPayload }) {
  const href = `https://github.com/${encodeURIComponent(user.username)}`
  return (
    <article className="user-panel" aria-labelledby="profile-heading">
      <div className="user-panel__hud">
        <span className="user-panel__corner user-panel__corner--tl" aria-hidden="true" />
        <span className="user-panel__corner user-panel__corner--tr" aria-hidden="true" />
        <span className="user-panel__corner user-panel__corner--bl" aria-hidden="true" />
        <span className="user-panel__corner user-panel__corner--br" aria-hidden="true" />
      </div>

      <div className="user-panel__inner">
        <div className="user-panel__identity">
          <div className="avatar-ring">
            <img
              src={user.avatar_url}
              alt=""
              width={120}
              height={120}
              className="avatar-ring__img"
              decoding="async"
            />
          </div>
          <div className="user-panel__meta">
            <p className="user-panel__eyebrow">Resolved identity</p>
            <h2 id="profile-heading" className="user-panel__name">
              @{user.username}
            </h2>
            <a className="user-panel__link" href={href} target="_blank" rel="noreferrer">
              Open on GitHub
              <IconExternal />
            </a>
          </div>
        </div>

        <div className="user-panel__stats" role="list">
          <StatTile label="Public repos" value={user.public_repos} icon={<IconRepos />} delay="0.05s" />
          <StatTile label="Followers" value={user.followers} icon={<IconUsers />} delay="0.1s" />
          <StatTile label="Following" value={user.following} icon={<IconFollowing />} delay="0.15s" />
          <StatTile
            label="Account age"
            value={`${user.creation_date} yrs`}
            icon={<IconClock />}
            delay="0.2s"
          />
        </div>
      </div>
    </article>
  )
}

function App() {
  const formId = useId()
  const inputId = useId()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<GitHubUserPayload | null>(null)

  const runLookup = useCallback(async (raw: string) => {
    const username = raw.trim()
    if (!username) {
      setError('Enter a GitHub username.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setError(null)
    setUser(null)
    try {
      const data = await getUser(username)
      setUser(data)
      setStatus('ready')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setStatus('error')
    }
  }, [])

  return (
    <div className="app">
      <div className="app__aurora" aria-hidden="true" />
      <div className="app__grid" aria-hidden="true" />
      <div className="app__scanlines" aria-hidden="true" />
      <div className="app__vignette" aria-hidden="true" />

      <header className="hero">
        <div className="hero__badge">
          <IconSpark />
          <span>Edge cache · dev resolver</span>
        </div>
        <h1 className="hero__title">
          <span className="hero__title-main">GitHub</span>
          <span className="hero__title-accent">spectral lookup</span>
        </h1>
        <p className="hero__lede">
          Pull a profile through your stack. Cyberpunk chrome, Cursor-grade polish — one username away.
        </p>
      </header>

      <main className="shell">
        <section className="command" aria-labelledby={`${formId}-legend`}>
          <div className="command__chrome">
            <span className="command__dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="command__title">resolver.session</span>
            <span className="command__pill">LIVE</span>
          </div>

          <form
            id={formId}
            className="command__body"
            onSubmit={(e) => {
              e.preventDefault()
              void runLookup(query)
            }}
          >
            <label htmlFor={inputId} className="visually-hidden">
              GitHub username
            </label>
            <div className="command__field">
              <span className="command__prompt" aria-hidden="true">
                <span className="command__path">~/cache</span>
                <span className="command__chev">⟩</span>
              </span>
              <input
                id={inputId}
                className="command__input"
                name="username"
                autoComplete="username"
                spellCheck={false}
                placeholder="octocat"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={status === 'loading'}
              />
              <button type="submit" className="command__submit" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <>
                    <span className="command__spinner" aria-hidden="true" />
                    Resolving
                  </>
                ) : (
                  'Resolve'
                )}
              </button>
            </div>
            <p id={`${formId}-legend`} className="command__hint">
              Hits <code className="command__code">/dev/:user</code> — Vite proxies to <code className="command__code">localhost:3000</code> in dev.
            </p>
          </form>
        </section>

        <div className="stage" aria-live="polite">
          {status === 'idle' && (
            <div className="placeholder">
              <div className="placeholder__orbit" aria-hidden="true" />
              <p className="placeholder__text">Awaiting coordinates. Try a handle you love.</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="skeleton-card" aria-busy="true" aria-label="Loading profile">
              <div className="skeleton-card__row">
                <div className="skeleton skeleton--avatar" />
                <div className="skeleton-card__text">
                  <div className="skeleton skeleton--line lg" />
                  <div className="skeleton skeleton--line sm" />
                </div>
              </div>
              <div className="skeleton-grid">
                <div className="skeleton skeleton--tile" />
                <div className="skeleton skeleton--tile" />
                <div className="skeleton skeleton--tile" />
                <div className="skeleton skeleton--tile" />
              </div>
            </div>
          )}

          {status === 'error' && error && (
            <div className="alert" role="alert">
              <span className="alert__tag">ERR</span>
              <p className="alert__msg">{error}</p>
            </div>
          )}

          {status === 'ready' && user && <UserPanel user={user} />}
        </div>
      </main>

      <footer className="foot">
        <span className="foot__mono">SYNTH_UI · v0</span>
        <span className="foot__divider" aria-hidden="true" />
        <span>Built for the edge cache experiment</span>
      </footer>
    </div>
  )
}

export default App
