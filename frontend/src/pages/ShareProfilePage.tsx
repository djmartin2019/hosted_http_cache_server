import { startTransition, useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { IconLink, IconSpark } from '../components/profile/Icons'
import { CacheMetaBar } from '../components/profile/CacheMetaBar'
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton'
import { UserPanel } from '../components/profile/UserPanel'
import { useSharePageMeta } from '../hooks/useSharePageMeta'
import { getUserWithMeta, type GitHubUserPayload, type UserFetchMeta } from '../lib/api'

type LoadState = 'loading' | 'ready' | 'error'

function parseUsernameParam(raw: string | undefined): { trimmed: string; username: string } {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return { trimmed: '', username: '' }
  try {
    return { trimmed, username: decodeURIComponent(trimmed).trim() }
  } catch {
    return { trimmed, username: trimmed }
  }
}

export function ShareProfilePage() {
  const { username: rawParam } = useParams<{ username: string }>()
  const { trimmed, username } = parseUsernameParam(rawParam)

  const [state, setState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<GitHubUserPayload | null>(null)
  const [meta, setMeta] = useState<UserFetchMeta | null>(null)
  const [copied, setCopied] = useState(false)

  useSharePageMeta(state === 'ready' ? user : null)

  useEffect(() => {
    if (!username) return

    let cancelled = false
    startTransition(() => {
      if (cancelled) return
      setState('loading')
      setError(null)
      setUser(null)
      setMeta(null)
    })

    void (async () => {
      try {
        const { user: u, meta: m } = await getUserWithMeta(username)
        if (cancelled) return
        startTransition(() => {
          setUser(u)
          setMeta(m)
          setState('ready')
        })
      } catch (e) {
        if (cancelled) return
        startTransition(() => {
          setError(e instanceof Error ? e.message : 'Something went wrong.')
          setState('error')
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [username])

  const copyShareLink = useCallback(async () => {
    if (!user) return
    const path = `/u/${encodeURIComponent(user.username)}`
    const url = `${window.location.origin}${path}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }, [user])

  if (!trimmed || !username) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="share-page">
      <header className="share-page__header">
        <Link to="/" className="share-page__brand">
          <IconSpark />
          <span className="share-page__brand-text">GitHub card</span>
        </Link>
        <nav className="share-page__nav" aria-label="Page">
          <Link to="/" className="share-page__nav-link">
            ← Lookup
          </Link>
          <Link to="/" className="share-page__nav-link share-page__nav-link--ghost">
            Search another
          </Link>
        </nav>
      </header>

      <main className="share-page__main">
        {state === 'loading' && (
          <div className="share-page__card share-page__card--enter">
            <ProfileSkeleton />
          </div>
        )}

        {state === 'error' && error && (
          <div className="share-page__card share-page__card--enter">
            <div className="alert" role="alert">
              <span className="alert__tag">ERR</span>
              <p className="alert__msg">{error}</p>
            </div>
            <div className="share-page__toolbar">
              <Link to="/" className="router-link router-link--primary">
                Back to lookup
              </Link>
            </div>
          </div>
        )}

        {state === 'ready' && user && (
          <div className="share-page__stack share-page__stack--enter">
            <div className="share-page__toolbar">
              <button type="button" className="share-page__btn" onClick={() => void copyShareLink()}>
                <IconLink />
                {copied ? 'Copied!' : 'Copy share link'}
              </button>
            </div>

            <div className="share-page__glow" aria-hidden="true" />

            <UserPanel user={user} eyebrow="Shareable profile" className="user-panel--share" />

            <CacheMetaBar meta={meta} />
          </div>
        )}
      </main>
    </div>
  )
}
