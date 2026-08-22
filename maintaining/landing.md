# Editing the landing page

## When
Change the hero, the memory-grid section, the coverage stats/ticker, the
run-modes cards, or the colophon.

## How it's built (server + client islands)
`app/(home)/page.tsx` renders `<Home/>`. `components/landing/home.tsx` is a
**server component** — the static shell and all section copy render on the server
(SEO). Only the interactive pieces are client "islands":

| Piece | File | Client? |
|---|---|---|
| Section shells, all copy, run-mode cards, colophon, footer | `home.tsx` | server |
| Hero: collapse canvas, kinetic headline, latency, command dock | `collapse-hero.tsx` | client |
| Memory grid (fills on scroll) | `memory-grid.tsx` | client |
| Scroll-progress bar + count-up stats | `motion.tsx` | client |
| Scroll-reveal wrapper | `reveal.tsx` | client |

**Rule of thumb:** static text/markup goes in `home.tsx` (server). Anything that
needs `useState` / animation / event handlers / canvas is a client island in its
own file. A server component may render a client island, and may **not** pass
functions as props to one (pass strings — that's why `CopyButton` takes a `text`).

Even though the hero is a client island, its `<h1>` still renders in the server
HTML (Next renders client components on the server too), so hero copy appears in
`out/index.html`.

## Common edits
- **Hero words / CTAs / eyebrow:** `collapse-hero.tsx`.
- **Hero commands (the dock chips + toasts):** the `COMMANDS` array in `collapse-hero.tsx`.
- **Section copy / headings (`§ 01…`):** the section components in `home.tsx`.
- **Coverage stats:** driven by `STATS` in `lib/product.ts` via `<CountUp>`.
- **Coverage ticker names:** the `TICKER` array in `home.tsx` (illustrative).
- **Run-mode cards:** `PRODUCT_WAYS` + `WAY_SNIPPETS` in `home.tsx`.
- **Any number/stat:** `lib/product.ts` (never hard-code).
- **Styles / keyframes:** the `.cl-*` "Collapse landing" block in `app/global.css`.

## Responsiveness
The hero flows top-to-bottom below **1024px** (core moves into the band under the
nav; the command dock joins the flow) and uses the centered layout with a
right-side core above it. Check phone / tablet / desktop after layout edits.

## Verify
`npm run build` green; the collapse plays and the command dock works; the site
holds on mobile / tablet / desktop; hero copy appears in `out/index.html`.
