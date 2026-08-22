# Maintaining cloudemu-docs

Plain-language notes on **where to change things** in this site, so updates are
quick and nothing gets missed. This folder is for maintainers — it is **not**
published to the website.

If you're about to change something, find it in the table below and open the
linked file. Each file says *when* to use it, *which files* to touch, *how*, and
*how to verify*.

## I want to…

| Task | Guide |
|---|---|
| Add or edit a **documentation page** | [docs-pages.md](./docs-pages.md) |
| Update the **changelog** after a product release | [changelog.md](./changelog.md) |
| Write a **blog** post | [blog.md](./blog.md) |
| Add or reorder a **nav link** | [navigation.md](./navigation.md) |
| Change **colors, fonts, or the look** | [design-system.md](./design-system.md) |
| Edit the **landing page** (hero, memory grid, coverage, run-modes) | [landing.md](./landing.md) |
| Update **SEO** (sitemap, robots, schema, OG images, llms.txt) | [seo.md](./seo.md) |
| Change **product numbers** (services, ports, latency) | [design-system.md](./design-system.md#product-facts) |
| **Release / branch / PR** flow | [releasing.md](./releasing.md) |

## The 60-second repo map

```
app/                     Next.js routes (App Router, static export)
  (home)/                the landing (/)
  docs/                  the docs shell (/docs/**)
  blog/                  blog (/blog, /blog/[slug])
  changelog/             the Release Ledger (/changelog)
  layout.tsx             <html>, fonts, site metadata, site-wide JSON-LD
  tokens.css             ALL colors/surfaces (one source of truth)
  global.css             typography + component styling (Collapse landing, docs)
  sitemap.ts robots.ts   SEO route files
  opengraph-image.tsx    social card (per-section ones live under each route)
  llms.txt/route.ts      curated docs map for AI assistants
components/
  landing/               the landing sections + interactive islands
  docs/                  callout, figure (FIG. plates), prev-next, heading
  code/                  code block (pre.tsx) + copy button
  changelog/             the Release Ledger renderer
  seo/                   JsonLd component
content/
  docs/                  the documentation pages (.mdx) + meta.json (nav order)
  blog/                  blog posts (.mdx)
lib/
  product.ts             product facts: numbers, ports, run modes  ← single source
  seo.ts                 schema.org builders + SITE_URL
  og.tsx                 shared Open Graph card
  source.ts              wires the MDX collections
  changelog.generated.ts release data (GENERATED — don't hand-edit)
  shiki-themes.ts        code syntax colors (must pass AA)
scripts/
  import-changelog.mjs   pulls product GitHub Releases into the changelog
```

## Conventions that are easy to forget

- **`development` is the mainline** (there is no long-lived feature default other
  than it). PRs base **`development`**, never `main`. See [releasing.md](./releasing.md).
- **`lib/product.ts` is the single source of truth** for stats/ports/run-modes.
  Never hard-code a number in a component — read it from there.
- **`app/tokens.css` is the only place raw colors live.** Components use tokens
  (`text-ink`, `bg-surface`, `text-accent`, …), never hex.
- **Spend ember sparingly** (< ~10% of a screen): links on hover, the active
  rail, focus rings, the primary button, one live accent. Not on big fills.
- **Everything is a static export** (`output: 'export'`). No server at runtime —
  route handlers/OG/sitemap are generated at **build** time, so they must be
  `force-static` and must not read the request.
- After any change: `npm run build` must be green, and re-check both the **light**
  and **night** editions.
