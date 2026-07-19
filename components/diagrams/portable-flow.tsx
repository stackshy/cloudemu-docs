'use client';

import { useInView } from './use-in-view';

/**
 * Portable API — two ways to the same backend. The sdk-compat lane goes
 * through HTTP; the portable lane is a direct function call. The moving
 * packet rides the direct lane — the point of this page.
 */

const W = 640;
const H = 170;

function laneNode(x: number, y: number, w: number, title: string) {
  return (
    <g>
      <rect x={x} y={y - 16} width={w} height={32} rx={6} fill="var(--bg-2)" stroke="var(--border-2)" strokeWidth="1" />
      <text x={x + w / 2} y={y + 4} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-1)">
        {title}
      </text>
    </g>
  );
}

export function PortableFlow() {
  const [ref, on] = useInView<HTMLDivElement>();
  const Y1 = 46; // http lane
  const Y2 = 124; // portable lane
  return (
    <div ref={ref} className="not-prose my-7">
      <p className="u-eyebrow mb-2">two surfaces, one backend</p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full max-w-[640px]"
        role="img"
        aria-label="The SDK-compat path goes through HTTP; the portable API path calls the driver directly"
      >
        {/* http lane (context, dimmed) */}
        <g opacity="0.45">
          {laneNode(8, Y1, 96, 'your test')}
          {laneNode(150, Y1, 110, 'real SDK')}
          {laneNode(306, Y1, 96, 'HTTP')}
          <line x1={104} y1={Y1} x2={150} y2={Y1} stroke="var(--border-2)" strokeWidth="1" />
          <line x1={260} y1={Y1} x2={306} y2={Y1} stroke="var(--border-2)" strokeWidth="1" />
          <line x1={402} y1={Y1} x2={470} y2={Y1} stroke="var(--border-2)" strokeWidth="1" />
          <text x={356} y={Y1 - 24} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
            sdk-compat
          </text>
        </g>

        {/* portable lane (the subject) */}
        {laneNode(8, Y2, 96, 'your test')}
        {laneNode(150, Y2, 230, 'cloud.S3.PutObject(ctx, ...)')}
        <line x1={104} y1={Y2} x2={150} y2={Y2} stroke="var(--border-2)" strokeWidth="1.25" />
        <line x1={380} y1={Y2} x2={470} y2={Y2} stroke="var(--border-2)" strokeWidth="1.25" />
        <text x={425} y={Y2 - 10} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
          direct call
        </text>
        {on && (
          <rect x={-4} y={-4} width={8} height={8} rx={1.5} fill="var(--text-2)" fillOpacity="0">
            <animate attributeName="fill-opacity" values="0;0.9;0.9;0" keyTimes="0;0.06;0.94;1" dur="2.6s" repeatCount="indefinite" />
            <animateMotion
              dur="2.6s"
              repeatCount="indefinite"
              path={`M 110 ${Y2} H 466`}
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.3 0 0.7 1"
            />
          </rect>
        )}

        {/* shared backend */}
        <rect x={470} y={28} width={150} height={124} rx={8} fill="var(--bg-2)" stroke="var(--border-2)" strokeWidth="1" />
        <text x={545} y={86} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-1)">
          cloudemu
        </text>
        <text x={545} y={104} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
          same drivers · same state
        </text>
      </svg>
    </div>
  );
}
