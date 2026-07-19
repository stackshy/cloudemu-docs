'use client';

import { useInView } from './use-in-view';

/**
 * Network topology — one question, two answers. A packet from web-1 routes
 * through the route table to db-1 (reachable); the same packet toward
 * cache-1 dies at the security group. Drawn on the canvas, no box.
 */

const W = 640;
const H = 210;

function node(x: number, y: number, w: number, title: string, sub: string) {
  return (
    <g>
      <rect x={x} y={y - 20} width={w} height={40} rx={6} fill="var(--bg-2)" stroke="var(--border-2)" strokeWidth="1" />
      <text x={x + w / 2} y={y - 2} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-1)">
        {title}
      </text>
      <text x={x + w / 2} y={y + 12} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--text-3)">
        {sub}
      </text>
    </g>
  );
}

export function TopologyGraph() {
  const [ref, on] = useInView<HTMLDivElement>();
  const YA = 56; // reachable path
  const YB = 156; // blocked path
  return (
    <div ref={ref} className="not-prose my-7">
      <p className="u-eyebrow mb-2">topology.CanReach(web-1, …)</p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full max-w-[640px]"
        role="img"
        aria-label="A packet from web-1 reaches db-1 through the route table; the path to cache-1 is blocked by a security group"
      >
        {/* source */}
        {node(8, 106, 110, 'web-1', 'subnet-a')}
        {/* fan-out wires */}
        <path d={`M 118 106 C 160 106, 160 ${YA}, 200 ${YA}`} fill="none" stroke="var(--border-2)" strokeWidth="1" />
        <path d={`M 118 106 C 160 106, 160 ${YB}, 200 ${YB}`} fill="none" stroke="var(--border-2)" strokeWidth="1" />

        {/* path A: routed */}
        {node(200, YA, 130, 'route-table', '10.0.2.0/24 → local')}
        <line x1={330} y1={YA} x2={470} y2={YA} stroke="var(--border-2)" strokeWidth="1" />
        {node(470, YA, 110, 'db-1', 'subnet-b')}
        <text x={606} y={YA + 4} fontSize="12" fontFamily="var(--font-mono)" fill="var(--ok)">
          ✓
        </text>
        {on && (
          <rect x={-4} y={-4} width={8} height={8} rx={1.5} fill="var(--ok)" fillOpacity="0">
            <animateMotion
              dur="3.2s"
              repeatCount="indefinite"
              path={`M 122 106 C 160 106, 160 ${YA}, 200 ${YA} H 466`}
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.3 0 0.7 1"
            />
            <animate attributeName="fill-opacity" values="0;0.9;0.9;0" keyTimes="0;0.08;0.92;1" dur="3.2s" repeatCount="indefinite" />
          </rect>
        )}

        {/* path B: blocked at the SG */}
        {node(200, YB, 130, 'sg-cache', 'no ingress :6379')}
        <line x1={330} y1={YB} x2={470} y2={YB} stroke="var(--border-2)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 4" />
        <g opacity="0.5">{node(470, YB, 110, 'cache-1', 'subnet-c')}</g>
        <text x={606} y={YB + 4} fontSize="12" fontFamily="var(--font-mono)" fill="var(--danger)">
          ✕
        </text>
        {on && (
          <rect x={-4} y={-4} width={8} height={8} rx={1.5} fill="var(--danger)" fillOpacity="0">
            <animateMotion
              dur="3.2s"
              begin="1.6s"
              repeatCount="indefinite"
              path={`M 122 106 C 160 106, 160 ${YB}, 196 ${YB}`}
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.3 0 0.7 1"
            />
            <animate
              attributeName="fill-opacity"
              values="0;0.9;0.9;0"
              keyTimes="0;0.1;0.85;1"
              dur="3.2s"
              begin="1.6s"
              repeatCount="indefinite"
            />
          </rect>
        )}
      </svg>
    </div>
  );
}
