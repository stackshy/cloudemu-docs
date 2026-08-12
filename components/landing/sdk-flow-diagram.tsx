'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * SDKFlowDiagram: four SDK clients on the left, cloudemu on the right.
 *
 * On first view the cards slide in, the colored wires draw themselves toward
 * the cloudemu node, and the node pops in — then a single packet glides along
 * each wire on a loop. Box widths fit the longest label (`cloud.google.com/go`)
 * so nothing overflows.
 */
export function SDKFlowDiagram() {
  const reduce = useReducedMotion();

  const sdks = [
    { label: 'aws-sdk-go-v2',       sub: 'AWS',   color: '#FF9900', y: 46 },
    { label: 'azure-sdk-for-go',    sub: 'Azure', color: '#0078D4', y: 118 },
    { label: 'cloud.google.com/go', sub: 'GCP',   color: '#4285F4', y: 190 },
    { label: 'oci-go-sdk',          sub: 'OCI',   color: '#C74634', y: 262 },
  ];

  // Geometry — box wide enough for the longest label at 10px font.
  const boxX = 20;
  const boxW = 170;
  const boxH = 44;
  const cloudemuX = 470;
  const cloudemuY = 154;
  const cloudemuR = 36;

  // When the wires finish drawing, the node pops and packets begin.
  const wireDrawDur = 0.9;
  const lastWireDelay = 0.35 + (sdks.length - 1) * 0.14;
  const nodeDelay = lastWireDelay + wireDrawDur * 0.5;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.svg
        viewBox="0 0 600 308"
        className="w-full h-auto"
        aria-label="cloudemu SDK-compat flow"
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.4 }}
      >
        {/* Wires + packets */}
        {sdks.map((s, i) => {
          const startX = boxX + boxW;
          const endX = cloudemuX - cloudemuR;
          const cpX = (startX + endX) / 2;
          const path = `M ${startX} ${s.y} C ${cpX} ${s.y}, ${cpX} ${cloudemuY}, ${endX} ${cloudemuY}`;
          const cardDelay = 0.1 + i * 0.12;
          const wireDelay = 0.35 + i * 0.14;

          return (
            <g key={s.sub}>
              {/* Wire — draws itself toward the cloudemu node */}
              <motion.path
                d={path}
                stroke={s.color}
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  show: {
                    pathLength: 1,
                    opacity: 0.35,
                    transition: {
                      pathLength: { duration: wireDrawDur, delay: wireDelay, ease: 'easeInOut' },
                      opacity: { duration: 0.2, delay: wireDelay },
                    },
                  },
                }}
              />

              {/* Single packet — starts once the wire has drawn */}
              {!reduce && (
                <circle r="4" fill={s.color}>
                  <animateMotion
                    dur="3.6s"
                    begin={`${nodeDelay + 0.3 + i * 0.9}s`}
                    repeatCount="indefinite"
                    path={path}
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.4 0 0.2 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.08;0.92;1"
                    dur="3.6s"
                    begin={`${nodeDelay + 0.3 + i * 0.9}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* SDK card — slides in from the left */}
              <motion.g
                variants={{
                  hidden: { opacity: 0, x: -24 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, delay: cardDelay, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <rect
                  x={boxX}
                  y={s.y - boxH / 2}
                  width={boxW}
                  height={boxH}
                  rx="10"
                  fill="var(--color-fd-card, #fff)"
                  stroke="currentColor"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
                <circle cx={boxX + 14} cy={s.y} r="4" fill={s.color} />
                <text
                  x={boxX + 26}
                  y={s.y - 3}
                  className="text-[11px] font-mono"
                  fill="currentColor"
                  fontWeight="600"
                >
                  {s.label}
                </text>
                <text
                  x={boxX + 26}
                  y={s.y + 12}
                  className="text-[9px]"
                  fill="currentColor"
                  opacity="0.55"
                >
                  {s.sub} SDK
                </text>
              </motion.g>
            </g>
          );
        })}

        {/* cloudemu node — pops in after the wires reach it */}
        <motion.g
          variants={{
            hidden: { opacity: 0, scale: 0.4 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', stiffness: 200, damping: 12, delay: nodeDelay },
            },
          }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          {/* Breathing halo — starts after the pop */}
          {!reduce && (
            <motion.circle
              cx={cloudemuX}
              cy={cloudemuY}
              r="42"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="1"
              initial={{ r: 38 }}
              animate={{ r: 46 }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: nodeDelay + 0.3,
              }}
            />
          )}
          <circle
            cx={cloudemuX}
            cy={cloudemuY}
            r={cloudemuR}
            fill="var(--color-fd-card, #fff)"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          <text
            x={cloudemuX}
            y={cloudemuY - 3}
            textAnchor="middle"
            className="text-[11px] font-bold"
            fill="currentColor"
          >
            cloudemu
          </text>
          <text
            x={cloudemuX}
            y={cloudemuY + 11}
            textAnchor="middle"
            className="text-[8px] font-mono"
            fill="currentColor"
            opacity="0.5"
          >
            httptest
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
}
