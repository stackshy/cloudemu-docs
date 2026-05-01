import type { SVGProps } from 'react';

/**
 * Logo: a stylized cloud silhouette holding three connected nodes — the three
 * cloud providers (AWS, Azure, GCP) emulated inside cloudemu. Uses an inline
 * gradient by default (sky-400 → violet-500) but accepts any styling via props.
 *
 * Designed to fill a square 32x32 viewBox so it renders consistently at every
 * size (16px favicon, 28px nav, 56px hero anchor, 96px README) and works the
 * same on a transparent background and inside any container.
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
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Cloud silhouette — fills the 32x32 canvas */}
      <g>
        <circle cx="9" cy="15" r="8" fill="url(#cloudemu-logo-gradient)" />
        <circle cx="18" cy="11" r="11" fill="url(#cloudemu-logo-gradient)" />
        <circle cx="25" cy="15" r="7" fill="url(#cloudemu-logo-gradient)" />
        <rect
          x="2"
          y="14"
          width="28"
          height="18"
          rx="9"
          fill="url(#cloudemu-logo-gradient)"
        />
      </g>

      {/* Three connected service nodes inside — AWS / Azure / GCP, abstracted */}
      <path
        d="M11 22L18 26L25 22"
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="11" cy="22" r="1.8" fill="white" />
      <circle cx="18" cy="26" r="1.8" fill="white" />
      <circle cx="25" cy="22" r="1.8" fill="white" />
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
