'use client';

import { useInView } from './use-in-view';

/**
 * Standalone server — an out-of-process client sends requests over the network
 * into one long-lived `cloudemu serve` process that exposes a stable,
 * provider-tinted port for each cloud. Packets travel each lane on a staggered
 * beat and land on their port.
 */

const W = 640;
const H = 210;

const LANES = [
  { y: 66, port: ':4566', name: 'aws', color: 'var(--aws)' },
  { y: 100, port: ':4568', name: 'azure', color: 'var(--azure)' },
  { y: 134, port: ':4569', name: 'gcp', color: 'var(--gcp)' },
  { y: 168, port: ':4570', name: 'k8s', color: 'var(--accent)' },
];

const CLIENT_R = 158; // right edge of the client box
const SERVE_L = 470; // left edge of the serve box

export function ServePorts() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="not-prose my-7">
      <p className="u-eyebrow mb-2">one long-lived process · stable ports</p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full max-w-[640px]"
        role="img"
        aria-label="An SDK client sends requests over the network to a long-lived cloudemu serve process exposing a stable port per cloud provider"
      >
        {/* client */}
        <rect x={8} y={30} width={150} height={150} rx={8} fill="var(--bg-2)" stroke="var(--border-2)" strokeWidth="1" />
        <text x={83} y={100} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-1)">
          SDK client
        </text>
        <text x={83} y={118} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
          any language
        </text>

        {/* serve process (drawn before the ports so its fill sits behind them) */}
        <rect x={SERVE_L} y={30} width={162} height={150} rx={8} fill="var(--bg-2)" stroke="var(--border-2)" strokeWidth="1" />
        <text x={SERVE_L + 81} y={49} textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)" fill="var(--text-1)">
          cloudemu serve
        </text>
        <line x1={SERVE_L + 12} y1={58} x2={SERVE_L + 150} y2={58} stroke="var(--border-2)" strokeOpacity="0.6" strokeWidth="1" />

        {/* network divider */}
        <line x1={314} y1={40} x2={314} y2={180} stroke="var(--border-2)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 4" />
        <text x={314} y={28} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--text-3)">
          network
        </text>

        {/* lanes + ports */}
        {LANES.map((l, i) => (
          <g key={l.name}>
            <line x1={CLIENT_R} y1={l.y} x2={SERVE_L} y2={l.y} stroke="var(--border-2)" strokeOpacity="0.6" strokeWidth="1" />
            <rect x={SERVE_L + 14} y={l.y - 7} width={14} height={14} rx={3} fill={l.color} fillOpacity="0.85" />
            <text x={SERVE_L + 36} y={l.y + 4} fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-1)">
              {l.port}
            </text>
            <text x={SERVE_L + 80} y={l.y + 4} fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-3)">
              {l.name}
            </text>
            {on && (
              <rect x={-4} y={-4} width={8} height={8} rx={1.5} fill={l.color} fillOpacity="0">
                <animate attributeName="fill-opacity" values="0;0.9;0.9;0" keyTimes="0;0.06;0.94;1" dur="3s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                <animateMotion
                  dur="3s"
                  begin={`${i * 0.7}s`}
                  repeatCount="indefinite"
                  path={`M ${CLIENT_R + 6} ${l.y} H ${SERVE_L - 2}`}
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.3 0 0.7 1"
                />
              </rect>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
