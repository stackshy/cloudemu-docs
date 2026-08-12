'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { AnimatedNumber } from '@/components/landing/animated-number';

/**
 * StatsBand: a boxless horizontal band just under the hero. Four real stats,
 * hairline top + bottom borders, thin vertical dividers between, big
 * ember-tinted numbers over small muted labels. Fades + staggers in on scroll.
 */

const EMBER = '#FF6B2C';

type Stat = { label: string; value?: number; suffix?: string; static?: string; extra?: string };

const stats: Stat[] = [
  { value: 48, label: 'in-memory services' },
  { value: 16, label: 'service categories' },
  { value: 3, extra: '+OCI', label: 'clouds (AWS · Azure · GCP)' },
  { static: '~10ms', label: 'per call' },
];

export function StatsBand() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full max-w-5xl mx-auto px-6">
      <motion.dl
        variants={reduce ? undefined : staggerContainer(0.1)}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
        className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-fd-border"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={reduce ? undefined : fadeUp(0, 16)}
            className={[
              'flex flex-col items-center text-center gap-1 py-8 px-4',
              'border-fd-border',
              i > 0 ? 'border-l' : '',
              i === 2 ? 'border-l-0 md:border-l' : '',
              i >= 2 ? 'border-t md:border-t-0' : '',
            ].join(' ')}
          >
            <dd
              className="text-4xl md:text-5xl font-bold leading-none flex items-baseline"
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
            </dd>
            <dt className="text-xs md:text-sm text-fd-muted-foreground">{s.label}</dt>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
}

export default StatsBand;
