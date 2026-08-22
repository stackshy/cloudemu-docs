# Writing a blog / Field Notes post

## When
You want to publish a post under `/blog`.

## Where the files are
- **Posts:** `content/blog/<slug>.mdx`
- **Index page:** `app/blog/page.tsx`
- **Post page:** `app/blog/[slug]/page.tsx` (adds BlogPosting JSON-LD + canonical)

## How to add a post
1. Create `content/blog/<slug>.mdx`:
   ```mdx
   ---
   title: Introducing the standalone server
   description: One line for the listing and the SEO snippet (~120–160 chars).
   date: 2026-08-22
   ---

   Your post. Same MDX pipeline as docs — code fences, callouts, etc.
   ```
   - `title`, `description`, `date` (YYYY-MM-DD). Posts sort newest-first by `date`.
2. `npm run build`, check `/blog` and the post page.

## Good to know
- The blog is branded **"Field Notes."** A stale blog reads worse than a small
  one — either keep a light cadence or leave it thin on purpose.
- Headings render in the serif; code + callouts match the docs.

## Verify
- Post shows on `/blog` with its date, and opens at `/blog/<slug>`.
- View source → `BlogPosting` JSON-LD + `rel="canonical"` present.
