'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { services } from '@/lib/services';
import { Reveal } from '@/components/reveal';

/**
 * Coverage Matrix: the 16-domain status board. On scroll-into-view, cells
 * light up in a fast diagonal sweep (10ms stagger) like a status board coming
 * online. Every domain is SDK-live across all three providers (since v1.9.0),
 * so each cell settles with an accent status dot on a slow breathing pulse.
 * Hover raises a cell one surface step and reveals the provider service names.
 */

const COLS = 4;

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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-ink-3">04</span> · coverage
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
              16 domains. 3 providers. All live.
            </h2>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
              <span className="text-ink-3">●</span> sdk-compat + portable api
            </p>
          </div>
        </Reveal>

        <div
          ref={ref}
          className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s, i) => {
            // diagonal sweep order: row + col index
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            const sweepDelay = (row + col) * 60 + (i % COLS) * 10;

            return (
              <Link
                key={s.slug}
                href={`/docs/services/${s.slug}`}
                className="group relative bg-base p-4 transition-colors duration-150 hover:bg-raised"
                style={{
                  opacity: on ? 1 : 0,
                  transition: `opacity 200ms var(--ease-signal) ${sweepDelay}ms, background-color 150ms var(--ease-signal)`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {s.category}
                  </span>
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-ink-3"
                    style={{
                      animation: on
                        ? 'u-breathe 4s ease-in-out infinite'
                        : 'none',
                      animationDelay: `${(i % 7) * 300}ms`,
                    }}
                  />
                </div>
                <div className="mt-2 flex flex-col gap-0.5 font-mono text-[11px] leading-relaxed text-ink-muted">
                  <span className="truncate">
                    <span style={{ color: 'var(--aws)' }}>aws</span>{' '}
                    {s.aws}
                  </span>
                  <span className="truncate">
                    <span style={{ color: 'var(--azure)' }}>azr</span>{' '}
                    {s.azure}
                  </span>
                  <span className="truncate">
                    <span style={{ color: 'var(--gcp)' }}>gcp</span>{' '}
                    {s.gcp}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-4 font-mono text-xs leading-relaxed text-ink-muted">
          every domain is drivable two ways: the{' '}
          <Link href="/docs/portable-api" className="text-ink underline decoration-line-2 underline-offset-2 hover:text-accent hover:decoration-accent">
            portable go api
          </Link>{' '}
          (in-process, no HTTP) or the{' '}
          <Link href="/docs/sdk-compat" className="text-ink underline decoration-line-2 underline-offset-2 hover:text-accent hover:decoration-accent">
            sdk-compat server
          </Link>{' '}
          (real SDK clients over the wire).
        </p>
      </div>
    </section>
  );
}
