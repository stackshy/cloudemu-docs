'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { services } from '@/lib/services';
import { Reveal } from '@/components/reveal';

/**
 * Coverage: a status board, not a card grid. One aligned row per domain —
 * domain name, then the three provider service names in tinted-header
 * columns, then a breathing live dot. Hairlines between rows only; rows
 * reveal top-to-bottom on view; each row links to its docs page.
 */

const GRID =
  'grid grid-cols-[minmax(120px,1.1fr)_minmax(90px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)_72px] gap-x-5';

export function CoverageMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-ink-3">04</span> · coverage
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
            21 domains. 3 providers. All live.
          </h2>
        </Reveal>

        <div ref={ref} className="mt-8 overflow-x-auto">
          <div className="min-w-[760px]">
            {/* header row */}
            <div
              className={`${GRID} border-b border-line-2 pb-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.06em]`}
            >
              <span className="text-ink-3">Domain</span>
              <span style={{ color: 'var(--aws)' }}>AWS</span>
              <span style={{ color: 'var(--azure)' }}>Azure</span>
              <span style={{ color: 'var(--gcp)' }}>GCP</span>
              <span className="text-right text-ink-3">Status</span>
            </div>

            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/docs/services/${s.slug}`}
                className={`${GRID} group items-center border-b border-line py-2`}
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateY(4px)',
                  transition: `opacity 250ms var(--ease-out) ${i * 35}ms, transform 250ms var(--ease-out) ${i * 35}ms`,
                }}
              >
                <span className="text-[13px] font-medium text-ink transition-colors group-hover:text-accent">
                  {s.category}
                </span>
                <span
                  className={`truncate font-mono text-xs transition-colors ${
                    s.aws === '—' ? 'text-ink-3' : 'text-ink-2 group-hover:text-ink'
                  }`}
                >
                  {s.aws}
                </span>
                <span
                  className={`truncate font-mono text-xs transition-colors ${
                    s.azure === '—' ? 'text-ink-3' : 'text-ink-2 group-hover:text-ink'
                  }`}
                >
                  {s.azure}
                </span>
                <span
                  className={`truncate font-mono text-xs transition-colors ${
                    s.gcp === '—' ? 'text-ink-3' : 'text-ink-2 group-hover:text-ink'
                  }`}
                >
                  {s.gcp}
                </span>
                <span className="flex items-center justify-end gap-1.5 font-mono text-[11px] text-ink-3">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-ok"
                    style={{
                      animation: on ? 'u-breathe 4s ease-in-out infinite' : 'none',
                      animationDelay: `${(i % 8) * 350}ms`,
                    }}
                  />
                  live
                </span>
              </Link>
            ))}
          </div>
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
