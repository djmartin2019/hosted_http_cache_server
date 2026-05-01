import { useEffect } from 'react'
import type { GitHubUserPayload } from '../lib/api'

const ATTR = 'data-share-meta'

/** Sets document title and OG/twitter meta tags for the current profile (SPA best-effort). */
export function useSharePageMeta(user: GitHubUserPayload | null) {
  useEffect(() => {
    if (!user) return

    const title = `@${user.username} · GitHub card`
    const description = `${user.public_repos} public repos · ${user.followers} followers on GitHub`
    const ogImage = `${window.location.origin}/og/${encodeURIComponent(user.username)}.png`
    const canonical = `${window.location.origin}/u/${encodeURIComponent(user.username)}`
    const prevTitle = document.title
    document.title = title

    const head = document.head
    const addMeta = (attr: 'property' | 'name', key: string, content: string) => {
      const el = document.createElement('meta')
      el.setAttribute(attr, key)
      el.setAttribute('content', content)
      el.setAttribute(ATTR, '')
      head.appendChild(el)
    }

    addMeta('property', 'og:title', title)
    addMeta('property', 'og:description', description)
    addMeta('property', 'og:image', ogImage)
    addMeta('property', 'og:image:width', '1200')
    addMeta('property', 'og:image:height', '630')
    addMeta('property', 'og:url', canonical)
    addMeta('property', 'og:type', 'profile')
    addMeta('name', 'twitter:card', 'summary_large_image')
    addMeta('name', 'twitter:title', title)
    addMeta('name', 'twitter:description', description)
    addMeta('name', 'twitter:image', ogImage)
    addMeta('name', 'description', description)

    return () => {
      document.title = prevTitle
      document.querySelectorAll(`meta[${ATTR}]`).forEach((el) => el.remove())
    }
  }, [user])
}
