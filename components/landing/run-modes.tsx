'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RUN_MODES } from '@/lib/product';
import { CopyButton } from '@/components/code/copy-button';
import { Leaf } from './primitives';
import { Reveal } from './reveal';

/* §5 — Running it (interactive: segmented switcher with sliding ember rail) */

/** Light comment-aware line coloring for the command panel. */
function CommandLines({ code }: { code: string }) {
  return (
    <>
      {code.split('\n').map((line, i) => {
        const isComment = /^\s*(#|\/\/)/.test(line);
        return (
          <span key={i} className={isComment ? 'text-ink-3' : 'text-ink-2'}>
            {line || ' '}
            {'\n'}
          </span>
        );
      })}
    </>
  );
}

export function RunModes() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const mode = RUN_MODES[active];

  return (
    <Leaf
      section="5"
      title="Running it"
      note={
        <>
          <span className="h">Three surfaces</span>
          One in-memory backend. Start in-process, graduate to a server, or run the image in CI.
        </>
      }
    >
      <Reveal>
        <h2 className="font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink text-balance">
          Wherever your tests live, <span className="italic font-medium text-accent">point them at it</span>.
        </h2>
        <p className="mt-4 max-w-[56ch] text-base leading-[1.65] text-ink-2">
          The same backend behind three surfaces. Pick the one that fits where your code already runs.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div role="tablist" aria-label="Run modes" className="mt-9 flex flex-wrap gap-6 border-b border-line">
          {RUN_MODES.map((m, i) => {
            const on = i === active;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className="relative -mb-px pb-3 pt-1 font-mono text-[13px] tracking-[0.02em] outline-none transition-colors"
              >
                <span className={on ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}>
                  <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>{' '}
                  {m.label}
                </span>
                {on && (
                  <motion.span
                    layoutId="runmode-rail"
                    className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-accent"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-b-[4px] border border-t-0 border-line bg-surface">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-3.5">
            <span className="font-serif text-[18px] font-medium text-ink">{mode.label}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
              {mode.languages} · surface {active + 1} / {RUN_MODES.length}
            </span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="max-w-[64ch] px-5 pb-1 pt-4 text-[15px] leading-[1.6] text-ink-2">{mode.blurb}</p>
              <div className="mt-3 flex items-center gap-2 border-t border-line bg-raised px-5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                <span className="rounded-[3px] border border-line-2 px-1.5 py-px">
                  {mode.lang === 'go' ? 'GO' : 'BASH'}
                </span>
                <span>{mode.lang === 'go' ? 'in-process test' : 'terminal'}</span>
                <CopyButton target={() => mode.command} className="ms-auto" />
              </div>
              <pre className="overflow-x-auto bg-raised px-5 py-4 font-mono text-[13px] leading-[1.75]">
                <code>
                  <CommandLines code={mode.command} />
                </code>
              </pre>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Leaf>
  );
}
