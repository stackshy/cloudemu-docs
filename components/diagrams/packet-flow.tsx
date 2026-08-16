'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Packet Flow — the signature diagram. SDK nodes on the left, the cloudemu
 * node on the right, provider-accent wires between them. Small square packets
 * travel the wires, each labeled with the real protocol it speaks; when one
 * arrives, the cloudemu node pulses and a return packet fires back.
 *
 * - `once`: plays a single pass when scrolled into view (Quick Start),
 *   otherwise loops ambiently (~1 packet per wire per 3.6s).
 * - Animations only run while on screen (IntersectionObserver) and are
 *   replaced by a static diagram under prefers-reduced-motion.
 */

const WIRES = [
  {
    id: 'aws',
    label: 'aws-sdk-go-v2',
    sub: 'AWS SDK',
    protocol: 'S3 REST',
    vivid: 'var(--aws-vivid)',
    y: 60,
  },
  {
    id: 'azure',
    label: 'azure-sdk-for-go',
    sub: 'Azure SDK',
    protocol: 'ARM JSON',
    vivid: 'var(--azure-vivid)',
    y: 150,
  },
  {
    id: 'gcp',
    label: 'cloud.google.com/go',
    sub: 'GCP SDK',
    protocol: 'GCP REST',
    vivid: 'var(--gcp-vivid)',
    y: 240,
  },
] as const;

const BOX_X = 12;
const BOX_W = 172;
const BOX_H = 46;
const NODE_X = 486;
const NODE_Y = 150;
const NODE_R = 40;
const DUR = 3.6;

/** Rotating request log rendered under the diagram — the round-trips, receipted. */
const LOG_LINES = [
  { p: 'aws', tint: 'var(--aws)', line: 'PUT /app-data/config.yaml', code: 200, ms: 9 },
  { p: 'azr', tint: 'var(--azure)', line: 'PUT …/virtualMachines/vm-1', code: 201, ms: 11 },
  { p: 'gcp', tint: 'var(--gcp)', line: 'POST /compute/v1/…/instances', code: 200, ms: 10 },
  { p: 'aws', tint: 'var(--aws)', line: 'GET /app-data/config.yaml', code: 200, ms: 8 },
  { p: 'azr', tint: 'var(--azure)', line: 'POST …/namespaces/q1/messages', code: 201, ms: 9 },
  { p: 'gcp', tint: 'var(--gcp)', line: 'POST /v1/…/topics/events:publish', code: 200, ms: 10 },
] as const;

