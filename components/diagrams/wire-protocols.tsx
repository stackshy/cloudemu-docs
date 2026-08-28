'use client';

import { useInView } from './use-in-view';

/**
 * SDK-compat — three real SDKs speaking their own wire protocols into one
 * server. Provider-tinted packets travel each lane on a staggered beat;
 * protocol names ride above the wires.
 */

const W = 640;
const H = 190;

const LANES = [
  { y: 40, sdk: 'aws-sdk-go-v2', proto: 'Query · JSON · Smithy CBOR', color: 'var(--aws)' },
  { y: 95, sdk: 'azure-sdk-for-go', proto: 'ARM JSON', color: 'var(--azure)' },
  { y: 150, sdk: 'cloud.google.com/go', proto: 'REST', color: 'var(--gcp)' },
];

export function WireProtocols() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="not-prose my-7">
      <p className="u-eyebrow mb-2">one server, three wire protocols</p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full max-w-[640px]"
        role="img"
        aria-label="AWS, Azure, and GCP SDKs each speak their own wire protocol to the same cloudemu server"
      >
        {LANES.map((l, i) => (
          <g key={l.sdk}>
            <rect x={8} y={l.y - 15} width={172} height={30} rx={6} fill="var(--bg-2)" stroke="var(--border-2)" strokeWidth="1" />
            <rect x={8} y={l.y - 15} width={3} height={30} rx={1.5} fill={l.color} fillOpacity="0.8" />
            <text x={20} y={l.y + 4} fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-1)">
              {l.sdk}
            </text>
            <line x1={180} y1={l.y} x2={490} y2={l.y} stroke="var(--border-2)" strokeOpacity="0.6" strokeWidth="1" />
            <text x={335} y={l.y - 8} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
              {l.proto}
            </text>
            {on && (
              <rect x={-4} y={-4} width={8} height={8} rx={1.5} fill={l.color} fillOpacity="0">
                <animate attributeName="fill-opacity" values="0;0.9;0.9;0" keyTimes="0;0.06;0.94;1" dur="2.8s" begin={`${i * 0.9}s`} repeatCount="indefinite" />
                <animateMotion
                  dur="2.8s"
                  begin={`${i * 0.9}s`}
                  repeatCount="indefinite"
                  path={`M 186 ${l.y} H 484`}
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.3 0 0.7 1"
                />
              </rect>
            )}
          </g>
        ))}
        {/* server */}
        <rect x={490} y={16} width={142} height={158} rx={8} fill="var(--bg-2)" stroke="var(--border-2)" strokeWidth="1" />
        <text x={561} y={92} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-1)">
          cloudemu
        </text>
        <text x={561} y={110} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
          serve · :4566
        </text>
      </svg>
    </div>
  );
}
