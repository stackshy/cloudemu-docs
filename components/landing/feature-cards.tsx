'use client';

import { Reveal } from '@/components/reveal';

/**
 * Capability ledger: a full-width list on hairlines — no cards, no chrome.
 * Each entry is a row: mono capability name left, one tight sentence right.
 * The two lead capabilities carry a small inline glyph drawn directly on
 * the canvas. Reads like a man page.
 */

function MiniWire() {
  return (
    <svg viewBox="0 0 160 32" className="h-8 w-[160px]" aria-hidden>
      <path d="M 6 16 H 154" stroke="var(--border-2)" strokeOpacity="0.5" strokeWidth="1" />
      <rect x="-3" y="13" width="6" height="6" rx="1" fill="var(--text-3)">
        <animateMotion
          dur="2.8s"
          repeatCount="indefinite"
          path="M 6 16 H 154"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.3 0 0.7 1"
        />
      </rect>
      <circle cx="6" cy="16" r="2.5" fill="var(--bg)" stroke="var(--border-2)" strokeWidth="1.2" />
      <circle cx="154" cy="16" r="2.5" fill="var(--bg)" stroke="var(--border-2)" strokeWidth="1.2" />
    </svg>
  );
}

function MiniChaos() {
  const ticks = Array.from({ length: 12 }, (_, i) => 6 + i * 13.5);
  return (
    <svg viewBox="0 0 160 32" className="h-8 w-[160px]" aria-hidden>
      {ticks.map((x) => {
        const failing = x >= 60 && x <= 100;
        return (
          <line
            key={x}
            x1={x}
            y1={failing ? 14 : 8}
            x2={x}
            y2={24}
            stroke={failing ? 'var(--danger)' : 'var(--ok)'}
            strokeOpacity={failing ? 0.9 : 0.55}
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

const CAPABILITIES: {
  name: string;
  body: string;
  visual?: React.ReactNode;
}[] = [
  {
    name: 'real_sdks',
    body: 'aws-sdk-go-v2, azure-sdk-for-go, and cloud.google.com/go drive an in-memory backend over their actual wire protocols. Nothing to mock, no call sites to rewrite.',
    visual: <MiniWire />,
  },
  {
    name: 'chaos_engineering',
    body: 'Outages, latency spikes, probabilistic failures, throttling — in time-bounded windows. Your retry paths get exercised every run.',
    visual: <MiniChaos />,
  },
  {
    name: 'state_machines',
    body: 'VMs enforce real lifecycle transitions; illegal jumps return errors.',
  },
  {
    name: 'auto_metrics',
    body: 'Launching a VM pushes CPU, network, and disk metrics so alarms evaluate.',
  },
  {
    name: 'error_injection',
    body: 'Fail always, every Nth call, probabilistically, or the first N calls.',
  },
  {
    name: 'call_recording',
    body: 'Every call captured with inputs, outputs, errors, timing. Fluent asserts.',
  },
  {
    name: 'fake_clock',
    body: 'Deterministic TTL expiry, dedup windows, and alarm evaluation.',
  },
  {
    name: 'zero_deps',
    body: 'Pure Go standard library. Works anywhere Go runs.',
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
            {CAPABILITIES.map((c, i) => (
              <li
                key={c.name}
                className={`group grid grid-cols-1 items-center gap-x-8 gap-y-2 border-b border-line md:grid-cols-[280px_1fr_auto] ${
                  c.visual ? 'py-6' : 'py-4'
                }`}
              >
                <span className="font-mono text-[13px] text-ink-2 transition-colors group-hover:text-ink">
                  {c.name}
                </span>
                <p className="text-sm leading-relaxed text-ink-2 transition-colors group-hover:text-ink">
                  {c.body}
                </p>
                {c.visual && (
                  <span className="hidden justify-self-end md:block">
                    {c.visual}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
