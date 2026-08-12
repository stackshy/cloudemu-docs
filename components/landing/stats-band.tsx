'use client';

import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';

import { DUR, EASE, fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { AnimatedNumber } from '@/components/landing/animated-number';

/**
 * StatsBand: a boxless spec strip under the hero — read it like a datasheet, not
 * a marketing stat band. A mono caption row (`// spec` … pure Go · zero deps) sits
 * on a hairline over four left-aligned spec cells: big ember tabular numbers with
 * monospace field labels beneath, split by thin vertical hairlines. Numbers count
 * up on scroll (AnimatedNumber); as each reveals, an ember underline draws left→
 * right beneath it. Cells lift softly on hover. Reduced motion renders it static.
 */

const EMBER = '#FF6B2C';

/** Ember underline that draws left→right in step with its cell's reveal. */
const drawUnderline: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: DUR.base, ease: EASE, delay: 0.12 } },
};

type Stat = { label: string; value?: number; suffix?: string; static?: string; extra?: string };

const stats: Stat[] = [
  { value: 48, label: 'in-memory services' },
  { value: 16, label: 'service categories' },
  { value: 3, extra: '+OCI', label: 'clouds · AWS Azure GCP' },
  { static: '~10ms', label: 'per call' },
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
          className="flex items-center justify-between border-t border-fd-border py-2.5 font-mono text-[11px] uppercase tracking-widest text-fd-muted-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <span style={{ color: EMBER }}>//</span>
            spec
          </span>
          <span>pure Go · zero deps</span>
        </motion.div>

        <motion.dl
          variants={reduce ? undefined : staggerContainer(0.1)}
          className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-fd-border"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={reduce ? undefined : fadeUp(0, 16)}
              whileHover={reduce ? undefined : { y: -3, transition: { duration: DUR.fast, ease: EASE } }}
              className={[
                'flex flex-col items-start text-left gap-1.5 py-7 px-5',
                'border-fd-border',
                i === 0 ? 'pl-0' : '',
                i > 0 ? 'border-l' : '',
                i === 2 ? 'border-l-0 md:border-l' : '',
                i >= 2 ? 'border-t md:border-t-0' : '',
              ].join(' ')}
            >
              <dd
                className="relative text-4xl md:text-5xl font-bold leading-none flex items-baseline pb-2"
                style={{ color: EMBER, fontVariantNumeric: 'tabular-nums' }}
              >
                {s.static ? (
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{s.static}</span>
                ) : (
                  <AnimatedNumber value={s.value ?? 0} suffix={s.suffix ?? ''} />
                )}
                {s.extra && (
                  <span className="ml-1 text-base font-semibold text-fd-muted-foreground">
                    {s.extra}
                  </span>
                )}
                <motion.span
                  aria-hidden
                  variants={reduce ? undefined : drawUnderline}
                  className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full rounded-full origin-left"
                  style={{
                    transformOrigin: 'left',
                    scaleX: reduce ? 1 : undefined,
                    background: `linear-gradient(90deg, ${EMBER}, ${EMBER}00)`,
                    opacity: 0.5,
                  }}
                />
              </dd>
              <dt className="font-mono text-[11px] md:text-xs uppercase tracking-wider text-fd-muted-foreground">
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
