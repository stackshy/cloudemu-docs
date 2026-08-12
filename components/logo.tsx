import type { SVGProps } from 'react';

/**
 * Logo: the cloudemu mark — motion lines, a cloud, and a terminal prompt
 * (chevron + cursor bar) inside it. "The cloud, in memory."
 *
 * Theme-adaptive: the cloud and chevron swap fills via CSS variables
 * (`--logo-cloud` / `--logo-chevron`, defined in global.css) so the mark reads
 * on both light and dark backgrounds. The cursor bar stays Ember on both — the
 * one always-warm element. The icon's aspect ratio is ~1.9:1.
 *
 * Renders crisply from favicon sizes up to display sizes.
 */
export function Logo({ style, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 150 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="cloudemu"
      role="img"
      style={{ display: 'block', flexShrink: 0, ...style }}
      {...rest}
    >
      {/* Motion lines — the "in memory" speed streaks. Solid fills with a
          descending opacity fade (no shared gradient <defs>) so they always
          paint, even when several logos share a page. */}
      <g fill="var(--logo-line, #ff6b2c)">
        <rect x="16" y="34" width="53" height="4.5" rx="2.25" opacity="0.55" />
        <rect x="10" y="46" width="49" height="4.5" rx="2.25" opacity="0.78" />
        <rect x="6" y="58" width="50" height="4.5" rx="2.25" opacity="1" />
      </g>

      {/* Cloud body */}
      <g fill="var(--logo-cloud, #f1efe7)">
        <circle cx="96" cy="45" r="23" />
        <circle cx="128" cy="53" r="16" />
        <circle cx="76" cy="55" r="15" />
        <rect x="76" y="51" width="68" height="20" rx="10" />
      </g>

      {/* Terminal prompt: chevron + Ember cursor bar */}
      <path
        d="M90 40 L99 48.5 L90 57"
        stroke="var(--logo-chevron, #101613)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="105" y="51.5" width="17" height="6" rx="3" fill="#FF6B2C" />
    </svg>
  );
}

/**
 * LogoMark: the icon paired with the wordmark, for nav bars. The wordmark uses
 * the foreground color (matching the brand lockup); the icon carries the color.
 */
export function LogoMark({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'md' | 'lg';
}) {
  const iconH = size === 'lg' ? 34 : 26;
  const iconW = Math.round(iconH * 1.92);
  const textCls = size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <span
      className={`${className ?? ''}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      <Logo
        width={iconW}
        height={iconH}
        style={{ width: iconW, height: iconH, flexShrink: 0, display: 'block' }}
      />
      <span className={`font-extrabold ${textCls} tracking-tight`}>cloudemu</span>
    </span>
  );
}
