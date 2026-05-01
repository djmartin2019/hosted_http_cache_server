export type GitHubUserPayload = {
  username: string
  avatar_url: string
  followers: number
  following: number
  public_repos: number
  creation_date: string
}

export type ApiErrorBody = { error: string }

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
