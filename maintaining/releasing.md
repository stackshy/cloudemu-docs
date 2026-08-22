# Build, branch & release flow

## Local
```bash
npm run dev      # dev server at http://localhost:3000 (or -p 3210)
npm run build    # static export to out/  — must be GREEN before any PR
```
Everything is a **static export** (`output: 'export'`); `out/` is what deploys.
The live site is https://cloudemu.info/.

## Branching
- **`development` is the mainline / default branch.** `main` is the stable branch
  it's promoted to.
- **Never commit straight to `development` or `main`.** Always branch:
  ```bash
  git checkout development && git pull origin development
  git checkout -b docs/<short-description>
  ```
- **Open PRs against `development`** (never `main`). Promote to `main` with a
  `development → main` PR when you want to cut the site live.

## Commits
- **One file per commit** for docs work (crisp, reviewable history).
- Stage files **by name** — never `git add -A` / `git add .`.
- Commit as **Nitin Kumar `<nitinraj844126@gmail.com>`**. No AI attribution in
  commits or PR descriptions.
- Ask before any remote op (push, PR, merge).

## PR screenshots (optional, for visual changes)
The repo is public, so screenshots embed via raw URLs. Pattern used so far:
capture with Playwright, push the PNGs to a **separate, non-merged** branch
(e.g. `pr-media-<topic>`), and reference
`https://raw.githubusercontent.com/stackshy/cloudemu-docs/pr-media-<topic>/pr-media/<file>.png`
in the PR body — keeps `development`/`main` clean of binaries.

## Regenerating derived files before a release
- **Changelog:** `node scripts/import-changelog.mjs` (see [changelog.md](./changelog.md)).

## Final checklist before merging a PR
- [ ] `npm run build` green (note the route count).
- [ ] Looks right in **light and night** editions.
- [ ] New pages appear in the sidebar/nav and in `out/sitemap.xml`.
- [ ] No new axe colour-contrast violations (see [seo.md](./seo.md#accessibility)).
- [ ] Numbers came from `lib/product.ts`, not hard-coded.
