'use client';

import { motion } from 'framer-motion';

/**
 * SDKFlowDiagram: three SDK clients on the left, cloudemu on the right, one
 * packet at a time gliding along each wire. Box widths fit the longest label
 * (`cloud.google.com/go`) so nothing overflows.
 */
export function SDKFlowDiagram() {
  const sdks = [
    { label: 'aws-sdk-go-v2',       sub: 'AWS',   color: '#FF9900', y: 60 },
    { label: 'azure-sdk-for-go',    sub: 'Azure', color: '#0078D4', y: 140 },
    { label: 'cloud.google.com/go', sub: 'GCP',   color: '#4285F4', y: 220 },
  ];

  // Geometry — box wide enough for the longest label at 10px font.
  const boxX = 20;
  const boxW = 170;
  const boxH = 44;
  const cloudemuX = 470;
  const cloudemuY = 140;
  const cloudemuR = 36;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 600 280"
        className="w-full h-auto"
        aria-label="cloudemu SDK-compat flow"
      >
        {/* Wires + packets */}
        {sdks.map((s, i) => {
          const startX = boxX + boxW;
          const endX = cloudemuX - cloudemuR;
          const cpX = (startX + endX) / 2;
          const path = `M ${startX} ${s.y} C ${cpX} ${s.y}, ${cpX} ${cloudemuY}, ${endX} ${cloudemuY}`;

          return (
            <g key={s.sub}>
              {/* Static wire */}
              <path
                d={path}
                stroke={s.color}
                strokeOpacity="0.35"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Single packet — staggered, smooth */}
              <circle r="4" fill={s.color}>
                <animateMotion
                  dur="3.6s"
                  begin={`${i * 1.2}s`}
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
                  begin={`${i * 1.2}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* SDK card */}
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
            </g>
          );
        })}

        {/* cloudemu node */}
        <g>
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
            }}
          />
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
        </g>
      </svg>
    </div>
  );
}
