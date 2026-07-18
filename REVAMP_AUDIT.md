# REVAMP_AUDIT — cloudemu-docs design revamp (Phase 0)

Baseline: `main` @ 2cc0543 (post PR #9/#10/#11). Stack: Next 16 (App Router), Tailwind v4
(CSS-first), fumadocs-ui/core 16.7, fumadocs-mdx 14.2, framer-motion 12, lucide-react,
next-themes. No `tailwind.config` (v4 `@theme` in CSS). Fonts: **none loaded** — system
stack via fumadocs preset.

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | `app/(home)/page.tsx` + 11 `components/landing/*` | Full landing |
| `/docs/[[...slug]]` | `app/docs/[[...slug]]/page.tsx` | 40 MDX pages (`content/docs/**`) |
| `/blog` | `app/blog/page.tsx` | Card list (hardcoded posts array) |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Hand-rolled markdown renderer (`dangerouslySetInnerHTML`) |
| `/api/search` | `app/api/search/route.ts` | fumadocs search |
| 404 | — | **missing** (`app/not-found.tsx` does not exist) |

## Kill List occurrences (§1 of brief)

1. **Purple/violet gradient headline text**
   - `components/landing/hero.tsx:79-85` — `GradientText` (`from-sky-400 to-violet-500`) on "real cloud SDKs"
   - `components/landing/sdk-compat-section.tsx:92-94` — same gradient on "Repoint them."
   - `components/landing/api-coverage.tsx:113` — `from-blue-400 via-purple-400 to-pink-400` on the stat number
   - `components/logo.tsx:95` — wordmark `from-sky-400 to-violet-500` (brand mark: keep gradient in the ICON, kill it on TEXT)
2. **Multi-color gradient banner**: `app/layout.tsx` — fumadocs `<Banner variant="rainbow">`
3. **Glow orbs**: none (AnimatedBackground is already a dot grid) — but it's per-hero, not the token texture
4. **Mac traffic-light dots**: `sdk-compat-section.tsx:115-118`, `code-example.tsx:88-91`
5. **Emoji as icons**: none in TSX (logo emoji removed earlier); ✓
6. **Default shadcn-ish cards** (`rounded-xl border bg-fd-card`): `feature-cards.tsx`, `service-grid.tsx`, `api-coverage.tsx`, `blog/page.tsx`, comparison table wrapper
7. **8-identical feature cards**: `feature-cards.tsx` (8 × icon+title+2 lines)
8. **Centered hero w/ 2 pills**: hero is 2-col but CTA row is 2 generic pills; no terminal
9. **Inconsistent inline-code chips**: at least 4 variants (`hero.tsx` CodePill, `sdk-compat-section.tsx` inline, `api-coverage.tsx` inline, `blog/[slug]` renderer, fumadocs prose default)
10. **Gradient-border hover cards**: none; hover `shadow-lg` on cards instead (also to remove — depth via borders per §3)

## Hardcoded colors / ad-hoc styling

- Provider hexes scattered: `#FF9900 / #0078D4 / #4285F4` in `sdk-flow-diagram.tsx`, `sdk-compat-section.tsx`, `code-example.tsx`, `service-grid.tsx`; also `@theme` in `global.css` (only place close to a token)
- Tailwind palette classes as semantics: `text-green-500/red-400` (comparison), `text-emerald-400/rose-400/violet-400/orange-*` (`highlighted-go.tsx`), `bg-red-500/yellow-500/green-500` (traffic lights)
- `boxShadow: 0 30px 60px rgba(99,102,241,.2)` indigo glow on the SDK code card
- `blog/[slug]/page.tsx` renderer emits hardcoded utility classes in strings

## Code rendering today

- **Docs MDX**: fumadocs default Shiki (stock `github-*` themes via preset), default fumadocs code chrome. No custom theme, no provider tabs, no diff/focus/highlight usage in any MDX file.
- **Landing**: hand-rolled `highlighted-go.tsx` regex highlighter + `<pre>` (2 tabbed panels with traffic lights); `api-coverage.tsx` inline `<pre>` with purple spans.
- **Terminal commands**: rendered as plain code blocks (`installation.mdx`, `quick-start.mdx`, CTA).
- **ASCII art**: `quick-start.mdx:100-110` "What just happened" flow diagram.

## Content-accuracy findings (fix during revamp)

- `api-coverage.tsx` claims **7/16 SDK-live domains** and "In progress" — stale: cloudemu
  v1.9.0 shipped SDK-compat for **all 16 domains**.
- `quick-start.mdx:165` "remaining 7 domains … Portable API only" — same staleness.
- Comparison table ✓/✗ cells rely on lucide `Check/X` — reported rendering empty; replace
  with mono glyph system regardless.

## Components inventory

`components/logo.tsx` (keep icon, restyle wordmark) · `components/search-dialog.tsx`
(fumadocs parts, restyle) · `components/landing/{animated-background, api-coverage,
code-example, comparison-table, cta-section, feature-cards, hero, highlighted-go,
sdk-compat-section, sdk-flow-diagram, service-grid}.tsx` (all rebuilt in Phase 4) ·
`lib/services.ts` (data — keep, add provider service names to matrix).

## Theming wiring

- `app/global.css`: 9 lines — imports fumadocs `neutral.css` + `preset.css`, 3 provider colors in `@theme`. Everything else is fumadocs defaults.
- Dark mode: class-based via RootProvider (`next-themes`), default `system`.
- No `tokens.css`, no font loading, no reduced-motion handling anywhere, no focus-ring system.

## Plan of record (matches brief §8)

P1 tokens/fonts/primitives → P2 code system (custom Shiki theme + CodeBlock/Terminal +
global provider tabs + tab-morph) → P3 docs shell CSS → P4 landing rebuild → P5 content
passes (installation diff, quick-start steps+packet-flow, chaos timeline, blog, 404) →
P6 QA gate + summary. Deviations recorded in `REVAMP_SUMMARY.md`.
