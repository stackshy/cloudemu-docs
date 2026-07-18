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

export function PacketFlow({ once = false }: { once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);
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

  const animate = running && !reduced;

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
              {/* wire */}
              <path
                d={path}
                stroke={w.vivid}
                strokeOpacity="0.3"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
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

              {/* SDK node */}
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
          <circle
            cx={NODE_X}
            cy={NODE_Y}
            r={NODE_R}
            fill="var(--bg-surface)"
            stroke="var(--accent)"
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
          <text
            x={NODE_X}
            y={NODE_Y - 4}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="var(--text-primary)"
          >
            cloudemu
          </text>
          <text
            x={NODE_X}
            y={NODE_Y + 11}
            textAnchor="middle"
            fontSize="8"
            className="font-mono"
            fill="var(--text-muted)"
          >
            in-memory · ~10ms
          </text>
        </g>
      </svg>
    </div>
  );
}
