'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE, fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

/**
 * HowItWorks — a boxless "three steps" explainer of the SDK-compat flow.
 *
 * Consistent with the deboxed ledger aesthetic: hairline rules, mono accents,
 * a single ember accent per element. A thin vertical connector on the left
 * draws itself (scaleY) as the section scrolls in; the steps reveal in
 * sequence via staggerContainer + fadeUp. Reduced motion renders the final
 * state with no transforms.
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
    desc: 'Spin up an in-memory backend behind a real HTTP server — no Docker, no accounts, no network.',
    code: 'ts := httptest.NewServer(awsserver.New(awsserver.Drivers{...}))',
  },
  {
    title: 'repoint the sdk',
    desc: 'Keep the real aws-sdk-go-v2 client. Change one field: where it sends requests.',
    code: 'o.BaseEndpoint = aws.String(ts.URL)',
    note: 'only the endpoint changes',
  },
  {
    title: 'run it — tests or app',
    desc: 'Discover resources, launch VMs, perform actions — your real code runs unchanged against the in-memory backend, in a test or wired straight into your app. ~10ms per call.',
    code: 'go run .   # or go test ./...',
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">how it works</h2>
        <p className="mt-3 text-lg text-fd-muted-foreground">
          Three steps to point a real cloud SDK at an in-memory backend — in tests or your app.
        </p>
      </div>

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
          aria-hidden
          className="absolute left-[17px] top-4 bottom-4 w-px bg-fd-border origin-top"
          initial={reduce ? undefined : { scaleY: 0 }}
          whileInView={reduce ? undefined : { scaleY: 1 }}
          viewport={viewportOnce}
          transition={reduce ? undefined : { duration: DUR.slow, ease: EASE }}
          style={reduce ? undefined : { scaleY: 0 }}
        />

        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            className="relative grid grid-cols-[36px_1fr] gap-x-5 pb-12 last:pb-0"
            variants={reduce ? undefined : fadeUp()}
          >
            {/* Numbered ember index */}
            <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ember-500/40 bg-fd-background font-mono text-sm font-semibold text-ember-500">
              {i + 1}
            </span>

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
