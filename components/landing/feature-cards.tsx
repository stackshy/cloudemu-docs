'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * FeatureCards: the eight behaviors that separate cloudemu from a dumb mock,
 * rendered as a clean monospace ledger — key · description · a small inline
 * visual — instead of boxed cards. Rows stagger in on scroll.
 */

const EMBER = '#FF6B2C';

type VizKind =
  | 'slider' | 'bars' | 'nodes' | 'barchart'
  | 'dots' | 'wave' | 'clock' | 'check';

const features: { key: string; desc: string; viz: VizKind }[] = [
  {
    key: 'real_sdks',
    desc: 'aws-sdk-go-v2, azure-sdk-for-go, and cloud.google.com/go drive an in-memory backend over their actual wire protocols. Nothing to mock, no call sites to rewrite.',
    viz: 'slider',
  },
  {
    key: 'chaos_engineering',
    desc: 'Outages, latency spikes, probabilistic failures, throttling — in time-bounded windows. Your retry paths get exercised every run.',
    viz: 'bars',
  },
  {
    key: 'state_machines',
    desc: 'VMs enforce real lifecycle transitions; illegal jumps return errors.',
    viz: 'nodes',
  },
  {
    key: 'auto_metrics',
    desc: 'Launching a VM pushes CPU, network, and disk metrics so alarms evaluate.',
    viz: 'barchart',
  },
  {
    key: 'error_injection',
    desc: 'Fail always, every Nth call, probabilistically, or the first N calls.',
    viz: 'dots',
  },
  {
    key: 'call_recording',
    desc: 'Every call captured with inputs, outputs, errors, timing. Fluent asserts.',
    viz: 'wave',
  },
  {
    key: 'fake_clock',
    desc: 'Deterministic TTL expiry, dedup windows, and alarm evaluation.',
    viz: 'clock',
  },
  {
    key: 'zero_deps',
    desc: 'Pure Go standard library. Works anywhere Go runs.',
    viz: 'check',
  },
];

export function FeatureCards() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const row: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-20">
      <div className="mb-4 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight">Beyond basic mocks</h2>
        <p className="mt-2 text-fd-muted-foreground">
          Mocks return what you tell them to. cloudemu misbehaves like the real thing — lifecycle
          rules, throttling, injected outages, clock skew.
        </p>
      </div>

      <motion.div
        variants={reduce ? undefined : container}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.15 }}
        className="border-b border-fd-border"
      >
        {features.map((f) => (
          <motion.div
            key={f.key}
            variants={reduce ? undefined : row}
            className="group grid grid-cols-[1fr_auto] md:grid-cols-[190px_1fr_120px] items-center gap-x-6 gap-y-1 py-5 border-t border-fd-border"
          >
            <span className="font-mono text-sm text-fd-foreground/90 col-start-1">
              {f.key}
            </span>
            <p className="text-sm text-fd-muted-foreground leading-relaxed col-span-2 md:col-span-1 md:col-start-2 order-last md:order-none">
              {f.desc}
            </p>
            <div className="hidden md:flex justify-end text-fd-muted-foreground/70 group-hover:text-fd-muted-foreground transition-colors">
              <Spark kind={f.viz} reduce={!!reduce} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/** Small inline visuals — muted line-art with a single ember accent each. */
function Spark({ kind, reduce }: { kind: VizKind; reduce: boolean }) {
  const W = 104;
  const H = 26;
  const mid = H / 2;
  const stroke = 'currentColor';

  switch (kind) {
    case 'slider':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <line x1="4" y1={mid} x2={W - 4} y2={mid} stroke={stroke} strokeOpacity="0.35" />
          <rect x={W - 34} y={mid - 5} width="10" height="10" rx="2" fill={EMBER} />
        </svg>
      );
    case 'bars': {
      const xs = [6, 16, 26, 36, 46, 56, 66, 76, 86, 96];
      const hot = new Set([4, 6]);
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          {xs.map((x, i) => (
            <line
              key={x}
              x1={x}
              y1={mid - 8}
              x2={x}
              y2={mid + 8}
              stroke={hot.has(i) ? EMBER : stroke}
              strokeOpacity={hot.has(i) ? 1 : 0.35}
            />
          ))}
        </svg>
      );
    }
    case 'nodes':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <line x1="10" y1={mid} x2={W - 10} y2={mid} stroke={stroke} strokeOpacity="0.35" />
          {[10, W / 2, W - 10].map((cx, i) => (
            <circle
              key={cx}
              cx={cx}
              cy={mid}
              r="4"
              fill={i === 2 ? EMBER : 'none'}
              stroke={i === 2 ? EMBER : stroke}
              strokeOpacity={i === 2 ? 1 : 0.5}
            />
          ))}
        </svg>
      );
    case 'barchart': {
      const data = [10, 4, 14, 7, 3, 11, 2];
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          {data.map((h, i) => (
            <line
              key={i}
              x1={8 + i * 15}
              y1={H - 4}
              x2={8 + i * 15}
              y2={H - 4 - h}
              stroke={i === 2 ? EMBER : stroke}
              strokeOpacity={i === 2 ? 1 : 0.4}
              strokeWidth="2"
            />
          ))}
        </svg>
      );
    }
    case 'dots': {
      const hot = new Set([2, 5]);
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx={8 + i * 12}
              cy={mid}
              r="2.5"
              fill={hot.has(i) ? EMBER : stroke}
              fillOpacity={hot.has(i) ? 1 : 0.35}
            />
          ))}
        </svg>
      );
    }
    case 'wave':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <circle cx="8" cy={mid} r="3" fill={EMBER} />
          {[mid - 4, mid, mid + 4].map((y, i) => (
            <line
              key={y}
              x1="20"
              y1={y}
              x2={W - 8 - i * 14}
              y2={y}
              stroke={stroke}
              strokeOpacity="0.35"
            />
          ))}
        </svg>
      );
    case 'clock':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <g transform={`translate(${W - 16}, ${mid})`}>
            <circle r="9" stroke={stroke} strokeOpacity="0.4" fill="none" />
            <line x1="0" y1="0" x2="0" y2="-5" stroke={EMBER} strokeWidth="1.5" strokeLinecap="round">
              {!reduce && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="6s"
                  repeatCount="indefinite"
                />
              )}
            </line>
            <line x1="0" y1="0" x2="4" y2="0" stroke={stroke} strokeOpacity="0.6" strokeLinecap="round" />
          </g>
        </svg>
      );
    case 'check':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <rect x={W - 66} y={mid - 6} width="12" height="12" rx="3" stroke={stroke} strokeOpacity="0.5" />
          <path d={`M ${W - 63} ${mid} l 2.5 2.5 l 4 -5`} stroke={EMBER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x={W - 44} y={mid + 3} className="text-[10px] font-mono" fill={stroke} fillOpacity="0.6">
            stdlib
          </text>
        </svg>
      );
    default:
      return null;
  }
}
