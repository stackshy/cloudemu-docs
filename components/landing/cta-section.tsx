'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { EASE, fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

export function CTASection() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const installCmd = 'go get github.com/stackshy/cloudemu';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <EmberAurora reduce={!!reduce} />

      <motion.div
        variants={reduce ? undefined : staggerContainer(0.1, 0.05)}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
        className="relative w-full max-w-3xl mx-auto px-6 py-28 text-center"
      >
        <motion.h2
          variants={reduce ? undefined : fadeUp(0, 24)}
          className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.1]"
        >
          Build and test without a real cloud
        </motion.h2>

        <motion.p
          variants={reduce ? undefined : fadeUp(0)}
          className="mt-5 text-base sm:text-lg text-fd-muted-foreground leading-relaxed max-w-xl mx-auto"
        >
          48 in-memory service implementations across AWS, Azure, and GCP. Pure Go, zero
          dependencies, ~10ms per call. Your real cloud SDKs work unchanged.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : fadeUp(0)}
          className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-fd-border bg-fd-card/80 backdrop-blur-sm font-mono text-sm"
        >
          <span className="text-fd-muted-foreground select-none">$</span>
          <span>{installCmd}</span>
          <button
            onClick={handleCopy}
            className="ml-1 p-1 rounded hover:bg-fd-secondary transition-colors"
            aria-label="Copy install command"
          >
            {copied ? (
              <Check className="w-4 h-4 text-ember-500" />
            ) : (
              <Copy className="w-4 h-4 text-fd-muted-foreground" />
            )}
          </button>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeUp(0)}
          className="mt-9 flex items-center justify-center gap-3 flex-wrap"
        >
          <Link
            href="/docs/quick-start"
            className="group px-6 py-2.5 rounded-lg bg-fd-foreground text-fd-background font-semibold inline-flex items-center gap-2 transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            Get started
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/docs"
            className="px-6 py-2.5 rounded-lg border border-fd-border bg-fd-card font-semibold hover:bg-fd-accent transition-colors"
          >
            Read the docs
          </Link>
        </motion.div>

        <motion.p
          variants={reduce ? undefined : fadeUp(0)}
          className="mt-10 text-sm text-fd-muted-foreground"
        >
          MIT License &middot; Requires Go 1.25+
        </motion.p>
      </motion.div>
    </section>
  );
}

/**
 * EmberAurora: a very low-opacity ember wash that drifts slowly behind the CTA.
 * Two soft radial blooms breathe and pan on independent, long loops — enough to
 * feel alive, never bright enough to read as a glow. Static (reduced-motion) mode
 * renders the same blooms at rest.
 */
function EmberAurora({ reduce }: { reduce: boolean }) {
  const base = {
    position: 'absolute' as const,
    borderRadius: '9999px',
    filter: 'blur(80px)',
    willChange: 'transform',
  };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{
          ...base,
          top: '-10%',
          left: '15%',
          width: '38rem',
          height: '38rem',
          background:
            'radial-gradient(circle, hsl(18 100% 59% / 0.10) 0%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 40, -20, 0], y: [0, 20, 40, 0], opacity: [0.7, 1, 0.8, 0.7] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 22, ease: EASE, repeat: Infinity, repeatType: 'mirror' }
        }
      />
      <motion.div
        style={{
          ...base,
          bottom: '-20%',
          right: '10%',
          width: '32rem',
          height: '32rem',
          background:
            'radial-gradient(circle, hsl(14 90% 52% / 0.08) 0%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -30, 20, 0], y: [0, -25, 10, 0], opacity: [0.6, 0.9, 0.7, 0.6] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 28, ease: EASE, repeat: Infinity, repeatType: 'mirror', delay: 1.5 }
        }
      />
    </div>
  );
}
