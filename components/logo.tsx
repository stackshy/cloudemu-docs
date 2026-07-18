import type { SVGProps } from 'react';

/**
 * Logo: a cloud silhouette holding three connected nodes — the three
 * providers emulated inside cloudemu. Monochrome: the mark inherits
 * currentColor so it sits quietly in any context.
 *
 * Renders crisply from 16px (favicon) up to display sizes.
 */
export function Logo({ style, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="cloudemu"
      role="img"
      style={{ display: 'block', flexShrink: 0, color: 'var(--text-1)', ...style }}
      {...rest}
    >
      {/* Cloud silhouette — overlapping circles + a rounded base */}
      <g fill="currentColor">
        <circle cx="9" cy="15" r="7" />
        <circle cx="18" cy="11" r="9" />
        <circle cx="25" cy="15" r="6" />
        <rect x="6" y="14" width="22" height="10" rx="5" />
      </g>

      {/* Three connected service nodes, knocked out of the silhouette */}
      <path
        d="M11 19L18 22L25 19"
        stroke="var(--bg)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="11" cy="19" r="1.6" fill="var(--bg)" />
      <circle cx="18" cy="22" r="1.6" fill="var(--bg)" />
      <circle cx="25" cy="19" r="1.6" fill="var(--bg)" />
    </svg>
  );
}

/**
 * LogoMark: icon + wordmark for nav bars. Solid ink — no accent letters.
 */
export function LogoMark({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'md' | 'lg';
}) {
  const iconPx = size === 'lg' ? 30 : 24;
  const textCls = size === 'lg' ? 'text-xl' : 'text-[17px]';

  return (
    <span
      className={`${className ?? ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Logo
        width={iconPx}
        height={iconPx}
        style={{ width: iconPx, height: iconPx, flexShrink: 0, display: 'block' }}
      />
      <span className={`font-semibold ${textCls} tracking-tight text-ink`}>
        cloudemu
      </span>
    </span>
  );
}
