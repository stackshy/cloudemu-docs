'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Chaos Timeline — a horizontal strip showing a time-bounded failure window:
 * request ticks succeed (accent) before and after the window and fail (error)
 * inside it. Draws in once when scrolled into view.
 */

const W = 640;
const H = 150;
const AXIS_Y = 96;
const WINDOW_START = 236;
const WINDOW_END = 404;

// request ticks: evenly spaced, state derived from the window
const TICKS = Array.from({ length: 17 }, (_, i) => 48 + i * 34);

export function ChaosTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="not-prose my-6 overflow-hidden rounded-lg border border-line bg-surface p-4"
    >
      <p className="u-eyebrow mb-2">chaos.Outage(sqs, 09:00 → 09:05)</p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Requests succeed before a failure window, fail inside it, and recover after it"
      >
        {/* failure window band */}
        <rect
          x={WINDOW_START}
          y={20}
          width={WINDOW_END - WINDOW_START}
          height={AXIS_Y - 12}
          fill="var(--error-dim)"
          stroke="var(--error)"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="3 3"
          rx="4"
        />
        <text
          x={(WINDOW_START + WINDOW_END) / 2}
          y={36}
          textAnchor="middle"
          fontSize="9"
          className="font-mono"
          fill="var(--error)"
        >
          FAILURE WINDOW
        </text>

        {/* time axis — draws in */}
        <line
          x1="24"
          y1={AXIS_Y}
          x2={W - 24}
          y2={AXIS_Y}
          stroke="var(--border-strong)"
          strokeWidth="1"
          strokeDasharray={W - 48}
          strokeDashoffset={inView ? 0 : W - 48}
          style={{ transition: 'stroke-dashoffset 600ms var(--ease-signal)' }}
        />

        {/* request ticks */}
        {TICKS.map((x, i) => {
          const failing = x >= WINDOW_START && x <= WINDOW_END;
          return (
            <g
              key={x}
              opacity={inView ? 1 : 0}
              style={{
                transition: `opacity 250ms var(--ease-signal) ${150 + i * 45}ms`,
              }}
            >
              <line
                x1={x}
                y1={AXIS_Y - (failing ? 18 : 28)}
                x2={x}
                y2={AXIS_Y}
                stroke={failing ? 'var(--error)' : 'var(--accent)'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {failing && (
                <text
                  x={x}
                  y={AXIS_Y - 24}
                  textAnchor="middle"
                  fontSize="8"
                  className="font-mono"
                  fill="var(--error)"
                >
                  ✕
                </text>
              )}
            </g>
          );
        })}

        {/* labels */}
        <text x="24" y={AXIS_Y + 22} fontSize="9" className="font-mono" fill="var(--text-muted)">
          08:58
        </text>
        <text x={WINDOW_START} y={AXIS_Y + 22} fontSize="9" textAnchor="middle" className="font-mono" fill="var(--text-muted)">
          09:00
        </text>
        <text x={WINDOW_END} y={AXIS_Y + 22} fontSize="9" textAnchor="middle" className="font-mono" fill="var(--text-muted)">
          09:05
        </text>
        <text x={W - 24} y={AXIS_Y + 22} fontSize="9" textAnchor="end" className="font-mono" fill="var(--text-muted)">
          09:07
        </text>

        {/* legend */}
        <g fontSize="9" className="font-mono">
          <line x1="24" y1={H - 14} x2="36" y2={H - 14} stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
          <text x="42" y={H - 11} fill="var(--text-muted)">request OK</text>
          <line x1="128" y1={H - 14} x2="140" y2={H - 14} stroke="var(--error)" strokeWidth="2.5" strokeLinecap="round" />
          <text x="146" y={H - 11} fill="var(--text-muted)">ServiceUnavailable</text>
        </g>
      </svg>
    </div>
  );
}
