'use client';

import { useId } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * HeroEmblem — FIG. 1, the hero's signature. The cloudemu mark as a halftone
 * "memory" cloud: a dot-matrix silhouette (each dot a memory cell) with an
 * ember scan sweeping across it — resident data being read in place — and the
 * terminal prompt (chevron + blinking ember cursor) crisp at its centre.
 * Framed as a technical figure: dashed in-memory boundary, ~10 ms dimension,
 * hex RAM baseline. Deterministic (SSR-safe); reduced-motion → static.
 */

// Cloud silhouette (viewBox space) — shared by the dot hit-test and the clip.
const C = [
  { x: 205, y: 138, r: 58 },
  { x: 150, y: 176, r: 38 },
  { x: 262, y: 170, r: 42 },
] as const;
const RECT = { x: 150, y: 148, w: 120, h: 54 };

function inside(x: number, y: number): boolean {
  for (const c of C) if ((x - c.x) ** 2 + (y - c.y) ** 2 <= c.r ** 2) return true;
  return x >= RECT.x && x <= RECT.x + RECT.w && y >= RECT.y && y <= RECT.y + RECT.h;
}

// Build the dot grid once (module scope — deterministic, no randomness).
const DOTS: { x: number; y: number }[] = [];
for (let y = 84; y <= 202; y += 10.5) {
  for (let x = 108; x <= 304; x += 10.5) {
    if (inside(x, y)) DOTS.push({ x, y });
  }
}

export function HeroEmblem() {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const EM = 'var(--accent)';
  const INK = 'var(--text-2)';
  const FAINT = 'var(--text-3)';

  return (
    <figure className="not-prose">
      <svg
        viewBox="0 0 400 400"
        className="h-auto w-full"
        style={{ overflow: 'visible' }}
        role="img"
        aria-label="The cloudemu emblem: a cloud of memory cells holding a terminal prompt, scanned in place, resident in memory."
      >
        <defs>
          <clipPath id={`cloud-${uid}`}>
            {C.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.r} />
            ))}
            <rect x={RECT.x} y={RECT.y} width={RECT.w} height={RECT.h} rx="14" />
          </clipPath>
        </defs>

        {/* dashed in-memory boundary */}
        <rect x="12" y="52" width="376" height="316" rx="14" fill="none" stroke={EM} strokeOpacity="0.22" strokeDasharray="5 7" />
        {[
          [20, 60, 1, 1],
          [380, 60, -1, 1],
          [20, 360, 1, -1],
          [380, 360, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <g key={i} stroke={FAINT} strokeOpacity="0.5">
            <line x1={x} y1={y} x2={x + 10 * sx} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + 10 * sy} />
          </g>
        ))}

        {/* labels */}
        <text x="30" y="40" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="0.18em" fill={FAINT}>
          <tspan fill={EM}>▸ </tspan>IN MEMORY
        </text>
        <text x="370" y="40" textAnchor="end" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="0.18em" fill={FAINT}>
          RESIDENT
        </text>

        {/* the halftone memory cloud — dots ripple ember as writes sweep through */}
        <g clipPath={`url(#cloud-${uid})`}>
          <rect x="108" y="80" width="200" height="126" fill="var(--accent)" fillOpacity="0.05" />
          {DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r="2"
              className={reduce ? undefined : 'ce-dot'}
              fill={reduce ? INK : undefined}
              fillOpacity={reduce ? 0.32 : undefined}
              style={reduce ? undefined : { animationDelay: `${(((d.x - 108) / 196) * 1.5).toFixed(2)}s` }}
            />
          ))}
        </g>

        {/* terminal prompt — chevron + blinking ember cursor, centred in the cloud */}
        <path d="M186 116 L224 150 L186 184" stroke={INK} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect className="ce-blink" x="236" y="141" width="20" height="18" rx="4" fill={EM} />

        {/* ~10 ms dimension */}
        <g stroke={FAINT} strokeOpacity="0.6">
          <line x1="150" y1="232" x2="150" y2="242" />
          <line x1="290" y1="232" x2="290" y2="242" />
          <line x1="150" y1="237" x2="290" y2="237" />
        </g>
        <text x="220" y="229" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill={EM}>
          ~10 ms
        </text>

        {/* RAM baseline with address ticks */}
        <line x1="34" y1="284" x2="366" y2="284" stroke={FAINT} strokeOpacity="0.45" strokeDasharray="2 6" />
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <line key={k} x1={34 + k * 55.3} y1="284" x2={34 + k * 55.3} y2="289" stroke={FAINT} strokeOpacity="0.5" />
        ))}
        <text x="34" y="304" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="0.08em" fill={FAINT}>0x00</text>
        <text x="366" y="304" textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="0.08em" fill={FAINT}>0xFF · RAM</text>
      </svg>
      <figcaption className="u-figcaption">
        <b>FIG. 1</b>
        <span>The cloud, resident in memory — a terminal prompt away, scanned and reset in place.</span>
      </figcaption>
    </figure>
  );
}
