'use client';

import Link from '@/components/link';
import { services } from '@/lib/services';
import { Reveal } from '@/components/reveal';
import { useInView } from '@/components/diagrams/use-in-view';

/**
 * Coverage: the 21-domain spec sheet folded into two side-by-side halves,
 * split by one vertical hairline — full container width, half the height.
 * Each half is the same four-column table (domain + three providers).
 * "Live" is stated once in the legend; one row-cascade is the section's
 * entire animation budget. Halves stack into one table on small screens.
 */

// On small screens the columns shrink to share the viewport (names truncate),
// so the fourth provider column never overflows off-screen; the fixed
// min-widths kick in only from `lg` up, where there's room for them.
const GRID =
  'grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.05fr)] gap-x-3 ' +
  'lg:grid-cols-[minmax(114px,1.1fr)_minmax(120px,1.15fr)_minmax(84px,1fr)_minmax(108px,1.05fr)]';

const MID = Math.ceil(services.length / 2);
const HALVES = [services.slice(0, MID), services.slice(MID)];

function Header() {
  return (
    <div
      className={`${GRID} border-b border-line-2 pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.06em]`}
    >
      <span className="text-ink-3">Domain</span>
      <span style={{ color: 'var(--aws)' }}>AWS</span>
      <span style={{ color: 'var(--azure)' }}>Azure</span>
      <span style={{ color: 'var(--gcp)' }}>GCP</span>
    </div>
  );
}

export function CoverageMatrix() {
  const [ref, on] = useInView<HTMLDivElement>(0.15);

  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="u-eyebrow mb-3">
                <span className="text-ink-3">04</span> · coverage
              </p>
              <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
                21 domains. 3 providers. All live.
              </h2>
            </div>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-ok"
                style={{ animation: 'u-breathe 4s ease-in-out infinite' }}
              />
              sdk-compat + portable api
            </p>
          </div>
        </Reveal>

        <div
          ref={ref}
          className="mt-8 grid grid-cols-1 gap-y-0 lg:grid-cols-2 lg:divide-x lg:divide-line"
        >
          {HALVES.map((half, h) => (
            <div key={h} className={h === 0 ? 'lg:pr-8' : 'lg:pl-8'}>
              {/* second header hidden when halves stack into one table */}
              <div className={h === 1 ? 'hidden lg:block' : ''}>
                <Header />
              </div>
              {half.map((s, i) => (
                <Link
                  key={s.slug}
                  href={`/docs/services/${s.slug}`}
                  className={`${GRID} group items-baseline border-b border-line py-2`}
                  style={{
                    opacity: on ? 1 : 0,
                    transition: `opacity 250ms var(--ease-out) ${i * 45}ms`,
                  }}
                >
                  <span className="truncate text-[13px] font-medium text-ink transition-colors group-hover:text-accent">
                    {s.category}
                  </span>
                  {([s.aws, s.azure, s.gcp] as const).map((name, j) => (
                    <span
                      key={j}
                      className={`truncate font-mono text-[11px] transition-colors ${
                        name === '—'
                          ? 'text-ink-3'
                          : 'text-ink-2 group-hover:text-ink'
                      }`}
                    >
                      {name}
                    </span>
                  ))}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs leading-relaxed text-ink-3">
          every domain is drivable two ways: the{' '}
          <Link
            href="/docs/portable-api"
            className="text-ink underline decoration-line-2 underline-offset-2 hover:text-accent hover:decoration-accent"
          >
            portable go api
          </Link>{' '}
          (in-process, no HTTP) or the{' '}
          <Link
            href="/docs/sdk-compat"
            className="text-ink underline decoration-line-2 underline-offset-2 hover:text-accent hover:decoration-accent"
          >
            sdk-compat server
          </Link>{' '}
          (real SDK clients over the wire).
        </p>
      </div>
    </section>
  );
}
