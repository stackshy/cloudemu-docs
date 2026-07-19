'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PacketFlow } from '@/components/diagrams/packet-flow';
import { TerminalTypeOn } from './terminal-typeon';
import { LatencyTicker } from './latency-ticker';
import { CountUp } from './count-up';

/**
 * Hero: asymmetric two-column. Left — mono eyebrow, display headline with one
 * accent phrase, subhead, CTAs, and the type-on install terminal (the install
 * command IS the hero CTA). Right — the Packet Flow diagram. Below: mono stat
 * strip with the live Latency Ticker and one-time count-ups.
 *
 * Left-column entrance: each element plays the house 8px fade-rise on mount
 * (above the fold, so no IntersectionObserver), staggered 70ms apart —
 * eyebrow → h1 → subhead → buttons → terminal. Plays once. Skipped entirely
 * under prefers-reduced-motion (final state renders immediately).
 */
export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
    }
    setMounted(true);
  }, []);

  // House 8px fade-rise as an inline transition, staggered per step.
  const enter = (step: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity 250ms var(--ease-out) ${step * 70}ms, transform 250ms var(--ease-out) ${step * 70}ms`,
        };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1120px] px-6 pb-14 pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Left: copy */}
          <div>
            <p className="u-eyebrow mb-5" style={enter(0)}>
              zero-cost cloud emulation for Go
            </p>

            <h1
              className="text-[2.6rem] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[3.4rem]"
              style={enter(1)}
            >
              Test against real cloud SDKs{' '}
              <span className="text-ink-2">without a real cloud</span>.
            </h1>

            <p
              className="mt-5 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg"
              style={enter(2)}
            >
              Point the real AWS, Azure, and GCP Go SDKs at an in-memory
              server that speaks their wire protocols. Production code,
              unchanged. No mocks, no Docker, no bill.
            </p>

            <div
              className="mt-7 flex flex-wrap items-center gap-3"
              style={enter(3)}
            >
              <Link href="/docs/quick-start" className="u-btn u-btn-primary group">
                Quick Start
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/docs/sdk-compat" className="u-btn u-btn-secondary">
                SDK-compat coverage
              </Link>
            </div>

            <div className="mt-5 max-w-md" style={enter(4)}>
              <TerminalTypeOn />
            </div>
          </div>

          {/* Right: the wire */}
          <PacketFlow />
        </div>

        {/* Stat strip */}
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-xs tracking-[0.08em] text-ink-muted">
          <span>
            <span className="text-ink">
              <CountUp to={3} />
            </span>{' '}
            PROVIDERS
          </span>
          <span aria-hidden className="text-line-strong">·</span>
          <span>
            <span className="text-ink">
              <CountUp to={21} />
            </span>{' '}
            DOMAINS
          </span>
          <span aria-hidden className="text-line-strong">·</span>
          <span>
            <span className="text-ink">
              <CountUp to={60} suffix="+" />
            </span>{' '}
            SERVICES
          </span>
          <span aria-hidden className="text-line-strong">·</span>
          <span className="text-sm">
            <LatencyTicker />
          </span>
          <span aria-hidden className="text-line-strong">·</span>
          <span>
            <span className="text-ink">0</span> DEPS
          </span>
        </div>
      </div>
    </section>
  );
}
