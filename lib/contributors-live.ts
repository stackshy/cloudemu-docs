'use client';

import { useEffect, useState } from 'react';
import type { Contributor } from './contributors.generated';

// Public, CORS-enabled, unauthenticated (rate limited per visitor IP).
const API = 'https://api.github.com/repos/stackshy/cloudemu/contributors?per_page=100';

interface RawContributor { login: string; avatar_url: string; contributions: number; html_url: string; type: string }

export async function fetchContributors(): Promise<Contributor[]> {
  const r = await fetch(API, { headers: { Accept: 'application/vnd.github+json' } });
  if (!r.ok) throw new Error(String(r.status));
  const data = await r.json();
  if (!Array.isArray(data)) throw new Error('unexpected response');
  return (data as RawContributor[])
    .filter((c) => c.type === 'User' && !/\[bot\]$/.test(c.login))
    .map((c) => ({ login: c.login, avatar: c.avatar_url, contributions: c.contributions, url: c.html_url }))
    .sort((a, b) => b.contributions - a.contributions);
}

/**
 * Committed snapshot first (instant paint + SEO), refreshed live from GitHub on
 * mount — so the header total, the count and every per-person number all come
 * from the same source and stay consistent. Keeps the snapshot on error.
 */
export function useLiveContributors(initial: Contributor[]): Contributor[] {
  const [people, setPeople] = useState(initial);
  useEffect(() => {
    let alive = true;
    fetchContributors()
      .then((next) => { if (alive && next.length) setPeople(next); })
      .catch(() => { /* offline or rate-limited — keep the snapshot */ });
    return () => { alive = false; };
  }, []);
  return people;
}
