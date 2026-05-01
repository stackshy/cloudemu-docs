import type { SVGProps } from 'react';

/**
 * Logo: a stylized cloud silhouette holding three connected nodes — the three
 * cloud providers (AWS, Azure, GCP) emulated inside cloudemu. Uses an inline
 * gradient by default (sky-400 → violet-500) but accepts any styling via props.
 *
 * Renders crisply from 16px (favicon) up to display sizes.
 */
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="cloudemu"
      role="img"
      {...props}
    >
      <defs>
        <linearGradient
          id="cloudemu-logo-gradient"
          x1="2"
          y1="6"
          x2="30"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Cloud silhouette — built from overlapping circles + a rounded base */}
      <g>
        <circle cx="10" cy="17" r="5.5" fill="url(#cloudemu-logo-gradient)" />
        <circle cx="16" cy="13" r="6.5" fill="url(#cloudemu-logo-gradient)" />
        <circle cx="22" cy="16" r="5" fill="url(#cloudemu-logo-gradient)" />
        <rect
          x="9"
          y="18"
          width="14"
          height="6"
          rx="3"
          fill="url(#cloudemu-logo-gradient)"
        />
      </g>

      {/* Three connected service nodes inside — AWS / Azure / GCP, abstracted */}
      <path
        d="M11.5 19.5L16 21L20.5 19.5"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="11.5" cy="19.5" r="1.35" fill="white" />
      <circle cx="16" cy="21" r="1.35" fill="white" />
      <circle cx="20.5" cy="19.5" r="1.35" fill="white" />
    </svg>
  );
}

/**
 * LogoMark: same icon paired with the wordmark, suitable for nav bars.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <Logo width="22" height="22" />
      <span className="font-bold text-lg tracking-tight">
        <span className="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
          cloud
        </span>
        emu
      </span>
    </span>
  );
}
