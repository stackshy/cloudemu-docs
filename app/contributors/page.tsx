import type { Metadata } from 'next';
import { PRODUCT } from '@/lib/product';
import { CONTRIBUTORS, TOTAL_CONTRIBUTIONS } from '@/lib/contributors.generated';
import { ContributorGrid } from '@/components/contributors/grid';
import { TIER_ORDER } from '@/lib/contributor-tiers';

export const metadata: Metadata = {
  title: 'Contributors',
  description: `The people who built cloudemu — ${CONTRIBUTORS.length} contributors and ${TOTAL_CONTRIBUTIONS} commits, in the open.`,
  alternates: { canonical: '/contributors' },
};

export default function ContributorsPage() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-5 pb-24 pt-16 sm:px-10">
      <header className="border-b border-line pb-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <span className="text-accent">§</span> Contributors
        </span>
        <h1 className="font-serif mt-4 text-[clamp(38px,7vw,72px)] font-extrabold leading-[0.92] tracking-[-0.03em] text-ink text-balance">
          Collapsed by <span className="text-ember">{CONTRIBUTORS.length} hands</span>.
        </h1>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-ink-2">
          cloudemu is open source. Every bucket, table and instance it emulates was collapsed into
          memory by these people — <b className="font-semibold text-ink">{TOTAL_CONTRIBUTIONS}</b> commits
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
        <ContributorGrid people={CONTRIBUTORS} />
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-3">
        <a className="cl-btn-p" href={`${PRODUCT.repo}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
          Add your name →
        </a>
        <a className="cl-btn-s" href={PRODUCT.repo} target="_blank" rel="noreferrer">★ GitHub</a>
      </div>
    </main>
  );
}
