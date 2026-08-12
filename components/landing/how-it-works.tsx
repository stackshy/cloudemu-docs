'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { DUR, EASE, fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { SectionHeader } from '@/components/landing/section';

/**
 * HowItWorks — a boxless "three steps" explainer of the SDK-compat flow.
 *
 * Consistent with the deboxed ledger aesthetic: hairline rules, mono accents,
 * a single ember accent per element. A thin vertical connector on the left
 * draws itself (scaleY) as the section scrolls in, and a small ember dot
 * travels down the line in sync with the draw — a spark tracing the path.
 * Each step's number gently pops in on reveal as the spark passes. The steps
 * reveal in sequence via staggerContainer + fadeUp. Reduced motion renders the
 * final state with no transforms and no traveling dot.
 */

type Step = {
  title: string;
  desc: string;
  code: string;
  note?: string;
};

const steps: Step[] = [
  {
    title: 'start the server',
    desc: 'An in-memory backend behind a real HTTP server. No Docker, no accounts, no network.',
    code: 'ts := httptest.NewServer(awsserver.New(awsserver.Drivers{...}))',
  },
  {
    title: 'repoint the sdk',
    desc: 'Keep the real aws-sdk-go-v2 client. Change one field — where it sends requests.',
    code: 'o.BaseEndpoint = aws.String(ts.URL)',
    note: 'only the endpoint changes',
  },
  {
    title: 'run it — tests or app',
    desc: 'List buckets, launch VMs, read secrets. Your real code runs unchanged against the in-memory backend — in a test, or wired straight into your app. ~10ms per call.',
    code: 'go run .   # or go test ./...',
  },
];

/** Gentle scale-in "pop" for the numbered index, fired on the step's reveal. */
const numberPop: Variants = {
  hidden: { scale: 0.7 },
  show: { scale: [0.7, 1.06, 1], transition: { duration: DUR.base, ease: EASE } },
};

export function HowItWorks() {
  const reduce = useReducedMotion();

  // Measure the connector's drawn length so the ember dot can travel its
  // full pixel height (transform-only). Layout box is unaffected by scaleY,
  // so this reads the full track even while the line is still collapsed.
  const trackRef = useRef<HTMLSpanElement | null>(null);
  const [trackH, setTrackH] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setTrackH(el.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduce]);

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-20">
      <SectionHeader
        index="03"
        kicker="how it works"
        title="Three steps to a backend that lives in memory."
        lede="Start a server, repoint the SDK, run your code. Same result in a test or wired into your app."
        className="mb-12"
      />

      <motion.ol
        className="relative"
        variants={reduce ? undefined : staggerContainer(0.14)}
        initial={reduce ? undefined : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
      >
        {/* Self-drawing vertical connector. Sits at the center of the index
            column and grows top→down as the section scrolls into view. */}
        <motion.span
          ref={trackRef}
          aria-hidden
          className="absolute left-[17px] top-4 bottom-4 w-px bg-fd-border origin-top"
          initial={reduce ? undefined : { scaleY: 0 }}
          whileInView={reduce ? undefined : { scaleY: 1 }}
          viewport={viewportOnce}
          transition={reduce ? undefined : { duration: DUR.slow, ease: EASE }}
          style={reduce ? undefined : { scaleY: 0 }}
        />

        {/* Ember spark that traces the connector as it draws in. Rides behind
            the numbered circles, fading in at the top and out at the bottom. */}
        {!reduce && trackH > 0 ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-[17px] top-4 z-0 h-1.5 w-1.5 rounded-full bg-ember-500"
            style={{ x: '-50%', willChange: 'transform, opacity', boxShadow: '0 0 8px 1px rgba(255,107,44,0.35)' }}
            initial={{ y: 0, opacity: 0 }}
            whileInView={{
              y: [0, trackH * 0.1, trackH * 0.85, trackH],
              opacity: [0, 0.9, 0.9, 0],
            }}
            viewport={viewportOnce}
            transition={{ duration: DUR.slow, ease: EASE, times: [0, 0.1, 0.85, 1] }}
          />
        ) : null}

        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            className="relative grid grid-cols-[36px_1fr] gap-x-5 pb-12 last:pb-0"
            variants={reduce ? undefined : fadeUp()}
          >
            {/* Numbered ember index — gently pops in on the step's reveal. */}
            <motion.span
              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ember-500/40 bg-fd-background font-mono text-sm font-semibold text-ember-500"
              variants={reduce ? undefined : numberPop}
            >
              {i + 1}
            </motion.span>

            <div className="min-w-0 pt-1">
              <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">
                {step.desc}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <code className="inline-block max-w-full overflow-x-auto rounded-md border border-fd-border bg-fd-secondary px-2.5 py-1.5 font-mono text-xs text-fd-foreground whitespace-pre">
                  {step.code}
                </code>
                {step.note ? (
                  <span className="font-mono text-xs text-ember-500">{step.note}</span>
                ) : null}
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
