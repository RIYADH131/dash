# DASH

> The OS of a serious athlete. Rank your strength, speed, and endurance. Compete. Verify. Progress.

Dark, precision-feel mobile app — Bloomberg terminal of fitness. Built mobile-first with Next.js + Tailwind, ready to be wrapped as a real native iOS/Android app via Capacitor.

## Stack

- **Next.js 14** (App Router, RSC where possible, `'use client'` where needed)
- **TypeScript** (strict)
- **Tailwind CSS** with custom design tokens (navy, electric blue, teal, amber)
- **Lexend** + **Inter** + **JetBrains Mono** + Material Symbols Outlined
- **Capacitor** for native iOS/Android shell
- Mobile-first, viewport-locked to phone width with bottom nav + fixed app bar

## Design system (exact tokens)

| Token              | Value                       | Usage                                       |
| ------------------ | --------------------------- | ------------------------------------------- |
| Background         | `#001226`                   | Page background, top bar                    |
| Surface elevated   | `#002A54`                   | All cards, inputs, bottom nav, form bgs     |
| Electric blue      | `#007BFF`                   | Primary CTA, active states, progress bars   |
| Teal accent        | `#2DD4BF`                   | Swimming-only elements                      |
| Amber accent       | `#F59E0B`                   | Running-only elements                       |
| Text primary       | `#E1E3E4`                   | Headings + primary content                  |
| Text muted         | `#94A3B8`                   | Labels, secondary text                      |
| Border             | `rgba(255,255,255,0.1)`     | Cards + inputs                              |

## Screens

1. **Home Dashboard** (`/`) — primary sport rank ring, sport stat pills, bento metrics, **Fuel → Performance** correlation card, recent activity feed
2. **Leaderboard** (`/leaderboard`) — sport segmented control, casual/pro pills, podium, list, floating filter
3. **Challenge Drop** (`/challenge`) — live countdown, requirements, mini live standings
4. **Athlete Profile** (`/profile`) — hero, stats bento, expandable sport breakdown, programs, tier rail, FAB
5. **Rank Calculator** (`/calculator`) — Wilks-style strength score, FINA-style swim points, Riegel-flavored run score, animated tier reveal with delta-to-next-tier
6. **AI Coach** (`/coach`) — branded chat with context summary card, asymmetric bubbles, scrollable prompt chips, send pill

## Pro improvements (on top of the spec)

- **Real rank engine** — bodyweight-adjusted Wilks coefficient, FINA-style cubic falloff, Riegel-flavored run score. See `src/lib/rank.ts`.
- **Tier delta** — calculator returns the *exact* lift increase / time drop needed for the next tier.
- **Live countdown** with the opacity-fade digit transition specified in the brief.
- **Reduced-motion support** + electric-blue focus ring.
- **PWA manifest** — installable to home screen on iOS & Android.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build        # production web build
```

## Native iOS / Android via Capacitor

Capacitor is preconfigured. The static export is the source for the native shells.

```bash
# Build the static export Capacitor will copy from
npm run build:cap

# One-time per machine — add the native shells (require Xcode / Android Studio)
npx cap add ios
npx cap add android

# After every code change
npm run cap:sync          # sync to both platforms
npm run cap:ios           # opens Xcode
npm run cap:android       # opens Android Studio
```

`capacitor.config.ts` ships with:

- `appId`: `com.dash.athlete`
- `appName`: `DASH`
- `webDir`: `out`
- Android background: `#001226` (matches navy theme so there's no flash)
- iOS `contentInset: 'always'` so the safe-area sits above the fixed app bar

The `ios/` and `android/` directories are intentionally **not** committed — generate them on the machine that owns the signing certs.

## Project structure

```
src/
  app/                 — App Router pages (one file per screen)
  components/          — Card, MetricCard, RankRing, Countdown, ...
  lib/
    rank.ts            — Wilks / FINA / Riegel scoring engines
    tiers.ts           — Bronze..Champion thresholds + helpers
    mockData.ts        — Fake leaderboards, activities, challenges
    types.ts           — Sport / Tier / Stroke unions
```

## Notes on data

Everything you see is driven by `src/lib/mockData.ts`. Wire to a backend by replacing those exports (no UI changes needed). For a backend recommendation: Supabase (Postgres + auth + storage for video proof) maps cleanly onto the entry verification flow.
