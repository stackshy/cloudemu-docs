'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/reveal';

const CMD = 'go get github.com/stackshy/cloudemu/v2';

/** Final CTA: a terminal-styled band on the inset surface. */
export function CTASection() {
  const [copied, setCopied] = useState(false);

  return (
    <section className="w-full border-t border-line bg-inset">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3 text-ink-inset-muted">
            <span className="text-signal">$</span> get started
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink-inset">
            One command. No accounts. No Docker.
          </h2>

          <div className="mt-8 flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-3.5 font-mono text-sm text-ink-inset">
            <span aria-hidden className="select-none text-signal">
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
                <Check className="size-4 text-signal" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/docs" className="u-btn u-btn-primary group">
              Read the docs
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs/quick-start"
              className="u-btn border border-white/20 text-ink-inset hover:bg-white/5"
            >
              Quick Start
            </Link>
          </div>

          <p className="mt-10 font-mono text-xs uppercase tracking-[0.08em] text-ink-inset-muted">
            MIT license · Go 1.25+ · zero dependencies
          </p>
        </Reveal>
      </div>
    </section>
  );
}
