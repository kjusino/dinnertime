# 🍽️ DinnerTime

A two-tap dinner decider for the DMV, built for the wedding countdown. You don't
choose *what* to eat — the app hands you **two** vetted options each night, you
pick one, and it walks you to a reservation in your **6:30–8:30 PM** window.

Live: **https://kjusino.github.io/dinnertime/**

## The criteria, baked in

Every option that surfaces already passes all of these:

- 🫒 **Mediterranean-leaning** — fish, poultry, olive oil, vegetables, whole grains.
- 🚫🧅 **Low-FODMAP-friendly ordering** — for Genesis's allergy set. Each card has a
  per-restaurant note for what to order (and what to skip — usually onion/garlic
  sauces, chickpea dips, and bread).
- 🐟🍗 **Fish & poultry forward** — at least one lean grilled option, every time.
- 💲 **$$–$$$ only** — never fast food, never $$$$.
- 📍 **≤ 1 hour from Georgetown** — the whole DMV is fair game, but nearer spots
  are ranked higher.
- 🏋️ **Cut-friendly tips** — a one-liner per spot for staying on track for the dress
  and the 30-lb goal.

## How it works

- **Maps & geography:** [OpenStreetMap](https://www.openstreetmap.org/copyright)
  tiles via Leaflet — fully open source, no API keys. Drive times are estimated
  from straight-line distance to Georgetown scaled by a metro road factor.
- **The two picks** are chosen by a seeded, weighted sampler so they stay stable
  for the day (refreshing won't change them) until you hit **"Not feeling
  these."** Weighting favors nearer + more Mediterranean + more FODMAP-friendly.
- **Reservations:** availability shown is a deterministic estimate that always
  keeps at least one slot open inside your 6:30–8:30 window. The **Reserve**
  button then hands off to the restaurant's real booking page — that page is the
  source of truth, not this app.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173/dinnertime/
npm run build    # outputs to dist/
```

## Deploy

Pushing to the deploy branch runs `.github/workflows/deploy.yml`, which builds
with Vite and publishes `dist/` to GitHub Pages. In the repo, set **Settings →
Pages → Source → GitHub Actions** once to enable it.

## Adding restaurants

Everything lives in [`src/data/restaurants.js`](src/data/restaurants.js). Add an
entry with coordinates, `price` (2 or 3), `tags`, `medScore`, a `fodmap` rating,
a `fodmapNote`, signature lean dishes, and a `weightTip`. Drive time and
fish/poultry flags are computed automatically.
