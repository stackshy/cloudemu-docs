# Adding or editing a documentation page

## When
You want a new page under `/docs/**`, or to edit an existing one.

## Where the files are
- **Content:** `content/docs/<name>.mdx` (or `content/docs/<folder>/<name>.mdx`).
- **Nav order & groups:** `content/docs/meta.json` (and a `meta.json` inside any
  sub-folder, e.g. `content/docs/services/meta.json`).
- **How a page renders:** `app/docs/[[...slug]]/page.tsx` (chapter opener, TOC,
  FIG. diagram plates, JSON-LD). You rarely need to touch this.

## How to add a page
1. Create the file, e.g. `content/docs/caching.mdx`, with frontmatter:
   ```mdx
   ---
   title: Caching
   description: In-memory caches modelled on ElastiCache, Azure Cache, and Memorystore, driven with the real SDKs.
   ---

   Your markdown here.
   ```
   - `title` and `description` are **required** (description also becomes the SEO
     meta description — aim for ~120–160 characters, benefit-led).
   - **Service pages** may add provider chips: `aws:`, `azure:`, `gcp:` frontmatter
     (rendered under the title).
2. Add the page id to the nav in `content/docs/meta.json` in the order you want.
   Use `"---Group name---"` separators to start a new sidebar group.
3. Write the body. Available components (no import needed — mapped in `page.tsx`):
   - `<Callout type="warn">…</Callout>` (types: info/tip/warn/error/success)
   - Provider tabs: `<ProviderTabs><ProviderTab>…</ProviderTab></ProviderTabs>`
   - Diagrams (auto-wrapped as **FIG.** plates): `<RequestFlow/>`, `<WireProtocols/>`,
     `<ServePorts/>`, `<TopologyGraph/>`, `<ChaosTimeline/>`, `<PortableFlow/>`,
     `<PacketFlow/>`, `<FeatureGlyph kind="…" label="…"/>`.
   - Code fences get the warm Shiki theme + copy button automatically. Add
     `// [!code focus]` to a line to highlight it.

## What you get for free
- Chapter opener (`§ Documentation` + display title), `§` breadcrumb,
  previous/next pagination, TechArticle + BreadcrumbList JSON-LD,
  a canonical URL, and a sitemap entry — all automatic.

## Verify
- `npm run build` green.
- The page appears in the sidebar in the right group/order.
- Its diagram (if any) shows a `FIG.` caption.
- New URL is in `out/sitemap.xml` after build.
