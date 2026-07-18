'use client';

import { Reveal } from '@/components/reveal';

/**
 * Capability ledger: a full-width list on hairlines — no cards, no chrome.
 * Every row carries a small inline glyph drawn directly on the canvas,
 * animated slowly via SMIL. Glyphs are decorative (aria-hidden) and hidden
 * under prefers-reduced-motion. All share the 160×32 stage, hairline
 * strokes, and semantic colors only (--ok, --danger, neutrals).
 */

const G = { w: 160, h: 32, mid: 16 };

/* 01 — packet traveling the wire, sdk → cloudemu */
function GlyphWire() {
  return (
    <svg viewBox={`0 0 ${G.w} ${G.h}`} className="h-8 w-[160px]" aria-hidden>
      <line x1="6" y1={G.mid} x2="154" y2={G.mid} stroke="var(--border-2)" strokeWidth="1" />
      <circle cx="6" cy={G.mid} r="2.5" fill="var(--bg)" stroke="var(--border-2)" strokeWidth="1.2" />
      <circle cx="154" cy={G.mid} r="2.5" fill="var(--bg)" stroke="var(--border-2)" strokeWidth="1.2" />
      <rect x="-3" y="-2.5" width="6" height="5" rx="1" fill="var(--text-3)">
        <animateMotion
          dur="2.8s"
          repeatCount="indefinite"
          path={`M 6 ${G.mid} H 154`}
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.3 0 0.7 1"
        />
      </rect>
    </svg>
  );
}

/* 02 — request ticks; the failure window pulses */
function GlyphChaos() {
  const ticks = Array.from({ length: 12 }, (_, i) => 6 + i * 13.5);
  return (
    <svg viewBox={`0 0 ${G.w} ${G.h}`} className="h-8 w-[160px]" aria-hidden>
      {ticks.map((x) => {
        const failing = x >= 60 && x <= 100;
        return (
          <line
            key={x}
            x1={x}
            y1={failing ? 13 : 9}
            x2={x}
            y2={23}
            stroke={failing ? 'var(--danger)' : 'var(--ok)'}
            strokeOpacity={failing ? 0.9 : 0.5}
            strokeWidth="2"
            strokeLinecap="round"
          >
            {failing && (
              <animate
                attributeName="stroke-opacity"
                values="0.9;0.35;0.9"
                dur="2.6s"
                repeatCount="indefinite"
              />
            )}
          </line>
        );
      })}
    </svg>
  );
}

