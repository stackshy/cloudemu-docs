'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/logo';

/**
 * IsoMemory — the "Review Failures" pattern: a solid 3×3×3 isometric memory block
 * (subdivided wireframe, ember-tinted per the logo) with dashed iso guides, and
 * three cubes detached + gently floating out of it — one above, two to the sides.
 * The block stays assembled; only the surfaced cubes drift. Pure SVG + CSS, so it
 * is calm and cheap; reduced-motion holds it still.
 */

const S = 40;
const N = 3;
const AX = { x: S, y: S * 0.5 };
const AY = { x: -S, y: S * 0.5 };
const AZ = { x: 0, y: -S };
const v = (a: number, b: number, c: number) => ({ x: a * AX.x + b * AY.x + c * AZ.x, y: a * AX.y + b * AY.y + c * AZ.y });
const P = (a: { x: number; y: number }[]) => a.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

/** one full cube (3 faces) at cell (a,b,c) */
function faces(a: number, b: number, c: number) {
  return {
    top: P([v(a, b, c + 1), v(a + 1, b, c + 1), v(a + 1, b + 1, c + 1), v(a, b + 1, c + 1)]),
    right: P([v(a + 1, b, c), v(a + 1, b + 1, c), v(a + 1, b + 1, c + 1), v(a + 1, b, c + 1)]),
    left: P([v(a, b + 1, c), v(a + 1, b + 1, c), v(a + 1, b + 1, c + 1), v(a, b + 1, c + 1)]),
  };
}

// detached cubes surfacing from memory — the clouds cloudemu emulates. Three are
// live (AWS/Azure/GCP); OCI is a dashed "on the way" ghost, still forming.
const FLOATERS = [
  { a: 1, b: 1, c: 3.5, delay: 0, label: 'AWS' },     // above the top
  { a: -1.7, b: 1, c: 0.4, delay: 1.3, label: 'Azure' }, // lower-left
  { a: 1, b: -1.7, c: 0.4, delay: 2.6, label: 'GCP' }, // lower-right
  { a: 2.7, b: -1.1, c: -0.9, delay: 1.9, label: 'OCI', soon: true }, // forming, lower-right
];

