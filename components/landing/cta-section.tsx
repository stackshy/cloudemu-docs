'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/reveal';

const CMD = 'go get github.com/stackshy/cloudemu/v2';

/**
 * Final CTA: open canvas between hairlines — no band fill. The terminal
 * command line is the one earned box in the section.
 */
export function CTASection() {
  const [copied, setCopied] = useState(false);

  return (
    <section className="w-full border-y border-line">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span aria-hidden>$</span> get started
          </p>
        </Reveal>
        <Reveal delay={70}>
          <h2 className="max-w-[60ch] text-3xl font-bold tracking-[-0.01em] text-ink">
            One <code className="font-mono font-semibold">go get</code> from
            now, your tests stop needing the internet.
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-8 flex max-w-xl items-center gap-3 rounded-lg border border-line bg-inset px-4 py-3.5 font-mono text-sm text-ink-inset">
            <span aria-hidden className="select-none text-ink-inset-muted">
              $
            </span>
            <span className="flex-1 overflow-x-auto whitespace-nowrap">{CMD}</span>
            <button
              type="button"
              aria-label="Copy install command"
              onClick={async () => {
                await navigator.clipboard.writeText(CMD);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="rounded p-1.5 text-ink-inset-muted transition-colors hover:bg-white/10 hover:text-ink-inset"
            >
              {copied ? (
                <Check className="size-4 text-ok" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
        </Reveal>

        <Reveal delay={210}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/docs" className="u-btn u-btn-primary group">
              Read the docs
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/docs/quick-start" className="u-btn u-btn-secondary">
              Quick Start
            </Link>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.06em] text-ink-3">
            MIT license · Go 1.25+ · zero dependencies
          </p>
        </Reveal>
      </div>
    </section>
  );
}
