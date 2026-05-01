'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedBackground } from './animated-background';
import { SDKFlowDiagram } from './sdk-flow-diagram';

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.1]">
              Test against{' '}
              <GradientText>real cloud SDKs</GradientText>
              <br />
              without a real cloud.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-fd-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Point <CodePill>aws-sdk-go-v2</CodePill>, <CodePill>azure-sdk-for-go</CodePill>, or{' '}
              <CodePill>cloud.google.com/go</CodePill> at a local{' '}
              <code className="font-mono text-[0.95em]">httptest</code> server. ~10ms per call.
            </p>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <Link
                href="/docs/sdk-compat"
                className="group px-6 py-2.5 rounded-lg bg-fd-foreground text-fd-background font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                Use Real SDKs
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/docs/quick-start"
                className="px-6 py-2.5 rounded-lg border border-fd-border bg-fd-card font-semibold hover:bg-fd-accent transition-colors"
              >
                Quick Start
              </Link>
            </div>
          </motion.div>

          {/* Right: animated diagram — no card, no border, sits directly on the page */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <SDKFlowDiagram />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * GradientText: a tighter, more controlled highlight than a 3-stop rainbow.
 * Single soft transition between two adjacent hues + slight saturation boost
 * via a transparent overlay reads cleaner at large display sizes.
 */
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent whitespace-nowrap">
      {children}
    </span>
  );
}

function CodePill({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.95em] px-1.5 py-0.5 rounded bg-fd-card border border-fd-border whitespace-nowrap">
      {children}
    </code>
  );
}
