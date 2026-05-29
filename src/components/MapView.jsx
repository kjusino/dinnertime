import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { GEORGETOWN } from '../lib/geo.js'

// Open-source maps: OpenStreetMap tiles rendered with Leaflet (no API key, no
// proprietary map provider). We plot Georgetown (the anchor) plus tonight's two
// picks, and fit the view to all three.

function makeIcon(color, label) {
  const html = `<div class="pin" style="--pin:${color}"><span>${label}</span></div>`
  return L.divIcon({
    html,
    className: 'pin-wrap',
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  })
}

export default function MapView({ picks, selectedId }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)

  // Init once.
  useEffect(() => {
    if (mapRef.current || !elRef.current) return
    const map = L.map(elRef.current, { scrollWheelZoom: false }).setView(
      [GEORGETOWN.lat, GEORGETOWN.lng],
      11
    )
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
  }, [])

  // Redraw markers when picks/selection change.
  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    layer.clearLayers()

    L.marker([GEORGETOWN.lat, GEORGETOWN.lng], {
      icon: makeIcon('#374151', '🏠'),
    })
      .bindPopup('<b>Home base</b><br/>Georgetown')
      .addTo(layer)

    const pts = [[GEORGETOWN.lat, GEORGETOWN.lng]]
    picks.forEach((r, i) => {
      const isSel = r.id === selectedId
      const color = isSel ? '#2f7d5b' : i === 0 ? '#7b4b3a' : '#b9784f'
      L.marker([r.lat, r.lng], { icon: makeIcon(color, String(i + 1)) })
        .bindPopup(
          `<b>${r.name}</b><br/>${r.area}<br/>~${r.driveMinutes} min · ${'$'.repeat(
            r.price
          )}`
        )
        .addTo(layer)
      pts.push([r.lat, r.lng])
    })

    if (pts.length > 1) {
      map.fitBounds(pts, { padding: [42, 42], maxZoom: 13 })
    }
  }, [picks, selectedId])

  return <div className="map" ref={elRef} aria-label="Map of tonight's picks" />
}
