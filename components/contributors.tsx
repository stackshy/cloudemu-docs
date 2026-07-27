const REPO = 'stackshy/cloudemu';

type Contributor = { login: string; avatarUrl: string; htmlUrl: string };

// Fetch repo contributors from the GitHub REST API. Server-side + ISR-cached
// (1h). Bots (dependabot etc.) are filtered out. Returns [] on any failure so
// the section simply renders nothing rather than breaking the page.
async function fetchContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contributors?per_page=100`,
      { headers: { Accept: 'application/vnd.github+json' }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      login?: string;
      avatar_url?: string;
      html_url?: string;
      type?: string;
    }>;
    if (!Array.isArray(data)) return [];
    return data
      .filter((c) => c.type === 'User' && c.login && c.avatar_url && c.html_url)
      .map((c) => ({ login: c.login!, avatarUrl: c.avatar_url!, htmlUrl: c.html_url! }));
  } catch {
    return [];
  }
}

const MAX_SHOWN = 5;

export async function Contributors() {
  const people = await fetchContributors();
  if (people.length === 0) return null;

  const shown = people.slice(0, MAX_SHOWN);
  const overflow = people.length - shown.length;

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
        Contributors
      </span>
      {/* A row of profile photos, each with the contributor's name beneath it. */}
      <ul className="flex flex-wrap gap-x-6 gap-y-5">
        {shown.map((c) => (
          <li key={c.login}>
            <a
              href={c.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex w-16 flex-col items-center gap-2 text-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.avatarUrl}
                alt={c.login}
                width={40}
                height={40}
                loading="lazy"
                className="size-10 rounded-full bg-surface ring-1 ring-line transition-transform group-hover:-translate-y-0.5 group-hover:ring-line-2"
              />
              <span className="w-full truncate text-xs text-ink-2 transition-colors group-hover:text-ink">
                {c.login}
              </span>
            </a>
          </li>
        ))}
        {overflow > 0 && (
          <li>
            <a
              href={`https://github.com/${REPO}/graphs/contributors`}
              target="_blank"
              rel="noreferrer"
              className="flex w-16 flex-col items-center gap-2 text-center"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-sm font-semibold text-ink-2">
                +{overflow}
              </span>
              <span className="text-xs text-ink-3">more</span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
