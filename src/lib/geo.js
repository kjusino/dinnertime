// Geographic helpers. We compute drive-time estimates from a single anchor
// (the Georgetown neighborhood) using straight-line distance scaled by a metro
// road-factor. These are ESTIMATES, not routed times — good enough to rank
// "near vs far" and to enforce the 1-hour rule.

export const GEORGETOWN = { lat: 38.9076, lng: -77.0723, label: 'Georgetown, DC' }

const R_MILES = 3958.8

export function haversineMiles(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R_MILES * Math.asin(Math.sqrt(h))
}

// Estimate driving minutes from Georgetown. Metro road network adds overhead vs
// crow-flies; ~1.6 min/mile + a 5 min baseline tracks reasonably for the DMV.
export function estimateDriveMinutes(point) {
  const miles = haversineMiles(GEORGETOWN, point)
  return Math.round(miles * 1.6 + 5)
}

export function milesFromGeorgetown(point) {
  return haversineMiles(GEORGETOWN, point)
}
