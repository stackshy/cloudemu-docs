'use client';

import { useInView } from './use-in-view';

/**
 * Feature-page diagrams — docs-scale versions of the landing ledger glyphs,
 * one per cross-cutting feature. Same language: hairline strokes, mono
 * labels, semantic colors only, slow ambient loops that start when the
 * diagram scrolls into view. 640×120 stage, drawn on the canvas (no box).
 */

const W = 640;
const H = 120;
const MID = 60;

type Kind =
  | 'recording'
  | 'metrics'
  | 'ratelimit'
  | 'injection'
  | 'clock'
  | 'latency';

function Recording({ on }: { on: boolean }) {
  const rows = [40, 60, 80];
  const widths = [300, 420, 360];
  return (
    <>
      {/* rec dot */}
      <circle cx={64} cy={MID} r="6" fill="var(--danger)" fillOpacity="0.9">
        {on && (
          <animate attributeName="fill-opacity" values="0.9;0.35;0.9" dur="2s" repeatCount="indefinite" />
        )}
      </circle>
      <text x={64} y={MID + 24} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
        rec
      </text>
      {/* call lines appearing in sequence, then held */}
      {rows.map((y, i) => (
        <g key={y}>
          <line
            x1={110}
            y1={y}
            x2={110 + widths[i]}
            y2={y}
            stroke="var(--text-3)"
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {on && (
              <animate
                attributeName="stroke-opacity"
                values="0;0.55;0.55;0"
                keyTimes="0;0.12;0.88;1"
                dur="5.4s"
                begin={`${i * 0.7}s`}
                repeatCount="indefinite"
              />
            )}
          </line>
          <text
            x={120 + widths[i]}
            y={y + 3}
            fontSize="9"
            fontFamily="var(--font-mono)"
            fill="var(--text-3)"
            opacity={on ? 1 : 0}
          >
            {['PutObject 9ms', 'RunInstances 11ms', 'PutMetricData 8ms'][i]}
          </text>
        </g>
      ))}
    </>
  );
}

function Metrics({ on }: { on: boolean }) {
  const bars = Array.from({ length: 11 }, (_, i) => 80 + i * 48);
  const heights = [22, 34, 28, 46, 38, 52, 30, 44, 36, 50, 26];
  return (
    <>
      <line x1={64} y1={92} x2={576} y2={92} stroke="var(--border-2)" strokeWidth="1" />
      {bars.map((x, i) => (
        <line
          key={x}
          x1={x}
          y1={92}
          x2={x}
          y2={92 - heights[i]}
          stroke="var(--text-3)"
          strokeOpacity="0.7"
          strokeWidth="6"
          strokeLinecap="round"
        >
          {on && (
            <animate
              attributeName="y2"
              values={`92;${92 - heights[i]}`}
              dur="600ms"
              begin={`${i * 0.08}s`}
              fill="freeze"
            />
          )}
        </line>
      ))}
      <text x={64} y={110} fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
        calls/op
      </text>
      <text x={576} y={110} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
        p99 11ms
      </text>
    </>
  );
}

