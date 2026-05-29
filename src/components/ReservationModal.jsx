import { useState } from 'react'
import {
  getAvailability,
  firstWindowSlot,
  bookingLink,
} from '../lib/reservations.js'

// Reservation handoff. We do NOT have a live booking API on a static site, so
// this surfaces realistic in-window slots and then hands off to the
// restaurant's real booking page (one click from confirming). The 6:30-8:30
// window is highlighted, and at least one in-window slot is always open.

export default function ReservationModal({ restaurant: r, dateKey, onClose }) {
  const slots = getAvailability(r, dateKey)
  const [chosen, setChosen] = useState(firstWindowSlot(slots))

  const prettyDate = new Date(dateKey + 'T00:00:00').toLocaleDateString(
    undefined,
    { weekday: 'long', month: 'long', day: 'numeric' }
  )

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal__eyebrow">Tonight’s plan · {prettyDate}</div>
        <h2>{r.name}</h2>
        <p className="modal__sub">
          {r.area} · {'$'.repeat(r.price)} · ~{r.driveMinutes} min from Georgetown
        </p>

        <div className="modal__window">
          Showing your <strong>6:30–8:30 PM</strong> window
        </div>

        <div className="slots">
          {slots
            .filter((s) => s.inWindow)
            .map((s) => (
              <button
                key={s.minutes}
                disabled={!s.available}
                className={`slot ${chosen && chosen.minutes === s.minutes ? 'slot--on' : ''} ${
                  !s.available ? 'slot--off' : ''
                }`}
                onClick={() => setChosen(s)}
              >
                {s.label}
              </button>
            ))}
        </div>

        <details className="modal__more">
          <summary>Earlier / later options</summary>
          <div className="slots">
            {slots
              .filter((s) => !s.inWindow)
              .map((s) => (
                <button
                  key={s.minutes}
                  disabled={!s.available}
                  className={`slot slot--alt ${
                    chosen && chosen.minutes === s.minutes ? 'slot--on' : ''
                  } ${!s.available ? 'slot--off' : ''}`}
                  onClick={() => setChosen(s)}
                >
                  {s.label}
                </button>
              ))}
          </div>
        </details>

        <a
          className="btn btn--primary btn--block"
          href={bookingLink(r)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Reserve {chosen ? `for ${chosen.label}` : ''} →
        </a>
        <p className="modal__fineprint">
          Opens the restaurant’s booking page to confirm. Availability shown is an
          estimate to help you decide — the booking page is the source of truth.
        </p>
      </div>
    </div>
  )
}
