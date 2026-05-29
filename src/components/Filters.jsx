import { CUISINE_FILTERS, REGIONS } from '../data/restaurants.js'

// Preferences. Defaults already encode the brief; this lets them tighten things
// (stricter FODMAP, a protein, a cuisine, a shorter drive) on a given night.

export default function Filters({ prefs, setPrefs, poolSize }) {
  const toggleArray = (key, value) => {
    setPrefs((p) => {
      const has = p[key].includes(value)
      return { ...p, [key]: has ? p[key].filter((v) => v !== value) : [...p[key], value] }
    })
  }

  return (
    <aside className="filters">
      <div className="filters__row">
        <label className="filters__label" htmlFor="drive">
          Max drive from Georgetown
        </label>
        <div className="filters__drive">
          <input
            id="drive"
            type="range"
            min="10"
            max="60"
            step="5"
            value={prefs.maxDriveMin}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, maxDriveMin: Number(e.target.value) }))
            }
          />
          <span className="filters__driveval">{prefs.maxDriveMin} min</span>
        </div>
      </div>

      <div className="filters__row">
        <span className="filters__label">Price</span>
        <div className="seg">
          {[2, 3].map((p) => (
            <button
              key={p}
              className={`seg__btn ${prefs.prices.includes(p) ? 'seg__btn--on' : ''}`}
              onClick={() => toggleArray('prices', p)}
            >
              {'$'.repeat(p)}
            </button>
          ))}
          <span className="filters__hint">no fast food · no $$$$</span>
        </div>
      </div>

      <div className="filters__row">
        <span className="filters__label">Protein focus</span>
        <div className="seg">
          {[
            ['any', 'Either'],
            ['fish', 'Fish'],
            ['poultry', 'Poultry'],
          ].map(([val, lbl]) => (
            <button
              key={val}
              className={`seg__btn ${prefs.protein === val ? 'seg__btn--on' : ''}`}
              onClick={() => setPrefs((p) => ({ ...p, protein: val }))}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className="filters__row">
        <span className="filters__label">Region</span>
        <div className="seg">
          {REGIONS.map((reg) => (
            <button
              key={reg}
              className={`seg__btn ${prefs.regions.includes(reg) ? 'seg__btn--on' : ''}`}
              onClick={() => toggleArray('regions', reg)}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      <div className="filters__row">
        <label className="filters__check">
          <input
            type="checkbox"
            checked={prefs.strictFodmap}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, strictFodmap: e.target.checked }))
            }
          />
          Strict low-FODMAP only
        </label>
      </div>

      <div className="filters__row">
        <span className="filters__label">Cuisine (optional)</span>
        <div className="cuisines">
          {CUISINE_FILTERS.map((c) => (
            <button
              key={c}
              className={`pill ${prefs.cuisines.includes(c) ? 'pill--on' : ''}`}
              onClick={() => toggleArray('cuisines', c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="filters__pool">
        {poolSize} spot{poolSize === 1 ? '' : 's'} match tonight
      </div>
    </aside>
  )
}