function RateLimit({ on }: { on: boolean }) {
  // tokens queue left, pass through the gate at a fixed rate; overflow dims
  const queue = Array.from({ length: 6 }, (_, i) => 90 + i * 34);
  return (
    <>
      {/* gate */}
      <line x1={330} y1={MID - 26} x2={330} y2={MID + 26} stroke="var(--border-2)" strokeWidth="2" />
      <text x={330} y={MID + 44} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
        100 req/s
      </text>
      {/* queued tokens */}
      {queue.map((x, i) => (
        <circle key={x} cx={x} cy={MID} r="5" fill="var(--text-3)" fillOpacity={i < 4 ? 0.7 : 0.3} />
      ))}
      {/* a token passing the gate on a steady beat */}
      {on && (
        <circle r="5" fill="var(--ok)" fillOpacity="0.9">
          <animate attributeName="cx" values="300;560" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="cy" values={`${MID};${MID}`} dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.9;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      {/* rejected token bouncing off */}
      {on && (
        <text fontSize="11" fontFamily="var(--font-mono)" fill="var(--danger)" textAnchor="middle">
          <animate attributeName="x" values="316;316" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="y" values={`${MID - 34};${MID - 44}`} dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.55;0.7;1" dur="3.6s" repeatCount="indefinite" />
          429
        </text>
      )}
    </>
  );
}

function Injection({ on }: { on: boolean }) {
  const dots = Array.from({ length: 12 }, (_, i) => 72 + i * 45);
  return (
    <>
      <line x1={64} y1={MID} x2={576} y2={MID} stroke="var(--border-2)" strokeOpacity="0.5" strokeWidth="1" />
      {dots.map((x, i) => {
        const injected = (i + 1) % 3 === 0;
        return (
          <g key={x}>
            <circle
              cx={x}
              cy={MID}
              r="5.5"
              fill={injected ? 'var(--danger)' : 'var(--ok)'}
              fillOpacity={injected ? 0.95 : 0.55}
            >
              {injected && on && (
                <animate
                  attributeName="fill-opacity"
                  values="0.95;0.25;0.95"
                  dur="2.4s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
            {injected && (
              <text x={x} y={MID - 16} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--danger)" fillOpacity="0.9">
                ✕
              </text>
            )}
          </g>
        );
      })}
      <text x={64} y={MID + 36} fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
        inject.NewNthCall(3)
      </text>
    </>
  );
}

function Clock({ on }: { on: boolean }) {
  return (
    <>
      <circle cx={200} cy={MID} r="34" fill="none" stroke="var(--border-2)" strokeWidth="1.5" />
      <line x1={200} y1={MID} x2={200} y2={MID - 24} stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round">
        {on && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0 200 ${MID};90 200 ${MID};180 200 ${MID};270 200 ${MID};360 200 ${MID}`}
            calcMode="discrete"
            dur="4s"
            repeatCount="indefinite"
          />
        )}
      </line>
      <circle cx={200} cy={MID} r="2" fill="var(--text-2)" />
      {/* the jump annotation */}
      <text x={290} y={MID - 8} fontSize="11" fontFamily="var(--font-mono)" fill="var(--text-2)">
        clock.Advance(48 * time.Hour)
      </text>
      <text x={290} y={MID + 14} fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-3)">
        TTLs expire · dedup windows roll · alarms fire
      </text>
    </>
  );
}

function Latency({ on }: { on: boolean }) {
  return (
    <>
      {/* fast lane */}
      <line x1={64} y1={44} x2={576} y2={44} stroke="var(--border-2)" strokeOpacity="0.5" strokeWidth="1" />
      <text x={64} y={32} fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
        default · ~10ms
      </text>
      {on && (
        <rect x={-4} y={40} width={8} height={8} rx={1.5} fill="var(--text-3)">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M 64 44 H 576" calcMode="spline" keyTimes="0;1" keySplines="0.3 0 0.7 1" />
        </rect>
      )}
      {/* slow lane */}
      <line x1={64} y1={90} x2={576} y2={90} stroke="var(--border-2)" strokeOpacity="0.5" strokeWidth="1" />
      <text x={64} y={78} fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
        config.WithLatency(800ms)
      </text>
      {on && (
        <rect x={-4} y={86} width={8} height={8} rx={1.5} fill="var(--warn)">
          <animateMotion dur="7.2s" repeatCount="indefinite" path="M 64 90 H 576" calcMode="spline" keyTimes="0;1" keySplines="0.3 0 0.7 1" />
        </rect>
      )}
    </>
  );
}

const RENDER: Record<Kind, (p: { on: boolean }) => React.ReactNode> = {
  recording: (p) => <Recording {...p} />,
  metrics: (p) => <Metrics {...p} />,
  ratelimit: (p) => <RateLimit {...p} />,
  injection: (p) => <Injection {...p} />,
  clock: (p) => <Clock {...p} />,
  latency: (p) => <Latency {...p} />,
};

const ARIA: Record<Kind, string> = {
  recording: 'Calls are captured as they happen, with operation names and timings',
  metrics: 'Per-operation call counts accumulate as bars on a small chart',
  ratelimit: 'Tokens pass a gate at a fixed rate; excess requests get 429',
  injection: 'Every third call fails with an injected error',
  clock: 'A stepped clock hand: time advances only when the test says so',
  latency: 'Two packets race: the default lane arrives in ~10ms, the delayed lane takes 800ms',
};

export function FeatureGlyph({ kind, label }: { kind: Kind; label: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="not-prose my-7">
      <p className="u-eyebrow mb-2">{label}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[640px]" role="img" aria-label={ARIA[kind]}>
        {RENDER[kind]({ on })}
      </svg>
    </div>
  );
}
