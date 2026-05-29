import { getAvailability, firstWindowSlot } from '../lib/reservations.js'

const FODMAP_LABEL = {
  friendly: 'FODMAP-friendly',
  moderate: 'FODMAP: order with care',
}

export default function RestaurantCard({
  restaurant: r,
  index,
  dateKey,
  selected,
  onSelect,
}) {
  const slots = getAvailability(r, dateKey)
  const firstSlot = firstWindowSlot(slots)

  return (
    <article className={`card ${selected ? 'card--selected' : ''}`}>
      <div className="card__rank">Option {index + 1}</div>
      <header className="card__head">
        <h3>{r.name}</h3>
        <div className="card__meta">
          <span className="chip chip--area">{r.area}</span>
          <span className="chip">{'$'.repeat(r.price)}</span>
          <span className="chip">~{r.driveMinutes} min drive</span>
          <span className="chip chip--cuisine">{r.cuisine}</span>
        </div>
      </header>

      <ul className="card__tags">
        {r.medScore >= 3 && <li className="tag tag--med">Mediterranean ★</li>}
        {r.medScore === 2 && <li className="tag tag--med">Mediterranean</li>}
        <li className={`tag tag--${r.fodmap}`}>{FODMAP_LABEL[r.fodmap]}</li>
        {r.hasFish && <li className="tag tag--fish">Fish</li>}
        {r.hasPoultry && <li className="tag tag--poultry">Poultry</li>}
      </ul>

      <div className="card__section">
        <div className="card__label">Lean picks here</div>
        <p>{r.signature.join(' · ')}</p>
      </div>

      <div className="card__section">
        <div className="card__label">FODMAP note for Genesis</div>
        <p>{r.fodmapNote}</p>
      </div>

      <div className="card__section card__section--tip">
        <div className="card__label">Cut tip</div>
        <p>{r.weightTip}</p>
      </div>

      <footer className="card__foot">
        <div className="card__slot">
          {firstSlot ? (
            <>
              <span className="dot dot--open" /> Table around{' '}
              <strong>{firstSlot.label}</strong>
            </>
          ) : (
            <>
              <span className="dot dot--full" /> Call for tonight
            </>
          )}
        </div>
        <button
          className="btn btn--primary"
          onClick={() => onSelect(r)}
          aria-pressed={selected}
        >
          {selected ? 'Selected ✓' : 'We’ll have this'}
        </button>
      </footer>
    </article>
  )
}
