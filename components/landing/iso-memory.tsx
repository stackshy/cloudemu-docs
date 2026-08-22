'use client';

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

// detached cubes, positioned like LocalStack's card: one above, two to the sides
const FLOATERS = [
  { a: 1, b: 1, c: 3.5, delay: 0 },     // above the top
  { a: -1.7, b: 1, c: 0.4, delay: 1.3 }, // lower-left
  { a: 1, b: -1.7, c: 0.4, delay: 2.6 }, // lower-right
];

export function IsoMemory() {
  const cx = v(1.5, 1.5, 1.5);

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

          {/* detached floating cubes */}
          {FLOATERS.map((f, i) => {
            const fc = faces(f.a, f.b, f.c);
            return (
              <g className="iso-fcube" key={i} style={{ ['--d' as string]: `${f.delay}s` }}>
                <polygon className="fc-left" points={fc.left} />
                <polygon className="fc-right" points={fc.right} />
                <polygon className="fc-top" points={fc.top} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
