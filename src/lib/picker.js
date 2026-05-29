import { RESTAURANTS } from '../data/restaurants.js'
import { estimateDriveMinutes, milesFromGeorgetown } from './geo.js'
import { hashString, makeRng } from './random.js'

// Default preferences encode the couple's brief directly.
export const DEFAULT_PREFS = {
  maxDriveMin: 60, // up to 1 hour from Georgetown
  prices: [2, 3], // $$ and $$$ only -- never fast food, never $$$$
  cuisines: [], // empty = all eligible cuisines
  regions: ['DC', 'VA', 'MD'],
  strictFodmap: false, // when true, only 'friendly' spots (stricter for Genesis)
  protein: 'any', // 'any' | 'fish' | 'poultry'
}

function hasFish(r) {
  if (r.tags.includes('Seafood')) return true
  return r.signature.some((s) => /fish|salmon|trout|branzino|sea bass|scallop|shrimp|oyster|rockfish|mussel|ceviche|dorade|crudo|catch/i.test(s))
}

function hasPoultry(r) {
  return r.signature.some((s) => /chicken|poultry|souvlaki|farrouj|brasa/i.test(s))
}

// Attach computed fields used across the app.
export function enrich(r) {
  return {
    ...r,
    driveMinutes: estimateDriveMinutes(r),
    miles: Math.round(milesFromGeorgetown(r) * 10) / 10,
    hasFish: hasFish(r),
    hasPoultry: hasPoultry(r),
  }
}

export const ALL_ENRICHED = RESTAURANTS.map(enrich)

export function filterRestaurants(prefs = DEFAULT_PREFS) {
  return ALL_ENRICHED.filter((r) => {
    if (r.driveMinutes > prefs.maxDriveMin) return false
    if (!prefs.prices.includes(r.price)) return false
    if (!prefs.regions.includes(r.region)) return false
    if (prefs.strictFodmap && r.fodmap !== 'friendly') return false
    if (prefs.cuisines.length && !prefs.cuisines.some((c) => r.tags.includes(c)))
      return false
    if (prefs.protein === 'fish' && !r.hasFish) return false
    if (prefs.protein === 'poultry' && !r.hasPoultry) return false
    return true
  })
}

// A "fit score" that nudges nearer + more Mediterranean + more FODMAP-friendly
// spots higher, while still leaving room for variety.
function fitScore(r) {
  const proximity = Math.max(0, (60 - r.driveMinutes) / 60) * 3 // 0..3
  const med = r.medScore * 2 // 2..6
  const fod = r.fodmap === 'friendly' ? 2 : 0.6
  return med + proximity + fod
}

// Weighted sampling without replacement, driven by a seeded RNG so the result
// is stable for a given seed (e.g. the date) and only changes on reshuffle.
function weightedSampleTwo(pool, rng) {
  const items = pool.map((r) => ({ r, w: fitScore(r) }))
  const picks = []
  for (let n = 0; n < 2 && items.length; n++) {
    const total = items.reduce((s, it) => s + it.w, 0)
    let roll = rng() * total
    let idx = 0
    for (; idx < items.length; idx++) {
      roll -= items[idx].w
      if (roll <= 0) break
    }
    if (idx >= items.length) idx = items.length - 1
    picks.push(items[idx].r)
    items.splice(idx, 1)
  }
  return picks
}

// The core: present exactly two options that pass every filter.
// `seedKey` keeps tonight's two picks stable; bump `shuffle` to get a new pair.
export function pickTwo(prefs, seedKey, shuffle = 0) {
  const pool = filterRestaurants(prefs)
  if (pool.length === 0) return { picks: [], poolSize: 0 }
  if (pool.length === 1) return { picks: pool.slice(), poolSize: 1 }
  const rng = makeRng(hashString(`${seedKey}|${shuffle}`))
  return { picks: weightedSampleTwo(pool, rng), poolSize: pool.length }
}