/* 03 — a token stepping through lifecycle states */
function GlyphStates() {
  const xs = [20, 80, 140];
  return (
    <svg viewBox={`0 0 ${G.w} ${G.h}`} className="h-8 w-[160px]" aria-hidden>
      <line x1={xs[0]} y1={G.mid} x2={xs[2]} y2={G.mid} stroke="var(--border-2)" strokeWidth="1" />
      {xs.map((x) => (
        <circle key={x} cx={x} cy={G.mid} r="4" fill="var(--bg)" stroke="var(--border-2)" strokeWidth="1.2" />
      ))}
      <circle r="2.2" fill="var(--text-2)">
        <animate
          attributeName="cx"
          values={`${xs[0]};${xs[0]};${xs[1]};${xs[1]};${xs[2]};${xs[2]};${xs[0]}`}
          keyTimes="0;0.3;0.35;0.62;0.67;0.95;1"
          calcMode="discrete"
          dur="4.5s"
          repeatCount="indefinite"
        />
        <animate attributeName="cy" values={`${G.mid}`} dur="4.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* 04 — metric bars rising as instances launch */
function GlyphMetrics() {
  const bars = [30, 55, 80, 105, 130];
  return (
    <svg viewBox={`0 0 ${G.w} ${G.h}`} className="h-8 w-[160px]" aria-hidden>
      <line x1="18" y1="26" x2="142" y2="26" stroke="var(--border-2)" strokeWidth="1" />
      {bars.map((x, i) => (
        <line
          key={x}
          x1={x}
          y1="26"
          x2={x}
          y2="12"
          stroke="var(--text-3)"
          strokeOpacity="0.7"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <animate
            attributeName="y2"
            values="24;10;24"
            dur="3.2s"
            begin={`${i * 0.35}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          />
        </line>
      ))}
    </svg>
  );
}

/* 05 — steady calls; every Nth flashes as an injected failure */
function GlyphInjection() {
  const dots = Array.from({ length: 8 }, (_, i) => 14 + i * 19);
  return (
    <svg viewBox={`0 0 ${G.w} ${G.h}`} className="h-8 w-[160px]" aria-hidden>
      {dots.map((x, i) => {
        const injected = i === 2 || i === 5;
        return (
          <circle
            key={x}
            cx={x}
            cy={G.mid}
            r="2.5"
            fill={injected ? 'var(--danger)' : 'var(--text-3)'}
            fillOpacity={injected ? 1 : 0.6}
          >
            {injected && (
              <animate
                attributeName="fill-opacity"
                values="1;0.2;1"
                dur="2.2s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        );
      })}
    </svg>
  );
}

/* 06 — recording: rec dot + call lines appearing in sequence */
function GlyphRecording() {
  const rows = [10, 16, 22];
  return (
    <svg viewBox={`0 0 ${G.w} ${G.h}`} className="h-8 w-[160px]" aria-hidden>
      <circle cx="14" cy={G.mid} r="3" fill="var(--danger)" fillOpacity="0.85">
        <animate attributeName="fill-opacity" values="0.85;0.3;0.85" dur="2s" repeatCount="indefinite" />
      </circle>
      {rows.map((y, i) => (
        <line
          key={y}
          x1="30"
          y1={y}
          x2={i === 1 ? 140 : 110 + i * 12}
          y2={y}
          stroke="var(--text-3)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-opacity"
            values="0;0.6;0.6;0"
            keyTimes="0;0.15;0.85;1"
            dur="3.6s"
            begin={`${i * 0.5}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
    </svg>
  );
}

/* 07 — fake clock: a hand advancing in discrete steps */
function GlyphClock() {
  return (
    <svg viewBox={`0 0 ${G.w} ${G.h}`} className="h-8 w-[160px]" aria-hidden>
      <circle cx="80" cy={G.mid} r="11" fill="none" stroke="var(--border-2)" strokeWidth="1.2" />
      <line x1="80" y1={G.mid} x2="80" y2="8" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 80 16;90 80 16;180 80 16;270 80 16;360 80 16"
          calcMode="discrete"
          dur="4s"
          repeatCount="indefinite"
        />
      </line>
      <circle cx="80" cy={G.mid} r="1.5" fill="var(--text-2)" />
    </svg>
  );
}

/* 08 — zero deps: one lone module, breathing */
function GlyphZeroDeps() {
  return (
    <svg viewBox={`0 0 ${G.w} ${G.h}`} className="h-8 w-[160px]" aria-hidden>
      <rect x="72" y="8" width="16" height="16" rx="3" fill="none" stroke="var(--text-3)" strokeWidth="1.2">
        <animate attributeName="stroke-opacity" values="1;0.4;1" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <text x="98" y="20" fontSize="8" fontFamily="var(--font-mono)" fill="var(--text-3)">
        stdlib
      </text>
    </svg>
  );
}

const CAPABILITIES: {
  name: string;
  body: string;
  visual: React.ReactNode;
  lead?: boolean;
}[] = [
  {
    name: 'real_sdks',
    body: 'aws-sdk-go-v2, azure-sdk-for-go, and cloud.google.com/go drive an in-memory backend over their actual wire protocols. Nothing to mock, no call sites to rewrite.',
    visual: <GlyphWire />,
    lead: true,
  },
  {
    name: 'chaos_engineering',
    body: 'Outages, latency spikes, probabilistic failures, throttling — in time-bounded windows. Your retry paths get exercised every run.',
    visual: <GlyphChaos />,
    lead: true,
  },
  {
    name: 'state_machines',
    body: 'VMs enforce real lifecycle transitions; illegal jumps return errors.',
    visual: <GlyphStates />,
  },
  {
    name: 'auto_metrics',
    body: 'Launching a VM pushes CPU, network, and disk metrics so alarms evaluate.',
    visual: <GlyphMetrics />,
  },
  {
    name: 'error_injection',
    body: 'Fail always, every Nth call, probabilistically, or the first N calls.',
    visual: <GlyphInjection />,
  },
  {
    name: 'call_recording',
    body: 'Every call captured with inputs, outputs, errors, timing. Fluent asserts.',
    visual: <GlyphRecording />,
  },
  {
    name: 'fake_clock',
    body: 'Deterministic TTL expiry, dedup windows, and alarm evaluation.',
    visual: <GlyphClock />,
  },
  {
    name: 'zero_deps',
    body: 'Pure Go standard library. Works anywhere Go runs.',
    visual: <GlyphZeroDeps />,
  },
];

export function FeatureCards() {
  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-ink-3">03</span> · beyond basic mocks
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
            Behavior, not stubs.
          </h2>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-ink-2">
            Mocks return what you tell them to. cloudemu misbehaves like the
            real thing — lifecycle rules, throttling, injected outages, clock
            skew.
          </p>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <ul className="border-t border-line">
            {CAPABILITIES.map((c) => (
              <li
                key={c.name}
                className={`group grid grid-cols-1 items-center gap-x-8 gap-y-2 border-b border-line md:grid-cols-[280px_1fr_160px] ${
                  c.lead ? 'py-6' : 'py-4'
                }`}
              >
                <span className="font-mono text-[13px] text-ink-2 transition-colors group-hover:text-ink">
                  {c.name}
                </span>
                <p className="text-sm leading-relaxed text-ink-2 transition-colors group-hover:text-ink">
                  {c.body}
                </p>
                <span className="hidden justify-self-end opacity-70 transition-opacity group-hover:opacity-100 md:block motion-reduce:md:hidden">
                  {c.visual}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