export function PacketFlow({ once = false }: { once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [entered, setEntered] = useState(false);
  const [logN, setLogN] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && playedRef.current) return;
          playedRef.current = true;
          setRunning(true);
          if (once) {
            // one full pass, then freeze
            const t = setTimeout(() => setRunning(false), (DUR + 2.4) * 1000);
            return () => clearTimeout(t);
          }
        } else if (!once) {
          setRunning(false);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  // entrance: wires draw + nodes rise, then traffic starts
  useEffect(() => {
    if (!running) return;
    if (reduced) {
      setEntered(true);
      return;
    }
    const t = setTimeout(() => setEntered(true), 950);
    return () => clearTimeout(t);
  }, [running, reduced]);

  const animate = running && !reduced && entered;

  // request log: one receipt per beat while traffic flows
  useEffect(() => {
    if (!animate) return;
    const iv = setInterval(() => setLogN((n) => n + 1), 1400);
    return () => clearInterval(iv);
  }, [animate]);

  return (
    <div ref={ref} className="w-full select-none">
      <svg
        viewBox="0 0 600 300"
        className="h-auto w-full"
        role="img"
        aria-label="Real cloud SDKs exchanging wire-protocol packets with the in-memory cloudemu server"
      >
        {WIRES.map((w, i) => {
          const startX = BOX_X + BOX_W;
          const endX = NODE_X - NODE_R;
          const cpX = (startX + endX) / 2;
          const path = `M ${startX} ${w.y} C ${cpX} ${w.y}, ${cpX} ${NODE_Y}, ${endX} ${NODE_Y}`;
          const begin = `${i * 1.2}s`;

          return (
            <g key={w.id}>
              {/* wire — draws in on first view; brightens when its SDK is hovered */}
              <path
                d={path}
                stroke={w.vivid}
                strokeOpacity={
                  hovered ? (hovered === w.id ? 0.65 : 0.12) : 0.3
                }
                strokeWidth={hovered === w.id ? 1.6 : 1.2}
                fill="none"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={running || reduced ? 0 : 1}
                style={{
                  transition: `stroke-dashoffset 600ms var(--ease-out) ${150 + i * 150}ms, stroke-opacity 200ms var(--ease-out), stroke-width 200ms var(--ease-out)`,
                }}
              />

              {animate && (
                <>
                  {/* request packet: small square + protocol label */}
                  <g>
                    <rect
                      x="-4"
                      y="-4"
                      width="8"
                      height="8"
                      rx="1.5"
                      fill={w.vivid}
                    />
                    <text
                      x="0"
                      y="-9"
                      textAnchor="middle"
                      fontSize="7.5"
                      className="font-mono"
                      fill={w.vivid}
                      opacity="0.9"
                    >
                      {w.protocol}
                    </text>
                    <animateMotion
                      dur={`${DUR}s`}
                      begin={begin}
                      repeatCount={once ? 1 : 'indefinite'}
                      path={path}
                      keyPoints="0;0.42;1"
                      keyTimes="0;0.42;1"
                      calcMode="spline"
                      keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.05;0.42;0.46"
                      dur={`${DUR}s`}
                      begin={begin}
                      repeatCount={once ? 1 : 'indefinite'}
                    />
                  </g>

                  {/* return packet: hollow square riding the wire back */}
                  <g opacity="0">
                    <rect
                      x="-3.5"
                      y="-3.5"
                      width="7"
                      height="7"
                      rx="1.5"
                      fill="none"
                      stroke={w.vivid}
                      strokeWidth="1.5"
                    />
                    <animateMotion
                      dur={`${DUR}s`}
                      begin={begin}
                      repeatCount={once ? 1 : 'indefinite'}
                      path={path}
                      keyPoints="1;1;0.02"
                      keyTimes="0;0.52;1"
                      calcMode="spline"
                      keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0;1;1;0"
                      keyTimes="0;0.52;0.56;0.94;1"
                      dur={`${DUR}s`}
                      begin={begin}
                      repeatCount={once ? 1 : 'indefinite'}
                    />
                  </g>
                </>
              )}

              {/* SDK node — rises in with the entrance; hover brightens its wire */}
              <g
                onMouseEnter={() => setHovered(w.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  opacity: running || reduced ? 1 : 0,
                  transform: running || reduced ? 'none' : 'translateY(6px)',
                  transition: `opacity 400ms var(--ease-out) ${i * 130}ms, transform 400ms var(--ease-out) ${i * 130}ms`,
                }}
              >
              <rect
                x={BOX_X}
                y={w.y - BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                rx="6"
                fill="var(--bg-surface)"
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />
              <rect
                x={BOX_X}
                y={w.y - BOX_H / 2}
                width="2"
                height={BOX_H}
                fill={w.vivid}
                opacity="0.9"
              />
              <text
                x={BOX_X + 14}
                y={w.y - 3}
                fontSize="11"
                className="font-mono"
                fontWeight="600"
                fill="var(--text-primary)"
              >
                {w.label}
              </text>
              <text
                x={BOX_X + 14}
                y={w.y + 12}
                fontSize="8.5"
                className="font-mono"
                fill="var(--text-muted)"
              >
                {w.sub}
              </text>
              </g>
            </g>
          );
        })}

        {/* cloudemu node */}
        <g>
          {animate &&
            WIRES.map((w, i) => (
              // arrival pulse ring, synced to each wire's packet arrival
              <circle
                key={w.id}
                cx={NODE_X}
                cy={NODE_Y}
                r={NODE_R}
                fill="none"
                stroke={w.vivid}
                strokeWidth="1.5"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  values={`${NODE_R};${NODE_R + 12};${NODE_R + 12}`}
                  keyTimes="0;0.2;1"
                  dur={`${DUR}s`}
                  begin={`${i * 1.2 + DUR * 0.42}s`}
                  repeatCount={once ? 1 : 'indefinite'}
                />
                <animate
                  attributeName="opacity"
                  values="0;0.7;0"
                  keyTimes="0;0.06;0.24"
                  dur={`${DUR}s`}
                  begin={`${i * 1.2 + DUR * 0.42}s`}
                  repeatCount={once ? 1 : 'indefinite'}
                />
              </circle>
            ))}
          <g
            style={{
              opacity: running || reduced ? 1 : 0,
              transition: 'opacity 500ms var(--ease-out) 550ms',
            }}
          >
          <circle
            cx={NODE_X}
            cy={NODE_Y}
            r={NODE_R}
            fill="var(--bg-surface)"
            stroke="var(--border-2)"
            strokeWidth="1.2"
          />
          <text
            x={NODE_X}
            y={NODE_Y - 6}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="var(--text-primary)"
          >
            cloudemu
          </text>
          <text
            x={NODE_X}
            y={NODE_Y + 8}
            textAnchor="middle"
            fontSize="7"
            className="font-mono"
            fill="var(--text-muted)"
          >
            in-memory
          </text>
          <text
            x={NODE_X}
            y={NODE_Y + 18}
            textAnchor="middle"
            fontSize="7"
            className="font-mono"
            fill="var(--text-muted)"
          >
            ~10ms
          </text>
          </g>
        </g>
      </svg>

      {/* request log: receipts for the round-trips above */}
      {!once && (
        <div
          aria-hidden
          className="mt-3 flex h-[54px] flex-col justify-end overflow-hidden font-mono text-[10px] leading-[18px]"
          style={{
            opacity: running || reduced ? 1 : 0,
            transition: 'opacity 500ms var(--ease-out) 900ms',
          }}
        >
          {[2, 1, 0].map((back) => {
            const idx = logN - back;
            if (idx < 0) return <div key={back} className="h-[18px]" />;
            const l = LOG_LINES[idx % LOG_LINES.length];
            return (
              <div
                key={idx}
                className="flex items-baseline gap-2 whitespace-nowrap"
                style={{ opacity: back === 0 ? 1 : back === 1 ? 0.55 : 0.3 }}
              >
                <span style={{ color: l.tint }}>{l.p}</span>
                <span className="truncate text-ink-3">{l.line}</span>
                <span className="text-ok">{l.code}</span>
                <span className="text-ink-3">{l.ms}ms</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
