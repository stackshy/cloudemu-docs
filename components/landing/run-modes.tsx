'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { RUN_MODES } from '@/lib/product';
import { CodeWindow } from './code-window';

export function RunModes() {
  const reduce = useReducedMotion();
  const container = staggerContainer(0.08);
  const item = fadeUp(0, 14);

  return (
    <section className="w-full px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-2xl"
        >
          <span className="u-eyebrow">Three ways to run it</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-[2.25rem]">
            Wherever your tests live, point them at cloudemu.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            The same in-memory backend, three surfaces. Start in-process for fast Go tests,
            graduate to a standalone server for any language, or run the published Docker
            image in CI.
          </p>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : container}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {RUN_MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              variants={reduce ? undefined : item}
              className="group flex flex-col rounded-xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_14px_44px_-20px_rgba(255,107,44,0.35)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-ink-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                  {mode.languages}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-ink">{mode.label}</h3>
              <p className="u-eyebrow mb-3 mt-1">{mode.tagline}</p>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-ink-2">{mode.blurb}</p>
              <CodeWindow filename={mode.id} lang={mode.lang}>
                {mode.command}
              </CodeWindow>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
