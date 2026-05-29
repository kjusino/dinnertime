import { useMemo, useState } from 'react'
import { DEFAULT_PREFS, pickTwo } from './lib/picker.js'
import { todayKey } from './lib/random.js'
import Filters from './components/Filters.jsx'
import RestaurantCard from './components/RestaurantCard.jsx'
import MapView from './components/MapView.jsx'
import ReservationModal from './components/ReservationModal.jsx'

export default function App() {
  const dateKey = todayKey()
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [shuffle, setShuffle] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { picks, poolSize } = useMemo(
    () => pickTwo(prefs, dateKey, shuffle),
    [prefs, dateKey, shuffle]
  )

  const selected = picks.find((r) => r.id === selectedId) || null

  const prettyDate = new Date(dateKey + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const reshuffle = () => {
    setSelectedId(null)
    setModalOpen(false)
    setShuffle((s) => s + 1)
  }

  const choose = (r) => {
    setSelectedId(r.id)
    setModalOpen(true)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand__mark">🍽️</span>
          <div>
            <h1>DinnerTime</h1>
            <p>Two picks, zero decisions — {prettyDate}</p>
          </div>
        </div>
        <div className="topbar__criteria">
          Mediterranean · low-FODMAP · fish &amp; poultry · $$–$$$ · ≤1 hr from
          Georgetown
        </div>
      </header>

      <main className="layout">
        <section className="picks">
          <div className="picks__head">
            <h2>Tonight, you’re choosing between two</h2>
            <button className="btn btn--ghost" onClick={reshuffle}>
              ↻ Not feeling these
            </button>
          </div>

          {picks.length === 0 && (
            <div className="empty">
              No spots match these filters tonight. Try widening the drive time,
              adding a region, or turning off strict FODMAP.
            </div>
          )}

          <div className="cards">
            {picks.map((r, i) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                index={i}
                dateKey={dateKey}
                selected={selectedId === r.id}
                onSelect={choose}
              />
            ))}
          </div>

          {selected && !modalOpen && (
            <div className="confirmbar">
              <span>
                Locked in: <strong>{selected.name}</strong>
              </span>
              <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
                See reservation times →
              </button>
            </div>
          )}
        </section>

        <section className="side">
          <MapView picks={picks} selectedId={selectedId} />
          <Filters prefs={prefs} setPrefs={setPrefs} poolSize={poolSize} />
        </section>
      </main>

      <footer className="footer">
        <p>
          Built for the wedding countdown 💍 · {poolSize} eligible DMV spots ·
          Maps &amp; data via{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
          . Availability is an estimate to help you decide — confirm on the
          restaurant’s booking page.
        </p>
      </footer>

      {modalOpen && selected && (
        <ReservationModal
          restaurant={selected}
          dateKey={dateKey}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
