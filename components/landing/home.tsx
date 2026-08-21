'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { PRODUCT, STATS, RUN_MODES } from '@/lib/product';
import { HeroEmblem } from './hero-emblem';
import { LiveConsole } from './live-console';
import { CopyButton } from '@/components/code/copy-button';

/* ================================================================== */
/* Primitives — the Field Manual's shared furniture                    */
/* ================================================================== */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Same element in every case (no hydration mismatch). Reduced motion starts
  // fully visible so content is never left faded.
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** A manual page: outer marginalia column (§ signature + note) beside the body. */
function Leaf({
  section,
  title,
  note,
  children,
  last,
}: {
  section: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <section className={last ? '' : 'border-b border-line'}>
      <div className="mx-auto grid max-w-[1180px] gap-5 px-5 py-16 sm:gap-11 sm:px-10 sm:py-24 md:grid-cols-[120px_minmax(0,1fr)]">
        <aside className="flex gap-6 md:block">
          <div className="u-sig">
            <b>§ {section}</b>
            {title}
          </div>
          {note && <div className="u-marginnote mt-0 max-w-[24ch] md:mt-5 md:border-t md:border-line md:pt-3.5">{note}</div>}
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3 ${className ?? ''}`}>
      {children}
    </span>
  );
}

function BtnPrimary({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-[3px] bg-accent px-5 py-3 font-mono text-[13px] font-semibold uppercase tracking-[0.03em] text-accent-ink transition-transform hover:-translate-y-px"
    >
      {children}
    </Link>
  );
}

function LinkArrow({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="border-b border-line-2 pb-[3px] font-mono text-[13px] uppercase tracking-[0.03em] text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </Link>
  );
}

/* ================================================================== */
/* Sub-rail — the manual's running header line                         */
/* ================================================================== */

function SubRail() {
  return (
    <div className="border-b border-line bg-surface/40">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-5 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3 sm:px-10">
        <span>Field Manual · Rev 2.0</span>
        <span className="hidden sm:inline">The Cloud, In Memory</span>
        <span>{PRODUCT.license}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* §1 — Title spread                                                   */
/* ================================================================== */

function Hero() {
  return (
    <Leaf
      section="1"
      title="Overview"
      note={
        <>
          <span className="h">Note</span>
          No accounts. No network. No daemon. The in-process library is standard-library only.
        </>
      }
    >
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        <div className="min-w-0">
          <Reveal>
            <Label>A real cloud emulator · any language</Label>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-serif mt-3 text-[clamp(46px,8vw,100px)] font-semibold leading-[0.92] tracking-[-0.025em] text-ink text-balance">
              The cloud,
              <br />
              in <span className="italic font-medium text-accent">memory</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-serif mt-6 max-w-[24ch] text-[clamp(19px,2.3vw,26px)] font-normal leading-[1.4] text-ink-2 text-pretty">
              A real emulator of AWS, Azure &amp; GCP you point real code at — and it answers from RAM.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="u-drop mt-6 max-w-[58ch] text-[16.5px] leading-[1.68] text-ink-2">
              Change one line — the endpoint — and your app, SDK, or CLI runs against a full cloud that
              lives entirely in memory. Every call returns in <b className="font-semibold text-ink">~10&nbsp;ms</b>.
              One call resets it clean. It behaves like the real service, so the bugs your hand-written
              mocks never catch, this one does.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <BtnPrimary href="/docs/quick-start">Get started →</BtnPrimary>
              <LinkArrow href="/docs">Read the manual</LinkArrow>
              <Label>Go {PRODUCT.goVersion}+</Label>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="hidden lg:block">
          <HeroEmblem />
        </Reveal>
      </div>
    </Leaf>
  );
}

/* ================================================================== */
/* §2 — Try a call (live console)                                      */
/* ================================================================== */

function ConsoleSection() {
  return (
    <Leaf
      section="2"
      title="Try it"
      note={
        <>
          <span className="h">Live</span>
          Pick a cloud, run a command, watch it answer. Same flow as the real endpoints.
        </>
      }
    >
      <Reveal>
        <h2 className="font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink text-balance">
          Point a CLI at it and <span className="italic font-medium text-accent">get an answer</span>.
        </h2>
        <p className="mt-4 max-w-[56ch] text-base leading-[1.65] text-ink-2">
          No install needed to feel it — click a command and watch the emulated cloud respond in
          single-digit milliseconds. Reset wipes it clean, exactly like the real thing.
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="mt-8">
          <LiveConsole />
        </div>
      </Reveal>
    </Leaf>
  );
}

/* ================================================================== */
/* §3 — Coverage plate                                                 */
/* ================================================================== */

type Glyph = 'full' | 'ring' | 'none';
const COVERAGE: [string, string, Glyph, Glyph, Glyph][] = [
  ['Storage', 'object · blob · buckets', 'full', 'full', 'full'],
  ['Compute', 'vms · instances', 'full', 'full', 'full'],
  ['Database', 'key-value · document', 'full', 'full', 'full'],
  ['Relational DB', 'rds · sql · cloudsql', 'full', 'full', 'ring'],
  ['Serverless', 'functions', 'full', 'full', 'full'],
  ['Kubernetes', 'eks · aks · gke + data plane', 'full', 'full', 'full'],
  ['Networking', 'vpc · vnet', 'full', 'full', 'full'],
  ['Message Queue', 'sqs · service bus · pubsub', 'full', 'full', 'full'],
  ['Secrets', 'secrets manager · key vault', 'full', 'full', 'full'],
  ['IAM', 'policies · roles', 'full', 'full', 'full'],
  ['AI / ML', 'bedrock · azure ai · vertex', 'full', 'full', 'ring'],
  ['Event Bus', 'eventbridge · grid · arc', 'full', 'full', 'full'],
  ['Container Registry', 'ecr · acr · artifact', 'full', 'full', 'full'],
  ['Resource Discovery', 'explorer · graph · asset', 'full', 'ring', 'ring'],
];

function G({ kind }: { kind: Glyph }) {
  if (kind === 'full')
    return <span className="inline-block h-[11px] w-[11px] rounded-full bg-accent align-middle" />;
  if (kind === 'ring')
    return <span className="inline-block h-[11px] w-[11px] rounded-full border-[1.5px] border-ink-3 align-middle" />;
  return <span className="inline-block h-[1.5px] w-[9px] bg-line-2 align-middle" />;
}

const PROVIDERS = ['AWS', 'Azure', 'GCP'] as const;

function CoveragePlate() {
  // focus a cloud's column on hover/focus — others dim.
  const [focus, setFocus] = useState<number | null>(null);
  const fullCounts = [0, 1, 2].map((ci) => COVERAGE.filter((r) => r[2 + ci] === 'full').length);
  const colDim = (ci: number) => (focus === null || focus === ci ? 'opacity-100' : 'opacity-25');

  return (
    <Leaf
      section="3"
      title="Coverage"
      note={
        <>
          <span className="h">Legend</span>
          Filled = SDK-compatible over the wire. Ring = in-process Go API. Rule = not yet. Hover a cloud to focus it.
        </>
      }
    >
      <Reveal>
        <h2 className="font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink text-balance">
          What is <span className="italic font-medium text-accent">resident</span> in memory.
        </h2>
        <p className="mt-4 max-w-[56ch] text-base leading-[1.65] text-ink-2">
          Coverage stated as a parts list, not a marketing number. Every cell traces to a shipped
          handler — nothing is hand-waved.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-8 overflow-hidden rounded-[4px] border border-line-2 bg-surface">
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-[18px] py-3">
            <span className="font-serif text-[17px] italic text-ink">Plate II — Service map</span>
            <span className="font-mono text-xs text-ink-3">
              {focus === null ? (
                <>
                  <b className="text-accent">{STATS.sdkCompatServices}</b> services ·{' '}
                  <b className="text-accent">{STATS.clouds}</b> clouds · <b className="text-accent">0</b> accounts
                </>
              ) : (
                <>
                  <b className="text-accent">{fullCounts[focus]}</b> SDK-compatible domains in{' '}
                  <b className="text-ink">{PROVIDERS[focus]}</b>
                </>
              )}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-line-2 px-[18px] py-3 text-left font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-3">
                    Domain
                  </th>
                  {PROVIDERS.map((p, ci) => (
                    <th
                      key={p}
                      onMouseEnter={() => setFocus(ci)}
                      onMouseLeave={() => setFocus(null)}
                      onFocus={() => setFocus(ci)}
                      onBlur={() => setFocus(null)}
                      tabIndex={0}
                      className={`w-[88px] cursor-default border-b border-line-2 px-2 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.12em] outline-none transition-colors ${
                        focus === ci ? 'text-accent' : 'text-ink-3'
                      }`}
                      style={focus === ci ? { boxShadow: 'inset 0 -2px 0 var(--accent)' } : undefined}
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COVERAGE.map(([dom, sub, a, b, c], i) => (
                  <tr key={dom} className={`group ${i % 2 ? '' : 'bg-raised/40'} transition-colors hover:bg-accent/[0.06]`}>
                    <td className="border-b border-line px-[18px] py-[11px]">
                      <div className="font-serif text-[15px] font-medium text-ink transition-colors group-hover:text-accent">
                        {dom}
                      </div>
                      <div className="font-mono text-[11px] tracking-[0.02em] text-ink-3">{sub}</div>
                    </td>
                    {[a, b, c].map((k, ci) => (
                      <td key={ci} className={`border-b border-line text-center transition-opacity duration-200 ${colDim(ci)}`}>
                        <G kind={k} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-[22px] border-t border-line px-[18px] py-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink-3"><G kind="full" /> SDK-compatible</span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink-3"><G kind="ring" /> in-process Go API</span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink-3"><G kind="none" /> not yet</span>
          </div>
        </div>
      </Reveal>
    </Leaf>
  );
}

/* ================================================================== */
/* §4 — Behaviors                                                      */
/* ================================================================== */

type Viz = 'chaos' | 'state' | 'err' | 'wave' | 'clock' | 'check';
const BEHAVIORS: [string, string, string, string, Viz][] = [
  ['3.1', 'Chaos engineering', 'chaos', 'Schedule outages, latency spikes, and throttling inside real time windows. Backoff code runs for real, every test.', 'chaos'],
  ['3.2', 'State machines', 'lifecycle', 'VMs walk pending → running → stopping → stopped. Start a terminated instance and you get an error, not a shrug.', 'state'],
  ['3.3', 'Error injection', 'probabilistic', 'Fail every call, every Nth, the first N, or at a fixed probability — scoped to one operation or a whole service.', 'err'],
  ['3.4', 'Recording & replay', 'fluent', 'Every call is recorded — inputs, outputs, timing — then asserted against with a fluent API. No spies to wire up.', 'wave'],
  ['3.5', 'Fake clock', 'deterministic', 'A clock you advance by hand. TTL expiry, dedup windows, and alarms fire on command, not on wall time.', 'clock'],
  ['3.6', 'Zero dependencies', 'stdlib', 'The in-process library is standard-library only. Runs anywhere your suite already runs.', 'check'],
];

function Spark({ kind }: { kind: Viz }) {
  const EM = 'var(--accent)';
  const props = { width: 120, height: 44, viewBox: '0 0 120 44', fill: 'none', 'aria-hidden': true } as const;
  if (kind === 'chaos') {
    const pts: string[] = [];
    for (let x = 0; x <= 120; x += 6) {
      const sp = x > 66 && x < 96 ? 14 * Math.exp(-Math.pow((x - 81) / 8, 2)) : 0;
      pts.push(`${x},${(26 - Math.sin(x / 8) * 2 - sp).toFixed(1)}`);
    }
    return (
      <svg {...props} className="text-ink-3">
        <rect x="66" y="4" width="30" height="36" fill="var(--accent-bg)" />
        <polyline points={pts.join(' ')} fill="none" stroke={EM} strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === 'state')
    return (
      <svg {...props} className="text-ink-3">
        {[16, 60, 104].map((x, i) => (
          <g key={x}>
            {i < 2 && <line x1={x + 8} y1="22" x2={x + 36} y2="22" stroke="currentColor" strokeOpacity="0.4" />}
            <circle cx={x} cy="22" r="8" fill={i === 1 ? EM : 'none'} stroke={i === 1 ? EM : 'currentColor'} strokeOpacity={i === 1 ? 1 : 0.5} strokeWidth="1.4" />
          </g>
        ))}
      </svg>
    );
  if (kind === 'err')
    return (
      <svg {...props} className="text-ink-3">
        {Array.from({ length: 30 }).map((_, i) => {
          const r = Math.floor(i / 10), c = i % 10, hot = i % 7 === 0;
          return <circle key={i} cx={8 + c * 12} cy={8 + r * 14} r="2.6" fill={hot ? EM : 'currentColor'} fillOpacity={hot ? 1 : 0.3} />;
        })}
      </svg>
    );
  if (kind === 'wave')
    return (
      <svg {...props} className="text-ink-3">
        <circle cx="8" cy="22" r="3" fill={EM} />
        {[16, 22, 28].map((y, i) => <line key={y} x1="20" y1={y} x2={112 - i * 16} y2={y} stroke="currentColor" strokeOpacity="0.4" />)}
      </svg>
    );
  if (kind === 'clock')
    return (
      <svg {...props} className="text-ink-3">
        <circle cx="22" cy="22" r="13" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" />
        <line x1="22" y1="22" x2="22" y2="13" stroke={EM} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="22" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <text x="44" y="26" fontFamily="var(--font-mono)" fontSize="9" fill="currentColor" fillOpacity="0.6">+24h</text>
      </svg>
    );
  return (
    <svg {...props} className="text-ink-3">
      <rect x="44" y="14" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <path d="M48 22 l3 3 l5 -6" fill="none" stroke={EM} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="66" y="26" fontFamily="var(--font-mono)" fontSize="9" fill="currentColor" fillOpacity="0.6">stdlib</text>
    </svg>
  );
}

function Behaviors() {
  return (
    <Leaf
      section="4"
      title="Behaviors"
      note={
        <>
          <span className="h">On mocks</span>
          A mock returns what you told it to, so it never catches the bug. These do.
        </>
      }
    >
      <Reveal>
        <h2 className="font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink text-balance">
          Not a mock. A cloud you can <span className="italic font-medium text-accent">push until it breaks</span>.
        </h2>
        <p className="mt-4 max-w-[56ch] text-base leading-[1.65] text-ink-2">
          It enforces lifecycle, throttles under load, injects outages, and bends time — the failure
          paths your retries otherwise never run.
        </p>
      </Reveal>
      <div className="mt-8">
        {BEHAVIORS.map(([no, name, tag, desc, viz], i) => (
          <Reveal key={no} delay={i * 0.04}>
            <div className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-t border-line py-6 last:border-b sm:grid-cols-[58px_minmax(0,1fr)_132px] sm:gap-x-8">
              <div className="pt-0.5 font-mono text-[13px] font-bold text-accent">{no}</div>
              <div>
                <h3 className="font-serif text-[20px] font-semibold leading-tight tracking-[-0.01em] text-ink">
                  {name}
                  <span className="ml-2 font-mono text-xs font-medium text-ink-3">{tag}</span>
                </h3>
                <p className="mt-1 max-w-[54ch] text-[15px] leading-[1.6] text-ink-2">{desc}</p>
              </div>
              <div className="hidden justify-end sm:flex"><Spark kind={viz} /></div>
            </div>
          </Reveal>
        ))}
      </div>
    </Leaf>
  );
}

/* ================================================================== */
/* §5 — Running it                                                     */
/* ================================================================== */

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

function RunModes() {
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
        {/* segmented control — sliding ember indicator */}
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

        {/* one full-width panel — code has room, no clipping */}
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
              <p className="max-w-[64ch] px-5 pb-1 pt-4 text-[15px] leading-[1.6] text-ink-2">
                {mode.blurb}
              </p>
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

/* ================================================================== */
/* Colophon (CTA)                                                      */
/* ================================================================== */

function Colophon() {
  return (
    <section>
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10 sm:py-24">
        <Reveal>
          <div className="relative rounded-[4px] border-[3px] border-double border-line-2 bg-surface px-6 py-10 text-center sm:px-12 sm:py-14">
            <span className="u-cross" style={{ top: 14, left: 14 }} />
            <span className="u-cross" style={{ bottom: 14, right: 14 }} />
            <Label className="text-accent">Colophon · Power on</Label>
            <h2 className="font-serif mx-auto mt-4 max-w-[16ch] text-[clamp(30px,5vw,58px)] font-semibold leading-none tracking-[-0.025em] text-ink text-balance">
              Bring a cloud up in <span className="italic text-accent">one line</span>.
            </h2>
            <p className="mx-auto mb-7 mt-3 max-w-[48ch] text-ink-2">
              Point your existing tests at it today — no credentials, no network, no cleanup. A clean
              cloud on every run.
            </p>
            <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-[3px] border border-line-2 bg-raised py-2 pl-4 pr-2 font-mono text-[13.5px]">
              <span className="text-accent">$</span>
              <span>{PRODUCT.install}</span>
              <CopyButton target={() => PRODUCT.install} />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <BtnPrimary href="/docs/quick-start">Quick start →</BtnPrimary>
              <LinkArrow href={PRODUCT.repo}>★ GitHub</LinkArrow>
              <Label>docker · in-process · standalone</Label>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Footer                                                              */
/* ================================================================== */

function Foot() {
  const { aws, azure, gcp, kubernetes } = PRODUCT.ports;
  return (
    <footer className="mx-auto max-w-[1180px] px-5 pb-16 pt-6 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-double border-line-2 pt-5 font-mono text-[11px] tracking-[0.04em] text-ink-3">
        <span>cloudemu — the cloud, in memory</span>
        <span className="hidden md:inline">
          AWS :{aws} · AZURE :{azure} · GCP :{gcp} · K8S :{kubernetes}
        </span>
        <span>{PRODUCT.license} · Rev 2.0</span>
      </div>
    </footer>
  );
}

/* ================================================================== */
/* Compose                                                             */
/* ================================================================== */

export function Home() {
  return (
    <main className="w-full">
      <SubRail />
      <Hero />
      <ConsoleSection />
      <CoveragePlate />
      <Behaviors />
      <RunModes />
      <Colophon />
      <Foot />
    </main>
  );
}

export default Home;
