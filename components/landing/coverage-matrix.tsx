'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { services } from '@/lib/services';
import { Reveal } from '@/components/reveal';

/**
 * Coverage matrix: open clusters on the canvas — no cell boxes. Four columns;
 * hairline rules between matrix rows only. Each cluster: domain name with an
 * inline status dot, then three provider lines with tinted mono prefixes.
 * Rows fade in once on view; hover brightens text.
 */

const COLS = 4;

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

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

  const rows = chunk(services, COLS);

  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-ink-3">04</span> · coverage
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
              16 domains. 3 providers. All live.
            </h2>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-ink-3">
              <span aria-hidden>●</span> sdk-compat + portable api
            </p>
          </div>
        </Reveal>

        <div ref={ref} className="mt-10">
          {rows.map((row, r) => (
            <div
              key={r}
              className={`grid grid-cols-2 gap-x-8 sm:grid-cols-2 lg:grid-cols-4 ${
                r > 0 ? 'border-t border-line' : ''
              }`}
              style={{
                opacity: on ? 1 : 0,
                transition: `opacity 250ms var(--ease-out) ${r * 90}ms`,
              }}
            >
              {row.map((s) => (
                <Link
                  key={s.slug}
                  href={`/docs/services/${s.slug}`}
                  className="group py-5"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    {s.category}
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-ink-3 transition-colors group-hover:bg-ok"
                    />
                  </span>
                  <span className="mt-2 flex flex-col gap-0.5 font-mono text-[11px] leading-relaxed text-ink-2">
                    <span className="truncate">
                      <span className="text-[10px]" style={{ color: 'var(--aws)' }}>
                        aws
                      </span>{' '}
                      {s.aws}
                    </span>
                    <span className="truncate">
                      <span className="text-[10px]" style={{ color: 'var(--azure)' }}>
                        azr
                      </span>{' '}
                      {s.azure}
                    </span>
                    <span className="truncate">
                      <span className="text-[10px]" style={{ color: 'var(--gcp)' }}>
                        gcp
                      </span>{' '}
                      {s.gcp}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <p className="mt-6 border-t border-line pt-4 font-mono text-xs leading-relaxed text-ink-3">
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
