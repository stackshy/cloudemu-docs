<p align="center">
  <h1 align="center">cloudemu docs</h1>
  <p align="center"><b>Documentation website for <a href="https://github.com/stackshy/cloudemu">cloudemu</a></b></p>
</p>

<p align="center">
  <a href="https://cloudemu.vercel.app"><img src="https://img.shields.io/badge/live-cloudemu.vercel.app-blueviolet" alt="Live Site"></a>
  <a href="https://github.com/stackshy/cloudemu"><img src="https://img.shields.io/badge/library-stackshy/cloudemu-blue" alt="Library"></a>
  <a href="https://github.com/stackshy/cloudemu-docs/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

---

The official documentation site for [cloudemu](https://github.com/stackshy/cloudemu) — a Go library that emulates AWS, Azure, and GCP cloud services entirely in memory.

**Live at [cloudemu.vercel.app](https://cloudemu.vercel.app)**

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Fumadocs](https://fumadocs.vercel.app/) (documentation framework)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vercel](https://vercel.com/) (hosting)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (home)/          → Landing page
  docs/            → Documentation pages
  blog/            → Blog section
  api/search/      → Full-text search API
components/
  landing/         → Landing page components
  search-dialog.tsx→ Custom search with empty state
content/
  docs/            → MDX documentation (32 pages)
  blog/            → Blog posts
lib/
  source.ts        → Fumadocs content source
  services.ts      → Service mapping data (16 categories × 3 providers)
```

## What's Included

- Landing page with hero, comparison table, feature cards, service grid, and code examples
- Full documentation for all 16 service categories across AWS, Azure, and GCP
- Getting started guide (prerequisites, installation, quick start)
- Configuration, error handling, and architecture reference
- Cross-cutting features guide (recording, metrics, rate limiting, error injection, fake clock, latency)
- Blog section
- Full-text search (Cmd+K / Ctrl+K)
- Dark and light mode

## Build

```bash
npm run build
```

## License

MIT
