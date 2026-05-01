import { useCallback, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconSpark } from '../components/profile/Icons'
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton'
import { UserPanel } from '../components/profile/UserPanel'
import { getUser, type GitHubUserPayload } from '../lib/api'

type Status = 'idle' | 'loading' | 'error' | 'ready'

export function HomePage() {
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
    <>
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
              Hits <code className="command__code">/dev/:user</code> — served via an edge cache layer backed by a Node origin.
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

          {status === 'loading' && <ProfileSkeleton />}

          {status === 'error' && error && (
            <div className="alert" role="alert">
              <span className="alert__tag">ERR</span>
              <p className="alert__msg">{error}</p>
            </div>
          )}

          {status === 'ready' && user && (
            <div className="home-result">
              <UserPanel user={user} eyebrow="Resolved identity" />
              <div className="home-result__actions">
                <Link className="router-link router-link--primary" to={`/u/${encodeURIComponent(user.username)}`}>
                  Open shareable card →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
