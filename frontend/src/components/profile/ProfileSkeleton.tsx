export function ProfileSkeleton() {
  return (
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
  )
}
