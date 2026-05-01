import type { SVGProps } from 'react';

/**
 * Logo: a stylized cloud silhouette holding three connected nodes — the three
 * cloud providers (AWS, Azure, GCP) emulated inside cloudemu. Uses an inline
 * gradient by default (sky-400 → violet-500) but accepts any styling via props.
 *
 * Square 32x32 viewBox with a naturally-proportioned cloud — 3 humps on top,
 * short flat base — so the silhouette is recognizable at every size.
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

      {/* Cloud silhouette — naturally proportioned, recognizable at any size */}
      <g>
        <circle cx="10" cy="16" r="7" fill="url(#cloudemu-logo-gradient)" />
        <circle cx="17" cy="12" r="9" fill="url(#cloudemu-logo-gradient)" />
        <circle cx="24" cy="16" r="6" fill="url(#cloudemu-logo-gradient)" />
        <rect
          x="3"
          y="15"
          width="26"
          height="11"
          rx="5.5"
          fill="url(#cloudemu-logo-gradient)"
        />
      </g>

      {/* Three connected service nodes inside — AWS / Azure / GCP, abstracted */}
      <path
        d="M11 20L17 22.5L24 20"
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="11" cy="20" r="1.6" fill="white" />
      <circle cx="17" cy="22.5" r="1.6" fill="white" />
      <circle cx="24" cy="20" r="1.6" fill="white" />
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
