import { useId, type ReactNode } from 'react'
import type { GitHubUserPayload } from '../../lib/api'
import { IconClock, IconExternal, IconFollowing, IconRepos, IconUsers } from './Icons'

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

export type UserPanelProps = {
  user: GitHubUserPayload
  /** Screen-reader / visual label above the handle */
  eyebrow?: string
  /** Extra classes on the article (e.g. centered share variant) */
  className?: string
}

export function UserPanel({ user, eyebrow = 'Resolved identity', className = '' }: UserPanelProps) {
  const reactId = useId()
  const headingId = `profile-heading-${reactId.replace(/:/g, '')}`
  const href = `https://github.com/${encodeURIComponent(user.username)}`

  return (
    <article
      className={['user-panel', className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
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
            <p className="user-panel__eyebrow">{eyebrow}</p>
            <h2 id={headingId} className="user-panel__name">
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
