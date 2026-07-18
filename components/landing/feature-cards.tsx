'use client';

import { Reveal } from '@/components/reveal';

/**
 * Feature grid with real hierarchy: two large cards with small live visuals
 * (mini packet wire; mini chaos timeline), then six compact mono-titled cards.
 */

function MiniWire() {
  return (
    <svg viewBox="0 0 220 40" className="h-10 w-full" aria-hidden>
      <path
        d="M 8 20 H 212"
        stroke="var(--accent)"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <rect x="-3" y="17" width="6" height="6" rx="1" fill="var(--accent)">
        <animateMotion
          dur="2.8s"
          repeatCount="indefinite"
          path="M 8 20 H 212"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.3 0 0.7 1"
        />
      </rect>
      <circle cx="8" cy="20" r="3" fill="var(--bg-raised)" stroke="var(--accent)" strokeWidth="1.2" />
      <circle cx="212" cy="20" r="3" fill="var(--bg-raised)" stroke="var(--accent)" strokeWidth="1.2" />
      <text x="8" y="34" fontSize="7" className="font-mono" fill="var(--text-muted)">
        sdk
      </text>
      <text x="212" y="34" fontSize="7" textAnchor="end" className="font-mono" fill="var(--text-muted)">
        cloudemu
      </text>
    </svg>
  );
}

function MiniChaos() {
  const ticks = Array.from({ length: 12 }, (_, i) => 10 + i * 18.5);
  return (
    <svg viewBox="0 0 220 40" className="h-10 w-full" aria-hidden>
      <rect x="88" y="4" width="52" height="26" rx="3" fill="var(--error-dim)" />
      <line x1="6" y1="30" x2="214" y2="30" stroke="var(--border-strong)" strokeWidth="1" />
      {ticks.map((x) => {
        const failing = x >= 88 && x <= 140;
        return (
          <line
            key={x}
            x1={x}
            y1={failing ? 18 : 12}
            x2={x}
            y2={30}
            stroke={failing ? 'var(--error)' : 'var(--ok)'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

const HERO_FEATURES = [
  {
    title: 'Real cloud SDKs, unchanged',
    body: 'aws-sdk-go-v2, azure-sdk-for-go, and cloud.google.com/go drive an in-memory backend over their actual wire protocols. Nothing to mock, no call sites to rewrite.',
    visual: <MiniWire />,
  },
  {
    title: 'Chaos engineering',
    body: 'Inject outages, latency spikes, probabilistic failures, and throttling in time-bounded windows — retry and timeout paths get exercised every run.',
    visual: <MiniChaos />,
  },
];

const COMPACT_FEATURES = [
  {
    title: 'state_machines',
    body: 'VMs enforce real lifecycle transitions; illegal jumps return errors.',
  },
  {
    title: 'auto_metrics',
    body: 'Launching a VM pushes CPU/network/disk metrics so alarms evaluate.',
  },
  {
    title: 'error_injection',
    body: 'Fail always, every Nth call, probabilistically, or the first N calls.',
  },
  {
    title: 'call_recording',
    body: 'Every call captured with inputs, outputs, errors, timing. Fluent asserts.',
  },
  {
    title: 'fake_clock',
    body: 'Deterministic TTL, dedup windows, and alarm evaluation.',
  },
  {
    title: 'zero_deps',
    body: 'Pure Go standard library. Works anywhere Go runs.',
  },
];

export function FeatureCards() {
  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-signal">03</span> · beyond basic mocks
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
            Behavior, not stubs.
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {HERO_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="rounded-lg border border-line bg-surface p-6 transition-colors hover:border-line-strong">
                <div className="mb-5 rounded-md border border-line bg-base px-3 py-2">
                  {f.visual}
                </div>
                <h3 className="text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPACT_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 40}>
              <div className="h-full rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong">
                <h3 className="font-mono text-xs font-medium tracking-[0.06em] text-signal">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
