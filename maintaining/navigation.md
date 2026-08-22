# Nav links

## When
Add, remove, or reorder a top-nav link (Docs / Changelog / Blog / GitHub).

## The catch
There are **four** layouts, each with its own nav `links`. Change them together
or the nav will differ across sections.

| Surface | File |
|---|---|
| Landing (`/`) | `app/(home)/layout.tsx` |
| Blog | `app/blog/layout.tsx` |
| Changelog | `app/changelog/layout.tsx` |
| Docs (`/docs/**`) | `app/docs/layout.tsx` |

## How
Edit the `links={[…]}` array in each file. A normal link:
```tsx
{ text: 'Changelog', url: '/changelog' },
```
The GitHub-stars pill is a custom item (home/blog/changelog only):
```tsx
{ type: 'custom', children: <GitHubStars />, secondary: true },
```

## Good to know
- Keep the order consistent across the four files.
- The wordmark/logo comes from `components/logo.tsx` (`<LogoMark/>`), set as the
  nav `title` — change the brand lockup there, not per-layout.
- The masthead double-rule + paper background is styled in `global.css` under
  `#nd-nav`.

## Verify
Every section's top nav shows the same links in the same order, active state on
the current section.
