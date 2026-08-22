# Editing the landing page

## When
Change the hero, the live console, the coverage matrix, the behaviors list, the
run-modes switcher, or the colophon.

## How it's built (server + client islands)
`app/(home)/page.tsx` renders `<Home/>`. `components/landing/home.tsx` is a
**server component** — the static shell and section text render on the server.
Only the interactive pieces are client "islands":

| Piece | File | Client? |
|---|---|---|
| Section shell, hero copy, behaviors, colophon, footer | `home.tsx` | server |
| Shared primitives (Leaf, Label, buttons) | `primitives.tsx` | shared |
| Scroll reveal wrapper | `reveal.tsx` | client |
| Hero emblem (memory cloud) | `hero-emblem.tsx` | client |
| Live "try a call" console | `live-console.tsx` | client |
| Coverage matrix (hover-to-focus) | `coverage-plate.tsx` | client |
| Run-mode switcher (tabs) | `run-modes.tsx` | client |

**Rule of thumb:** static text/markup goes in `home.tsx` (server). Anything that
needs `useState` / animation / event handlers is a client island in its own file.
A server component may render a client island, and may **not** pass functions as
props to one (pass strings — that's why `CopyButton` takes a `text` prop).

## Common edits
- **Hero words / CTAs:** `home.tsx` → `Hero()`.
- **A new section:** add a `Leaf`-wrapped block in `home.tsx` and drop it into the
  `Home()` composition. If it's interactive, build it as a client island and
  import it.
- **Section numbers (`§ 1…`)** are the `section=` prop on `<Leaf>`.
- **Coverage rows:** the `COVERAGE` array in `coverage-plate.tsx`.
- **Behaviors:** the `BEHAVIORS` array in `home.tsx`.
- **Run-mode commands:** come from `RUN_MODES` in `lib/product.ts`.
- **Any number/stat:** `lib/product.ts` (never hard-code).

## Verify
`npm run build` green; the landing looks identical in light + dark; the console,
coverage hover, and run-mode tabs still work (they're the client islands).
Hero copy should appear in `out/index.html` (proof it's server-rendered).
