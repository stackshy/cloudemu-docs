# Updating the changelog (Release Ledger)

## When
The product (`github.com/stackshy/cloudemu`) cut a **new release**, and you want
it on `/changelog`.

## The key idea
The changelog is **not hand-written here** — it mirrors the product's official
**GitHub Releases**. You run one script; it pulls every release and regenerates a
data file. You don't edit release text in this repo.

## Where the files are
- **Importer:** `scripts/import-changelog.mjs` — pulls releases via the `gh` CLI.
- **Generated data:** `lib/changelog.generated.ts` — **do not hand-edit** (it's
  overwritten on every run).
- **Page:** `app/changelog/page.tsx` (header) + `components/changelog/ledger.tsx`
  (the accordion, category chips, pagination).

## How to update
1. Make sure you're logged in to GitHub CLI: `gh auth status`.
2. Run:
   ```bash
   node scripts/import-changelog.mjs
   ```
   It reads the latest releases from the product repo and rewrites
   `lib/changelog.generated.ts`.
3. `npm run build`, eyeball `/changelog`, then commit the regenerated file.

## Good to know
- **Release notes come from the product repo.** If an entry reads badly, fix the
  release notes on the product's GitHub Release, then re-run the script.
- Each release is an **accordion**: summary (version · date · tag · title · one
  line) that drops down to the full notes; the newest opens by default.
- **Pagination:** shows the 10 most recent, with "Show earlier releases".
- **`<details>` "technical details"** in a release render as nested collapsibles.
- Section headings get a **category dot** by keyword (Features→ember,
  Enhancements→indigo, Fixes→green, Removed→red) — see the `CAT` list in
  `ledger.tsx` if you need to add a keyword.
- Point the importer at a different repo with `--repo owner/name`.

## Verify
- `/changelog` shows the new release at the top.
- The `tag` chip and `notes ↗` link point to the right GitHub release.