export function IsoMemory() {
  const cx = v(1.5, 1.5, 1.5);
  // the cloudemu mark is printed flat on the front-centre of the block's top face
  // (clear of the AWS cube that floats over the back socket); wires plug into it.
  const core = v(2.0, 2.0, N);

  // gate the SMIL pulses on reduced-motion (SMIL can't read the CSS media query)
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    setMotion(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // solid block: subdivided top / left / right faces
  const grid: React.ReactNode[] = [];
  const gl = (p: { x: number; y: number }, q: { x: number; y: number }, k: string) =>
    grid.push(<line key={k} x1={p.x.toFixed(1)} y1={p.y.toFixed(1)} x2={q.x.toFixed(1)} y2={q.y.toFixed(1)} />);
  for (let i = 0; i <= N; i++) { gl(v(i, 0, N), v(i, N, N), `tx${i}`); gl(v(0, i, N), v(N, i, N), `ty${i}`); }
  for (let i = 0; i <= N; i++) gl(v(i, N, 0), v(i, N, N), `lx${i}`);
  for (let k = 0; k <= N; k++) gl(v(0, N, k), v(N, N, k), `lz${k}`);
  for (let j = 0; j <= N; j++) gl(v(N, j, 0), v(N, j, N), `ry${j}`);
  for (let k = 0; k <= N; k++) gl(v(N, 0, k), v(N, N, k), `rz${k}`);

  // socket where the top cube surfaced (recess in the top-centre cell)
  const D = 0.55;
  const sock = {
    floor: P([v(1, 1, N - D), v(2, 1, N - D), v(2, 2, N - D), v(1, 2, N - D)]),
    wl: P([v(1, 2, N), v(2, 2, N), v(2, 2, N - D), v(1, 2, N - D)]),
    wr: P([v(2, 1, N), v(2, 2, N), v(2, 2, N - D), v(2, 1, N - D)]),
  };

  return (
    <div className="iso-wrap" aria-hidden="true">
      <svg className="iso-svg" viewBox="-215 -235 430 460" role="img">
        <g transform={`translate(${(-cx.x).toFixed(1)}, ${(-cx.y).toFixed(1)})`}>
          <g className="iso-guides">
            <line x1={-AX.x * 5} y1={-AX.y * 5 + cx.y} x2={AX.x * 5} y2={AX.y * 5 + cx.y} />
            <line x1={-AY.x * 5} y1={-AY.y * 5 + cx.y} x2={AY.x * 5} y2={AY.y * 5 + cx.y} />
          </g>

          {/* solid block */}
          <g className="iso-block">
            <polygon className="ip-top" points={P([v(0, 0, N), v(N, 0, N), v(N, N, N), v(0, N, N)])} />
            <polygon className="ip-left" points={P([v(0, N, 0), v(N, N, 0), v(N, N, N), v(0, N, N)])} />
            <polygon className="ip-right" points={P([v(N, 0, 0), v(N, N, 0), v(N, N, N), v(N, 0, N)])} />
            <g className="iso-sock">
              <polygon className="iso-sock-wr" points={sock.wr} />
              <polygon className="iso-sock-wl" points={sock.wl} />
              <polygon className="iso-sock-floor" points={sock.floor} />
            </g>
            <g className="iso-grid">{grid}</g>
          </g>
          <g className="iso-outline">
            <polygon points={P([v(0, N, 0), v(N, N, 0), v(N, N, N), v(0, N, N)])} />
            <polygon points={P([v(N, 0, 0), v(N, N, 0), v(N, N, N), v(N, 0, N)])} />
            <polygon points={P([v(0, 0, N), v(N, 0, N), v(N, N, N), v(0, N, N)])} />
          </g>

          {/* connector wires: a pulse travels from each provider cube into the core */}
          <g className="iso-wires">
            {FLOATERS.map((f, i) => {
              const from = v(f.a + 0.5, f.b + 0.5, f.c + 0.5);
              const path = `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} L ${core.x.toFixed(1)} ${core.y.toFixed(1)}`;
              const begin = `${(i * 0.6).toFixed(2)}s`;
              return (
                <g key={`w${i}`}>
                  <line
                    className="iso-wire"
                    x1={from.x.toFixed(1)}
                    y1={from.y.toFixed(1)}
                    x2={core.x.toFixed(1)}
                    y2={core.y.toFixed(1)}
                  />
                  {motion && (
                    <circle className="iso-pulse" r="3.4">
                      <animateMotion
                        dur="2.4s"
                        begin={begin}
                        repeatCount="indefinite"
                        path={path}
                        calcMode="spline"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        keySplines="0.4 0 0.2 1"
                      />
                      <animate
                        attributeName="opacity"
                        dur="2.4s"
                        begin={begin}
                        repeatCount="indefinite"
                        values="0;1;1;0"
                        keyTimes="0;0.12;0.82;1"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* detached floating cubes */}
          {FLOATERS.map((f, i) => {
            const fc = faces(f.a, f.b, f.c);
            const tc = v(f.a + 0.5, f.b + 0.5, f.c + 1); // top-face centre
            return (
              <g className={`iso-fcube${f.soon ? ' is-soon' : ''}`} key={i} style={{ ['--d' as string]: `${f.delay}s` }}>
                <polygon className="fc-left" points={fc.left} />
                <polygon className="fc-right" points={fc.right} />
                <polygon className="fc-top" points={fc.top} />
                {/* etched into the cube's top face: skewed onto the iso plane, faded.
                    OCI's cube is the dashed ghost, so its label reads fainter still. */}
                <text
                  className="fc-inlabel"
                  transform={`matrix(1,0.5,-1,0.5,${tc.x.toFixed(1)},${tc.y.toFixed(1)})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {f.label}
                </text>
              </g>
            );
          })}

          {/* the cloudemu mark — printed flat on the top face (skewed onto the iso
              plane) like a sticker on the core cube; drawn last so it stays fully
              visible, and every provider wire plugs into it */}
          <g
            className="iso-hub"
            transform={`matrix(1,0.5,-1,0.5,${core.x.toFixed(1)},${core.y.toFixed(1)})`}
          >
            <Logo x={-42} y={-22} width={84} height={44} />
          </g>
        </g>
      </svg>
    </div>
  );
}
