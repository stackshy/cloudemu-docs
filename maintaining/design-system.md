# Design system — colors, fonts, the look

The identity is **"Collapse"**: the whole public cloud condensed into an
in-memory core. A single warm **Bone** stage (the logo's paper), ink type, and
**ember** as the heat of the collapse. Motion — not decoration — carries the
personality. **One theme only** (no light/dark toggle).

## Colors — `app/tokens.css`
- **The only place raw colors live.** Everything else uses tokens.
- Single `:root` palette (no `.dark`). Change a color once here and it flows
  everywhere. Key tokens:
  - `--bg`, `--bg-2`, `--bg-3` — surfaces (Bone stage / paper cards / inset)
  - `--text-1/2/3` — ink / body / muted
  - `--accent` — **Ember Deep** (`#c2440d`), holds AA on Bone for links + small text
  - `--ember` — **Ember Bright** (`#ff5a1f`), large display words + decorative heat only
  - `--viz-aws / --viz-azure / --viz-gcp` — decorative canvas + memory grid (never text)
  - `--aws / --azure / --gcp`, `--ok / --warn / --danger`
  - `--code-*` — syntax colors (keep in sync with `lib/shiki-themes.ts`, below)
- **Contrast rule:** any text token must hit **WCAG AA (4.5:1)** on its surface.
  Use `--accent` (deep) for text; `--ember` (bright) only for large display or
  non-text decoration.

## Code syntax colors — `lib/shiki-themes.ts`
- Drives the actual code-block coloring; must stay in sync with `--code-*` and
  **pass AA** against the code surface (`--bg-3`). If you retune syntax, re-run
  the a11y check (see [seo.md](./seo.md#accessibility)).

## Fonts — `app/layout.tsx`
- Three faces, self-hosted via `next/font` (no CDN, no layout shift):
  - **Bricolage Grotesque** (`--font-display`, also aliased to `--font-serif`) —
    the display voice: kinetic headlines, section + page titles, release titles.
  - **Instrument Sans** (`--font-sans`) — body.
  - **JetBrains Mono** (`--font-mono`) — labels, code, `§` furniture, data readouts.
- To swap a face, change the import + variable here; it's wired into Tailwind in
  `global.css` (`@theme inline`).

## Motion
- **Hero** (`components/landing/collapse-hero.tsx`) — a canvas island: the cloud
  scatters, collapses into a core, latency snaps to ~9 ms; cursor-reactive; the
  loop pauses when scrolled off-screen. Run-a-command flings resources in.
- **Section reveals / count-ups / grid / ticker** — `motion.tsx`, `memory-grid.tsx`,
  `reveal.tsx`, and the `.cl-*` keyframes in `global.css`.
- **Docs** get only a quiet fade-up on load (`cl-doc-in`).
- Everything is gated by `prefers-reduced-motion` — reduced motion lands straight
  on the settled state with no animation.

## The ember rule
Spend ember like it's rare. Deep ember for links / small accents; bright ember for
the one big display word per view and the collapse heat. Never on card borders,
body text, or big flat fills at rest.

<a id="product-facts"></a>
## Product facts — `lib/product.ts`
The **single source of truth** for numbers, ports, run modes, install command,
repo URL, license. Update stats **here** (service counts, latency) and the whole
site follows. Never hard-code these in a component.

## Verify
`npm run build` green; run the a11y check (zero color-contrast violations); check
mobile / tablet / desktop after any color, font, or layout change.
