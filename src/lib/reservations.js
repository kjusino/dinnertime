import { hashString, makeRng } from './random.js'

// The dinner window the couple cares about: 6:30 - 8:30 PM.
export const WINDOW_START_MIN = 18 * 60 + 30 // 18:30
export const WINDOW_END_MIN = 20 * 60 + 30 // 20:30

// Full bookable range we display slots across (5:30 - 9:00 PM, every 15 min).
const RANGE_START_MIN = 17 * 60 + 30
const RANGE_END_MIN = 21 * 60
const STEP_MIN = 15

function fmt(min) {
  let h = Math.floor(min / 60)
  const m = min % 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  if (h > 12) h -= 12
  if (h === 0) h = 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

export function inWindow(min) {
  return min >= WINDOW_START_MIN && min <= WINDOW_END_MIN
}

// Deterministic availability for a restaurant on a given date. We GUARANTEE at
// least one open slot inside the 6:30-8:30 window so any presented option can
// always be reserved in-window, matching the couple's hard requirement.
export function getAvailability(restaurant, dateKey) {
  const rng = makeRng(hashString(`${restaurant.id}|${dateKey}`))
  const slots = []
  for (let t = RANGE_START_MIN; t <= RANGE_END_MIN; t += STEP_MIN) {
    // Popular / pricier spots are a touch tighter; ~55-80% open.
    const openChance = 0.78 - (restaurant.price - 2) * 0.12
    slots.push({
      minutes: t,
      label: fmt(t),
      inWindow: inWindow(t),
      available: rng() < openChance,
    })
  }

  // Guarantee: ensure at least one available slot inside the window.
  const windowSlots = slots.filter((s) => s.inWindow)
  if (!windowSlots.some((s) => s.available)) {
    // Open a stable in-window slot (deterministic pick).
    const idx = Math.floor(rng() * windowSlots.length)
    windowSlots[idx].available = true
  }

  return slots
}

export function firstWindowSlot(slots) {
  return slots.find((s) => s.inWindow && s.available) || null
}

// Build a best-effort booking deep link. If the restaurant ships its own
// reservation URL we use it; otherwise we hand off to an OpenTable search so the
// user lands one click from booking. This is a HANDOFF, not a live booking.
export function bookingLink(restaurant) {
  if (restaurant.bookingUrl) return restaurant.bookingUrl
  const q = encodeURIComponent(`${restaurant.name} ${restaurant.area}`)
  return `https://www.opentable.com/s?term=${q}`
}
