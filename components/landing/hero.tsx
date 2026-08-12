'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedBackground } from './animated-background';
import { SDKFlowDiagram } from './sdk-flow-diagram';
import { Logo } from '../logo';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  // Left column orchestrates a staggered reveal of its children.
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
  };
  // The logo "flies in" from the left — its built-in speed streaks sell the motion.
  const logoItem: Variants = {
    hidden: { opacity: 0, x: -64, scale: 0.9 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 130, damping: 13 },
    },
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            variants={reduce ? undefined : container}
            initial={reduce ? false : 'hidden'}
            animate={reduce ? false : 'show'}
            className="text-center lg:text-left"
          >
            <motion.div
              variants={reduce ? undefined : logoItem}
              whileHover={reduce ? undefined : { scale: 1.06, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="mb-6 flex justify-center lg:justify-start"
              style={{ transformOrigin: 'left center' }}
            >
              <Logo width={56} height={56} />
            </motion.div>

            <motion.h1
              variants={reduce ? undefined : item}
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.1]"
            >
              Test against{' '}
              <GradientText>real cloud SDKs</GradientText>
              <br />
              without a real cloud.
            </motion.h1>

            <motion.p
              variants={reduce ? undefined : item}
              className="mt-5 text-base sm:text-lg text-fd-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Point <CodePill>aws-sdk-go-v2</CodePill>, <CodePill>azure-sdk-for-go</CodePill>, or{' '}
              <CodePill>cloud.google.com/go</CodePill> at a local{' '}
              <code className="font-mono text-[0.95em]">httptest</code> server. ~10ms per call.
            </motion.p>

            <motion.div
              variants={reduce ? undefined : item}
              className="mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap"
            >
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
            </motion.div>
          </motion.div>

          {/* Right: animated diagram — no card, no border, sits directly on the page */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={reduce ? false : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE_OUT }}
          >
            <SDKFlowDiagram />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * GradientText: the ember headline highlight. Uses an explicit inline gradient
 * (rather than Tailwind gradient utilities) so the clipped text is always filled
 * and never renders transparent/invisible.
 */
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent whitespace-nowrap"
      style={{ backgroundImage: 'linear-gradient(90deg, #ff6b2c, #d64d17)' }}
    >
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
