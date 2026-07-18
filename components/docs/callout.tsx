import type { ReactNode } from 'react';

type CalloutType =
  | 'info'
  | 'warn'
  | 'warning'
  | 'error'
  | 'danger'
  | 'success'
  | 'tip'
  | 'idea';

/**
 * Rail color is semantic: plain notes stay neutral; only warnings/dangers
 * earn a colored rail. Labels are always muted mono — never colored text.
 */
const VARIANT: Record<string, { label: string; rail: string }> = {
  info: { label: 'NOTE', rail: 'var(--border-2)' },
  tip: { label: 'TIP', rail: 'var(--ok)' },
  idea: { label: 'TIP', rail: 'var(--ok)' },
  warn: { label: 'WARNING', rail: 'var(--warn)' },
  warning: { label: 'WARNING', rail: 'var(--warn)' },
  error: { label: 'DANGER', rail: 'var(--danger)' },
  danger: { label: 'DANGER', rail: 'var(--danger)' },
  success: { label: 'OK', rail: 'var(--ok)' },
};

/**
 * Quiet callout: bg-2 surface, 3px semantic left rail, 13px mono label,
 * body in text-2. Replaces fumadocs' Callout via the MDX components map.
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
      style={{ boxShadow: `inset 3px 0 0 ${v.rail}` }}
    >
      <p className="mb-1.5 flex items-center gap-2 font-mono text-[13px] font-medium tracking-[0.06em] text-ink-3">
        {v.label}
        {title && (
          <span className="font-sans text-[13px] font-semibold normal-case tracking-normal text-ink">
            {title}
          </span>
        )}
      </p>
      <div className="space-y-2 text-ink-2 [&_code]:u-chip-code [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-line-2 [&_a]:underline-offset-2 hover:[&_a]:text-accent hover:[&_a]:decoration-accent">
        {children}
      </div>
    </div>
  );
}
