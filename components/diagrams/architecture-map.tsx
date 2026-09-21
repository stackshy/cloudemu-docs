'use client';

import { useInView } from './use-in-view';

/**
 * ArchitectureMap — the big picture in one image: clients on top, down through the
 * wire server and the driver contract into the in-memory provider mocks, with the
 * optional consumers (chaos / topology / clock / recorder) hanging off the driver
 * spine. Pure SVG in the site's tokens; a light staggered fade on first view.
 */
const W = 760;
const H = 540;

const CX = 300; // centre of the main stack
const CW = 300; // stack card width
const L = CX - CW / 2; // 150
const R = CX + CW / 2; // 450

type Layer = { y: number; h: number; kicker: string; title: string; sub?: string; accent?: boolean };
const LAYERS: Layer[] = [
  { y: 24, h: 74, kicker: 'YOUR CODE', title: 'SDKs · CLI · Terraform', sub: 'unmodified, any language' },
  { y: 150, h: 82, kicker: 'WIRE SERVER', title: 'Real cloud protocols', sub: 'query·XML · JSON-RPC · CBOR · ARM · REST' },
  { y: 284, h: 66, kicker: 'THE CONTRACT', title: 'Driver interfaces', accent: true },
  { y: 402, h: 96, kicker: 'IN MEMORY', title: 'Provider mocks · memstore', sub: 'AWS · Azure · GCP · OCI · Kubernetes' },
];

const CONSUMERS = ['Chaos', 'Topology', 'Fake clock', 'Recorder'];

export function ArchitectureMap() {
  const [ref, on] = useInView<HTMLDivElement>();
  const spineY = LAYERS[2].y + LAYERS[2].h / 2; // driver layer centre

  return (
    <div ref={ref} className="not-prose my-7">
      <p className="u-eyebrow mb-3">the whole picture · top to bottom</p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`h-auto w-full max-w-[760px] am-svg${on ? ' is-in' : ''}`}
        role="img"
        aria-label="Clients flow down through the wire server and the driver contract into in-memory provider mocks; chaos, topology, fake clock and recorder hang off the driver contract."
      >
        {/* down arrows between layers */}
        {LAYERS.slice(0, -1).map((ly, i) => {
          const y1 = ly.y + ly.h;
          const y2 = LAYERS[i + 1].y;
          return (
            <g key={`ar${i}`} className="am-arrow" style={{ ['--d' as string]: `${0.15 + i * 0.12}s` }}>
              <line x1={CX} y1={y1} x2={CX} y2={y2 - 8} />
              <path d={`M ${CX - 5} ${y2 - 12} L ${CX} ${y2 - 4} L ${CX + 5} ${y2 - 12}`} />
            </g>
          );
        })}

        {/* main stack */}
        {LAYERS.map((ly, i) => (
          <g key={ly.title} className={`am-card${ly.accent ? ' is-accent' : ''}`} style={{ ['--d' as string]: `${i * 0.12}s` }}>
            <rect x={L} y={ly.y} width={CW} height={ly.h} rx={12} />
            <text className="am-kicker" x={L + 18} y={ly.y + 24}>{ly.kicker}</text>
            <text className="am-title" x={L + 18} y={ly.y + (ly.sub ? 46 : 44)}>{ly.title}</text>
            {ly.sub && <text className="am-sub" x={L + 18} y={ly.y + 66}>{ly.sub}</text>}
          </g>
        ))}

        {/* consumers hanging off the driver contract */}
        <g className="am-rail" style={{ ['--d' as string]: '0.5s' }}>
          <line x1={R} y1={spineY} x2={R + 44} y2={spineY} />
          <line x1={R + 44} y1={CONSUMERS.length ? 150 : spineY} x2={R + 44} y2={150 + (CONSUMERS.length - 1) * 60} />
        </g>
        {CONSUMERS.map((c, i) => {
          const cy = 150 + i * 60;
          return (
            <g key={c} className="am-chip" style={{ ['--d' as string]: `${0.55 + i * 0.08}s` }}>
              <line className="am-rail-tick" x1={R + 44} y1={cy} x2={R + 60} y2={cy} />
              <rect x={R + 60} y={cy - 18} width={132} height={36} rx={8} />
              <text className="am-chip-t" x={R + 60 + 66} y={cy + 4} textAnchor="middle">{c}</text>
            </g>
          );
        })}
        <text className="am-rail-note" x={R + 126} y={150 + (CONSUMERS.length - 1) * 60 + 42} textAnchor="middle">
          all wrap the same contract
        </text>
      </svg>
    </div>
  );
}
