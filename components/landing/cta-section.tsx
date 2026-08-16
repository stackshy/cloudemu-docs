'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { useMagnetic } from '@/lib/interactions';
import { PRODUCT, STATS } from '@/lib/product';
import { services } from '@/lib/services';

const MotionLink = motion(Link);

export function CTASection() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const magnetic = useMagnetic(0.25);
  const installCmd = PRODUCT.install;
  const categories = services.length;
  const implementations = categories * STATS.clouds;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full">
      <motion.div
        variants={reduce ? undefined : staggerContainer(0.1, 0.05)}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
        className="relative w-full max-w-3xl mx-auto px-6 py-28 text-center"
      >
        <motion.h2
          variants={reduce ? undefined : fadeUp(0, 24)}
          className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.02em] text-ink leading-[1.1]"
        >
          Build and test without a real cloud
        </motion.h2>

        <motion.p
          variants={reduce ? undefined : fadeUp(0)}
          className="mt-5 text-base sm:text-lg text-ink-2 leading-relaxed max-w-xl mx-auto"
        >
          {implementations} in-memory service implementations across {categories} categories and{' '}
          {STATS.clouds} clouds. No dependencies, {STATS.latency} a call in-process, and your real
          cloud SDKs call it unchanged. Nothing to spin up, nothing to tear down.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : fadeUp(0)}
          className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-line bg-surface/80 backdrop-blur-sm font-mono text-sm text-ink"
        >
          <span className="text-ink-3 select-none">$</span>
          <span>{installCmd}</span>
          <button
            onClick={handleCopy}
            className="ml-1 p-1 rounded hover:bg-raised transition-colors"
            aria-label="Copy install command"
          >
            {copied ? (
              <Check className="w-4 h-4 text-accent" />
            ) : (
              <Copy className="w-4 h-4 text-ink-3" />
            )}
          </button>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeUp(0)}
          className="mt-9 flex items-center justify-center gap-3 flex-wrap"
        >
          <MotionLink
            href="/docs/quick-start"
            ref={magnetic.ref as React.RefObject<HTMLAnchorElement>}
            style={magnetic.style}
            onMouseMove={magnetic.onMouseMove}
            onMouseLeave={magnetic.onMouseLeave}
            whileHover={reduce ? undefined : { scale: 1.015 }}
            whileTap={reduce ? undefined : { scale: 0.985 }}
            className="group relative overflow-hidden u-btn u-btn-primary shadow-sm hover:shadow-lg transition-shadow duration-300 ease-out will-change-transform"
          >
            {!reduce && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 42%, hsl(0 0% 100% / 0.14) 50%, transparent 58%)',
                }}
              />
            )}
            <span className="relative inline-flex items-center gap-2">
              Get started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </MotionLink>
          <Link href="/docs" className="u-btn u-btn-secondary">
            Read the docs
          </Link>
        </motion.div>

        <motion.p
          variants={reduce ? undefined : fadeUp(0)}
          className="mt-10 text-sm text-ink-3"
        >
          MIT License &middot; Requires Go 1.25+
        </motion.p>
      </motion.div>
    </section>
  );
}
