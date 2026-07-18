import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PacketFlow } from '@/components/diagrams/packet-flow';
import { TerminalTypeOn } from './terminal-typeon';
import { LatencyTicker } from './latency-ticker';

/**
 * Hero: asymmetric two-column. Left — mono eyebrow, display headline with one
 * accent phrase, subhead, CTAs, and the type-on install terminal (the install
 * command IS the hero CTA). Right — the Packet Flow diagram. Below: mono stat
 * strip with the live Latency Ticker.
 */
export function Hero() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Left: copy */}
          <div>
            <p className="u-eyebrow mb-5">zero-cost cloud emulation for Go</p>

            <h1 className="text-[2.6rem] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[3.4rem]">
              Test against real cloud SDKs{' '}
              <span className="text-ink-2">without a real cloud</span>.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
              Point <code className="u-chip-code">aws-sdk-go-v2</code>,{' '}
              <code className="u-chip-code">azure-sdk-for-go</code>, or{' '}
              <code className="u-chip-code">cloud.google.com/go</code> at a
              local in-memory server that speaks their real wire protocols.
              Your production code runs unchanged.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/docs/quick-start" className="u-btn u-btn-primary group">
                Quick Start
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/docs/sdk-compat" className="u-btn u-btn-secondary">
                SDK-compat coverage
              </Link>
            </div>

            <div className="mt-5 max-w-md">
              <TerminalTypeOn />
            </div>
          </div>

          {/* Right: the wire */}
          <PacketFlow />
        </div>

        {/* Stat strip */}
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-xs tracking-[0.08em] text-ink-muted">
          <span>
            <span className="text-ink">3</span> PROVIDERS
          </span>
          <span aria-hidden className="text-line-strong">·</span>
          <span>
            <span className="text-ink">16</span> DOMAINS
          </span>
          <span aria-hidden className="text-line-strong">·</span>
          <span>
            <span className="text-ink">48</span> SERVICES
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
