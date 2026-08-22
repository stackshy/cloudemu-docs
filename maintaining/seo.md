# SEO, social, and AI discoverability

Most of this is **automatic** — add a page and it flows into the sitemap, gets a
canonical, and shares the site schema. Here's where each piece lives if you ever
need to touch it.

## Site URL
`lib/seo.ts` → `SITE_URL` (`https://cloudemu.info`) and `app/layout.tsx` →
`metadataBase`. If the domain changes, update **both**.

## Sitemap — `app/sitemap.ts`
Generates `/sitemap.xml` from docs + blog pages + static routes. **New pages are
picked up automatically** (it reads `source.getPages()` / `blogSource`). Only
edit if you add a whole new route type.

## robots — `app/robots.ts`
Allow-all + `Sitemap:` + `Host:`. Rarely changes.

## Structured data (JSON-LD) — `lib/seo.ts` + `components/seo/json-ld.tsx`
Builders live in `lib/seo.ts`; the `<JsonLd/>` component renders them.
- Site-wide **Organization + WebSite** → `app/layout.tsx`.
- **SoftwareApplication** → `app/(home)/page.tsx`.
- **TechArticle + BreadcrumbList** → `app/docs/[[...slug]]/page.tsx`.
- **BlogPosting** → `app/blog/[slug]/page.tsx`.
To add a new schema (e.g. FAQPage), add a builder in `lib/seo.ts` and render it
with `<JsonLd data={…}/>` on the relevant page.

## Canonical URLs
Set per page via `alternates.canonical` in each page's metadata / `generateMetadata`
(home, docs, blog index + posts, changelog). Add it to any new route.

## Open Graph / social cards
- Shared card: `lib/og.tsx` (`ogCard('<Section>')`).
- Per section: `app/opengraph-image.tsx` (home), `app/docs/opengraph-image.tsx`,
  `app/blog/opengraph-image.tsx`, `app/changelog/opengraph-image.tsx`.
- These use **Satori** — every element needs `display:flex` if it has >1 child,
  and no `double` borders. Keep new cards simple.

## llms.txt — `app/llms.txt/route.ts`
A curated map of the docs for AI coding assistants. Auto-lists every docs page;
edit the intro text if the pitch changes.

<a id="accessibility"></a>
## Accessibility check
Run an axe pass whenever you change colors, code themes, or interactive UI:
```bash
# with the built site served locally (npx serve out -l 3212)
# a tiny script using @axe-core/playwright over /, /docs/quick-start, /changelog, /blog
```
Target **0 colour-contrast violations**. Known residual: a `list` flag from the
fumadocs nav markup (upstream, not ours).

## Verify (after build)
```
out/sitemap.xml  out/robots.txt  out/llms.txt   exist
view-source on a page → application/ld+json + rel="canonical"
og:image points to /(section/)opengraph-image
```
