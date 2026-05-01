export type GitHubUserPayload = {
  username: string
  avatar_url: string
  followers: number
  following: number
  public_repos: number
  creation_date: string
}

export type ApiErrorBody = { error: string }

export type UserFetchMeta = {
  /** From `X-Cache` response header (e.g. HIT, MISS) when the edge sends it */
  xCache: string | null
  /** Sum of `dur` values in `Server-Timing` if present */
  serverTimingMs: number | null
  /** Round-trip measured in the browser */
  responseTimeMs: number
}

function parseServerTimingMs(header: string | null): number | null {
  if (!header) return null
  const matches = [...header.matchAll(/dur=(\d+(?:\.\d+)?)/gi)]
  if (!matches.length) return null
  const total = matches.reduce((sum, m) => sum + Number(m[1]), 0)
  return Math.round(total)
}

export async function getUser(username: string): Promise<GitHubUserPayload> {
  const q = encodeURIComponent(username.trim())
  const res = await fetch(`/dev/${q}`)
  const data = (await res.json()) as GitHubUserPayload | ApiErrorBody
  if (!res.ok || 'error' in data) {
    const msg = 'error' in data ? data.error : `Request failed (${res.status})`
    throw new Error(msg)
  }
  return data
}

export async function getUserWithMeta(
  username: string,
): Promise<{ user: GitHubUserPayload; meta: UserFetchMeta }> {
  const q = encodeURIComponent(username.trim())
  const t0 = performance.now()
  const res = await fetch(`/dev/${q}`)
  const responseTimeMs = Math.round(performance.now() - t0)
  const data = (await res.json()) as GitHubUserPayload | ApiErrorBody
  if (!res.ok || 'error' in data) {
    const msg = 'error' in data ? data.error : `Request failed (${res.status})`
    throw new Error(msg)
  }
  const xCache = res.headers.get('x-cache') ?? res.headers.get('X-Cache')
  const serverTimingMs = parseServerTimingMs(res.headers.get('server-timing'))
  return {
    user: data,
    meta: { xCache, serverTimingMs, responseTimeMs },
  }
}
