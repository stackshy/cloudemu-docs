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
 * Manual note: a boxed sidenote in the Field Manual. A faint raised paper
 * ground, a semantic left rail, and a ruled header carrying a mono label —
 * the way a printed reference sets an aside. Rail color is semantic; plain
 * notes stay neutral, only warnings/dangers earn a colored rail.
 */
const VARIANT: Record<string, { label: string; rail: string }> = {
  info: { label: 'Note', rail: 'var(--border-2)' },
  tip: { label: 'Tip', rail: 'var(--ok)' },
  idea: { label: 'Tip', rail: 'var(--ok)' },
  warn: { label: 'Warning', rail: 'var(--warn)' },
  warning: { label: 'Warning', rail: 'var(--warn)' },
  error: { label: 'Danger', rail: 'var(--danger)' },
  danger: { label: 'Danger', rail: 'var(--danger)' },
  success: { label: 'OK', rail: 'var(--ok)' },
};

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
    <aside
      className="not-prose my-6 overflow-hidden rounded-[4px] border border-line bg-surface"
      style={{ borderLeft: `3px solid ${v.rail}` }}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-3">
          {v.label}
        </span>
        {title && (
          <span className="font-serif text-[15px] font-medium text-ink">{title}</span>
        )}
      </div>
      <div className="space-y-2 px-4 py-3 text-sm leading-relaxed text-ink-2 [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-line-2 [&_a]:underline-offset-2 [&_code]:u-chip-code hover:[&_a]:text-accent hover:[&_a]:decoration-accent">
        {children}
      </div>
    </aside>
  );
}
