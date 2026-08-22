# Design system — colors, fonts, the look

The identity is **"The Field Manual"**: warm paper, an editorial serif display,
`§` sections, ruled marginalia, ember as the one rare accent. Light is primary;
dark is the "night edition."

## Colors — `app/tokens.css`
- **The only place raw colors live.** Everything else uses tokens.
- `:root` = light (warm "Bone" paper). `.dark` = night edition.
- Change a color once here and it flows everywhere. Key tokens:
  - `--bg`, `--bg-2`, `--bg-3` — surfaces (paper / raised / inset)
  - `--text-1/2/3` — ink / body / muted
  - `--accent` — ember (deep `#b7410f`-ish in light for AA; bright in dark)
  - `--aws / --azure / --gcp`, `--ok / --warn / --danger`
  - `--code-*` — syntax colors (keep in sync with `lib/shiki-themes.ts`, below)
- **Contrast rule:** any text token must hit **WCAG AA (4.5:1)** on its surface.
  Muted ink (`--text-3`) and the ember are already tuned for the paper.

## Code syntax colors — `lib/shiki-themes.ts`
- Drives the actual code-block coloring. The comment at the top says it must stay
  in sync with `--code-*`. **These colors must pass AA** against the code surface
  (`--bg-3`), because the Shiki background is transparent. If you darken/lighten
  syntax, re-run the a11y check (see [seo.md](./seo.md#accessibility)).

## Fonts — `app/layout.tsx`
- Three faces, self-hosted via `next/font` (no CDN, no layout shift):
  - **Fraunces** (`--font-serif`) — editorial display / headings / release titles.
  - **Instrument Sans** (`--font-sans`) — body.
  - **JetBrains Mono** (`--font-mono`) — labels, code, `§`/`FIG.` furniture.
- To swap a face, change the import + variable here; it's wired into Tailwind in
  `global.css` (`@theme inline`).

## Typography & "furniture" — `app/global.css`
- Prose sizes, headings (serif), the masthead double-rule, `§` marginalia, `FIG.`
  captions, drop caps, registration crosses, the changelog accordion, the emblem
  cursor blink — all here. Search for the section comments.

## The ember rule
Spend ember like it's rare (< ~10% of any screen): link hover/active, the 2px
active rail, focus rings, the primary button, one live accent. Never on card
borders, body text, or big fills at rest.

<a id="product-facts"></a>
## Product facts — `lib/product.ts`
The **single source of truth** for numbers, ports, run modes, install command,
repo URL, license. Update stats **here** (e.g. service counts, latency) and the
whole site follows. Never hard-code these in a component.

## Verify
`npm run build` green; check **both** editions (toggle theme) after any color,
font, or contrast change.
