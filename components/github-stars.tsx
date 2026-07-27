import { Star } from 'lucide-react';

const REPO = 'stackshy/cloudemu';
const REPO_URL = `https://github.com/${REPO}`;

// Fetch the repo's star count from the GitHub REST API. Server-side + ISR-cached
// (1h) so we make at most one request per hour rather than one per visitor —
// unauthenticated GitHub is 60 req/hr/IP. Returns null on any failure so the UI
// degrades to an icon-only link instead of breaking the render.
async function fetchStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

// 21123 -> "21.1K", 1000 -> "1K", 942 -> "942".
function formatStars(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
}

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

// Nav pill: GitHub mark + formatted star count + a gold star. Falls back to
// mark + "GitHub" label when the count is unavailable.
export async function GithubStarPill() {
  const stars = await fetchStars();
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={
        stars != null
          ? `Star cloudemu on GitHub — ${stars.toLocaleString()} stars`
          : 'cloudemu on GitHub'
      }
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-line-2 hover:bg-line/40"
    >
      <GithubMark className="size-[18px]" />
      {stars != null ? (
        <>
          <span className="tabular-nums">{formatStars(stars)}</span>
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
        </>
      ) : (
        <span>GitHub</span>
      )}
    </a>
  );
}
