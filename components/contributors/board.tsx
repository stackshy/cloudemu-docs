'use client';

import type { Contributor } from '@/lib/contributors.generated';
import { useLiveContributors } from '@/lib/contributors-live';
import { ContributorGrid } from './grid';
import { TIER_ORDER } from '@/lib/contributor-tiers';

/**
 * ContributorsBoard — one live fetch drives the header count + total AND the
 * avatar wall, so "N hands", "T commits" and every per-person number always
 * agree (they were drifting when the header used the static snapshot but the
 * grid fetched live).
 */
export function ContributorsBoard({ initial }: { initial: Contributor[] }) {
  const people = useLiveContributors(initial);
  const total = people.reduce((n, p) => n + p.contributions, 0);

  return (
    <>
      <header className="border-b border-line pb-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <span className="text-accent">§</span> Contributors
        </span>
        <h1 className="font-serif mt-4 text-[clamp(38px,7vw,72px)] font-extrabold leading-[0.92] tracking-[-0.03em] text-ink text-balance">
          Collapsed by <span className="text-ember">{people.length} hands</span>.
        </h1>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-ink-2">
          cloudemu is open source. Every bucket, table and instance it emulates was collapsed into
          memory by these people — <b className="font-semibold text-ink">{total.toLocaleString()}</b> commits
          and counting.
        </p>
      </header>

      <div className="cb-legend" aria-hidden="true">
        <span className="cb-legend-label">Tiers</span>
        {TIER_ORDER.map((t) => (
          <span key={t.key} className="cb-legend-item" style={{ ['--tier' as string]: t.color }}>
            <i className="cb-glyph">{t.glyph}</i>
            {t.label}
          </span>
        ))}
      </div>

      <div className="mt-8">
        <ContributorGrid people={people} />
      </div>
    </>
  );
}
