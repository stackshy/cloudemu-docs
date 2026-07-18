import type { ReactNode } from 'react';

type CalloutType = 'info' | 'warn' | 'warning' | 'error' | 'danger' | 'success' | 'tip' | 'idea';

const VARIANT: Record<
  string,
  { label: string; color: string; dim: string }
> = {
  info: { label: 'NOTE', color: 'var(--info)', dim: 'var(--info-dim)' },
  tip: { label: 'TIP', color: 'var(--info)', dim: 'var(--info-dim)' },
  idea: { label: 'TIP', color: 'var(--info)', dim: 'var(--info-dim)' },
  warn: { label: 'WARNING', color: 'var(--warn)', dim: 'var(--warn-dim)' },
  warning: { label: 'WARNING', color: 'var(--warn)', dim: 'var(--warn-dim)' },
  error: { label: 'DANGER', color: 'var(--error)', dim: 'var(--error-dim)' },
  danger: { label: 'DANGER', color: 'var(--error)', dim: 'var(--error-dim)' },
  success: { label: 'OK', color: 'var(--ok)', dim: 'var(--ok-dim)' },
};

/**
 * Bespoke callout: surface background, 2px semantic left rail, mono label.
 * Replaces fumadocs' Callout via the MDX components map.
 */
export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType;
  title?: ReactNode;
  children?: ReactNode;
}) {
  const v = VARIANT[type] ?? VARIANT.info;
  return (
    <div
      className="not-prose relative my-5 overflow-hidden rounded-md border border-line bg-surface py-3 pl-4 pr-4 text-sm leading-relaxed"
      style={{ boxShadow: `inset 2px 0 0 ${v.color}` }}
    >
      <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.08em]">
        <span style={{ color: v.color }}>{v.label}</span>
        {title && <span className="normal-case tracking-normal text-ink font-sans font-semibold text-[13px]">{title}</span>}
      </p>
      <div className="space-y-2 text-ink-secondary [&_a]:text-signal [&_a]:underline [&_a]:underline-offset-2 [&_code]:u-chip-code">
        {children}
      </div>
    </div>
  );
}
