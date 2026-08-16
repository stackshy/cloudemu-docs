'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * "What just happened" flow for the Quick Start: SDK → HTTP wire → cloudemu.
 * Neutral node cards with mono labels; the wires draw in once when the
 * diagram scrolls into view. No loops, no color — a diagram, not a demo.
 */
export function RequestFlow() {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const node = (
    x: number,
    w: number,
    title: string,
    sub: string,
    key: string,
  ) => (
    <g key={key}>
      <rect
        x={x}
        y={28}
        width={w}
        height={54}
        rx={8}
        fill="var(--bg-2)"
        stroke="var(--border-2)"
        strokeWidth="1"
      />
      <text
        x={x + w / 2}
        y={52}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="var(--text-1)"
        fontFamily="var(--font-sans)"
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={69}
        textAnchor="middle"
        fontSize="9"
        fill="var(--text-3)"
        fontFamily="var(--font-mono)"
      >
        {sub}
      </text>
    </g>
  );

  const wire = (x1: number, x2: number, key: string, delay: number) => (
    <g key={key}>
      <line
        x1={x1}
        y1={55}
        x2={x2}
        y2={55}
        stroke="var(--border-2)"
        strokeWidth="1.25"
        strokeDasharray={x2 - x1}
        strokeDashoffset={drawn ? 0 : x2 - x1}
        style={{
          transition: `stroke-dashoffset 500ms var(--ease-out) ${delay}ms`,
        }}
      />
      <path
        d={`M ${x2 - 5} 51 L ${x2} 55 L ${x2 - 5} 59`}
        fill="none"
        stroke="var(--border-2)"
        strokeWidth="1.25"
        opacity={drawn ? 1 : 0}
        style={{
          transition: `opacity 200ms var(--ease-out) ${delay + 450}ms`,
        }}
      />
    </g>
  );

  return (
    <figure className="not-prose my-7">
      <svg
        ref={ref}
        viewBox="0 0 560 110"
        role="img"
        aria-label="Your code calls the real SDK, which sends real wire-protocol HTTP to the in-memory cloudemu server"
        className="w-full max-w-xl"
      >
        {node(0, 150, 'Your code', 'real aws-sdk-go-v2', 'sdk')}
        {wire(158, 222, 'w1', 100)}
        <text
          x={190}
          y={44}
          textAnchor="middle"
          fontSize="9"
          fill="var(--text-3)"
          fontFamily="var(--font-mono)"
          opacity={drawn ? 1 : 0}
          style={{ transition: 'opacity 200ms var(--ease-out) 550ms' }}
        >
          HTTP
        </text>
        {node(230, 170, 'Wire protocol', 'S3 REST · JSON-RPC · CBOR', 'wire')}
        {wire(408, 472, 'w2', 700)}
        {node(480, 80, 'cloudemu', 'in-memory', 'emu')}
      </svg>
      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
        one request, end to end — ~10ms
      </figcaption>
    </figure>
  );
}
