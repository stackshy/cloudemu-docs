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
      viewBox="2 2 29 22"
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
          y1="2"
          x2="31"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Cloud silhouette — built from overlapping circles + a rounded base */}
      <g>
        <circle cx="9" cy="15" r="7" fill="url(#cloudemu-logo-gradient)" />
        <circle cx="18" cy="11" r="9" fill="url(#cloudemu-logo-gradient)" />
        <circle cx="25" cy="15" r="6" fill="url(#cloudemu-logo-gradient)" />
        <rect
          x="6"
          y="14"
          width="22"
          height="10"
          rx="5"
          fill="url(#cloudemu-logo-gradient)"
        />
      </g>

      {/* Three connected service nodes inside — AWS / Azure / GCP, abstracted */}
      <path
        d="M11 19L18 22L25 19"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="11" cy="19" r="1.6" fill="white" />
      <circle cx="18" cy="22" r="1.6" fill="white" />
      <circle cx="25" cy="19" r="1.6" fill="white" />
    </svg>
  );
}

/**
 * LogoMark: same icon paired with the wordmark, suitable for nav bars.
 */
export function LogoMark({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'md' | 'lg';
}) {
  const iconPx = size === 'lg' ? 36 : 28;
  const textCls = size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <Logo width={iconPx} height={iconPx} />
      <span className={`font-bold ${textCls} tracking-tight`}>
        <span className="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
          cloud
        </span>
        emu
      </span>
    </span>
  );
}
