import type { UserFetchMeta } from '../../lib/api'

function pillVariant(cache: string): string {
  const k = cache.trim().toLowerCase()
  if (k === 'hit' || k === 'miss' || k === 'stale') return k
  return 'plain'
}

export function CacheMetaBar({ meta }: { meta: UserFetchMeta | null }) {
  if (!meta) return null

  const cache = meta.xCache?.trim() ? meta.xCache.trim().toUpperCase() : null

  return (
    <div className="cache-meta-bar" aria-label="Response metadata">
      {cache && (
        <span className={`cache-meta-bar__pill cache-meta-bar__pill--${pillVariant(cache)}`}>
          {cache}
        </span>
      )}
      {cache && (
        <span className="cache-meta-bar__sep" aria-hidden="true">
          ·
        </span>
      )}
      <span className="cache-meta-bar__mono">{meta.responseTimeMs}ms RTT</span>
      {meta.serverTimingMs != null && (
        <>
          <span className="cache-meta-bar__sep" aria-hidden="true">
            ·
          </span>
          <span className="cache-meta-bar__mono" title="From Server-Timing header">
            srv {meta.serverTimingMs}ms
          </span>
        </>
      )}
    </div>
  )
}
