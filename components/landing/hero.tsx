'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EASE, fadeUp, staggerContainer } from '@/lib/motion';
import { useMagnetic } from '@/lib/interactions';
import { AnimatedBackground } from './animated-background';
import { SDKFlowDiagram } from './sdk-flow-diagram';
import { Kicker } from './section';
import { Logo } from '../logo';

// Motion-enabled Link so buttons can lift/scale while staying real anchors.
const MotionLink = motion.create(Link);

export function Hero() {
  const reduce = useReducedMotion();

  // Section ref drives the right-column scroll parallax.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  // Gentle, small-amplitude drift as the hero scrolls out of view.
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  // Left column orchestrates a staggered reveal of its children.
  const container = staggerContainer(0.12, 0.05);
  const item = fadeUp();
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
  // Nested stagger so the headline reveals word-group by word-group.
  const headline = staggerContainer(0.1);
  const line = fadeUp();

  // Pointer-magnetic drift for the two CTAs — gentle, on top of their whileHover lift.
  const primaryMagnetic = useMagnetic(0.25);
  const secondaryMagnetic = useMagnetic(0.25);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
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

            <motion.div
              variants={reduce ? undefined : item}
              className="mb-4 flex justify-center lg:justify-start"
            >
              <Kicker>cloudemu — in-memory cloud for Go</Kicker>
            </motion.div>

            <motion.h1
              variants={reduce ? undefined : headline}
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.1]"
            >
              <motion.span variants={reduce ? undefined : line} className="inline-block">
                Run
              </motion.span>{' '}
              <motion.span variants={reduce ? undefined : line} className="inline-block">
                <GradientText>real cloud SDKs</GradientText>
              </motion.span>
              <br />
              <motion.span variants={reduce ? undefined : line} className="inline-block">
                without a real cloud.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={reduce ? undefined : item}
              className="mt-5 text-base sm:text-lg text-fd-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Point <CodePill>aws-sdk-go-v2</CodePill>, <CodePill>azure-sdk-for-go</CodePill>, or{' '}
              <CodePill>cloud.google.com/go</CodePill> at a local{' '}
              <code className="font-mono text-[0.95em]">cloudemu</code> server. Runs in a test or your app. Calls return in ~10ms.
            </motion.p>

            <motion.div
              variants={reduce ? undefined : item}
              className="mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap"
            >
              <motion.span
                ref={primaryMagnetic.ref as React.RefObject<HTMLSpanElement>}
                style={primaryMagnetic.style}
                onMouseMove={primaryMagnetic.onMouseMove}
                onMouseLeave={primaryMagnetic.onMouseLeave}
                className="inline-flex"
              >
                <MotionLink
                  href="/docs/sdk-compat"
                  whileHover={reduce ? undefined : { y: -2, scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="group px-6 py-2.5 rounded-lg bg-fd-foreground text-fd-background font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background"
                >
                  Use Real SDKs
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </MotionLink>
              </motion.span>
              <motion.span
                ref={secondaryMagnetic.ref as React.RefObject<HTMLSpanElement>}
                style={secondaryMagnetic.style}
                onMouseMove={secondaryMagnetic.onMouseMove}
                onMouseLeave={secondaryMagnetic.onMouseLeave}
                className="inline-flex"
              >
                <MotionLink
                  href="/docs/quick-start"
                  whileHover={reduce ? undefined : { y: -2, scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="px-6 py-2.5 rounded-lg border border-fd-border bg-fd-card font-semibold hover:bg-fd-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background"
                >
                  Quick Start
                </MotionLink>
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Right: animated diagram — no card, no border, sits directly on the page */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={reduce ? false : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            style={reduce ? undefined : { y: parallaxY }}
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
