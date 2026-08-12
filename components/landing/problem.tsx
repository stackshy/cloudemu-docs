'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { SectionHeader } from '@/components/landing/section';

/**
 * Problem — the opinionated narrative that opens the page.
 *
 * Not a card grid. An editorial spec sheet: three hairline-separated rows, one
 * per way people test cloud code today, each with a dry one-line verdict in the
 * right column. Closes with the line that sets up cloudemu's bet. Rows reveal in
 * sequence via staggerContainer + fadeUp; reduced motion renders static.
 */

type Option = {
  /** The approach, lowercase mono label. */
  name: string;
  /** One clause of extra context — what it actually is. */
  detail: string;
  /** The honest verdict — why it falls short. */
  verdict: string;
};

const options: Option[] = [
  {
    name: 'real cloud accounts',
    detail: 'the actual services, over the wire',
    verdict: 'Slow, costs money, needs credentials and a network. Flaky in CI.',
  },
  {
    name: 'docker emulators',
    detail: 'LocalStack and friends',
    verdict: 'Another daemon to run, heavyweight to start, partial fidelity when it matters.',
  },
  {
    name: 'hand-written mocks',
    detail: 'stubs you wrote yourself',
    verdict: 'They return exactly what you told them to, so they never catch the bug.',
  },
];

export function Problem() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-20">
      <SectionHeader
        index="01"
        kicker="the problem"
        title="Testing cloud code is a choice between bad options."
      />

      <motion.ul
        className="mt-12 border-t border-fd-border"
        variants={reduce ? undefined : staggerContainer(0.12)}
        initial={reduce ? undefined : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
      >
        {options.map((opt) => (
          <motion.li
            key={opt.name}
            className="grid grid-cols-1 gap-x-8 gap-y-2 border-b border-fd-border py-6 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-baseline"
            variants={reduce ? undefined : fadeUp()}
          >
            <div className="min-w-0">
              <h3 className="font-mono text-sm font-semibold tracking-tight text-fd-foreground">
                {opt.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-fd-muted-foreground/70">
                {opt.detail}
              </p>
            </div>
            <p className="text-base leading-relaxed text-fd-muted-foreground">
              {opt.verdict}
            </p>
          </motion.li>
        ))}
      </motion.ul>

      <motion.p
        className="mt-10 max-w-2xl text-lg leading-relaxed text-fd-foreground"
        initial={reduce ? undefined : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
        variants={reduce ? undefined : fadeUp(0.1)}
      >
        cloudemu makes a different bet: run the real SDK against an in-memory
        implementation that behaves like the real service.
      </motion.p>
    </section>
  );
}
