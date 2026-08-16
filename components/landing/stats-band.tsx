'use client';

import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';

import { DUR, EASE, fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { AnimatedNumber } from '@/components/landing/animated-number';
import { STATS } from '@/lib/product';

/**
 * StatsBand: a boxless spec strip under the hero — read like a datasheet. A mono
 * caption on a hairline over four left-aligned cells: large tabular numbers in ink
 * (accent is spent only on the draw-in underline), monospace field labels beneath.
 * Numbers count up on scroll; the underline draws left→right as each reveals.
 */

const drawUnderline: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: DUR.base, ease: EASE, delay: 0.12 } },
};

type Stat = { label: string; value?: number; suffix?: string; static?: string };

const stats: Stat[] = [
  { value: STATS.sdkCompatServices, suffix: '+', label: 'SDK-compatible services' },
  { value: STATS.serviceDomains, label: 'service domains' },
  { value: STATS.clouds, label: 'clouds · AWS Azure GCP' },
  { static: STATS.latency, label: 'per in-process call' },
];

export function StatsBand() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full max-w-5xl mx-auto px-6">
      <motion.div
        variants={reduce ? undefined : staggerContainer(0.08)}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
      >
        <motion.div
          variants={reduce ? undefined : fadeUp(0, 12)}
          className="flex items-center justify-between border-t border-line py-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-3"
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-accent">//</span>
            coverage
          </span>
          <span>AWS · Azure · GCP</span>
        </motion.div>

        <motion.dl
          variants={reduce ? undefined : staggerContainer(0.1)}
          className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-line"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={reduce ? undefined : fadeUp(0, 16)}
              className={[
                'flex flex-col items-start text-left gap-1.5 py-7 px-5',
                'border-line',
                i === 0 ? 'pl-0' : '',
                i > 0 ? 'border-l' : '',
                i === 2 ? 'border-l-0 md:border-l' : '',
                i >= 2 ? 'border-t md:border-t-0' : '',
              ].join(' ')}
            >
              <dd
                className="relative flex items-baseline pb-2 text-4xl font-semibold leading-none text-ink md:text-5xl"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {s.static ? (
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{s.static}</span>
                ) : (
                  <AnimatedNumber value={s.value ?? 0} suffix={s.suffix ?? ''} />
                )}
                <motion.span
                  aria-hidden
                  variants={reduce ? undefined : drawUnderline}
                  className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full origin-left rounded-full"
                  style={{
                    transformOrigin: 'left',
                    scaleX: reduce ? 1 : undefined,
                    background: 'linear-gradient(90deg, var(--accent), transparent)',
                    opacity: 0.65,
                  }}
                />
              </dd>
              <dt className="font-mono text-[11px] md:text-xs uppercase tracking-wider text-ink-3">
                {s.label}
              </dt>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}

export default StatsBand;
