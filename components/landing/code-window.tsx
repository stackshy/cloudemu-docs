import type { ReactNode } from 'react';

/**
 * Terminal — a dark "instrument screen" that reads the same in both themes.
 * Used to demo the real-emulator flow: run cloudemu, then point real code / a
 * CLI at the printed endpoint. Prompts (`$`) are drawn, not part of the text.
 */
type TermLine =
  | { kind: 'cmd'; text: ReactNode }
  | { kind: 'out'; text: ReactNode }
  | { kind: 'comment'; text: ReactNode }
  | { kind: 'blank' };

export function Terminal({
  title = 'bash',
  lines,
  className = '',
}: {
  title?: string;
  lines: TermLine[];
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line ${className}`}
      style={{ background: 'var(--terminal-bg)' }}
    >
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-2.5 dark:border-white/10">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-black/20 dark:bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/20 dark:bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/20 dark:bg-white/20" />
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: 'var(--terminal-muted)' }}
        >
          {title}
        </span>
      </div>
      <pre
        className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.75]"
        style={{ color: 'var(--terminal-ink)' }}
      >
        {lines.map((line, i) => {
          if (line.kind === 'blank') return <div key={i}>{' '}</div>;
          if (line.kind === 'comment')
            return (
              <div key={i} style={{ color: 'var(--terminal-muted)', fontStyle: 'italic' }}>
                {line.text}
              </div>
            );
          if (line.kind === 'out')
            return (
              <div key={i} style={{ color: 'var(--terminal-muted)' }}>
                {line.text}
              </div>
            );
          return (
            <div key={i} className="flex gap-2">
              <span aria-hidden style={{ color: 'var(--accent)' }}>
                $
              </span>
              <span>{line.text}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

/**
 * CodeWindow — the landing's code-as-hero primitive. Static (no perpetual
 * animation), legible on mobile, and themed entirely off the shared code
 * tokens (`--code-*` via the .tok-* classes) so it matches the docs Shiki
 * theme in both light and dark. Pass pre-tokenized <span class="tok-*"> lines.
 */
export function CodeWindow({
  filename,
  lang,
  children,
  className = '',
}: {
  filename: string;
  lang?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-raised ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line-2" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-2" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-2" />
        </span>
        <span className="font-mono text-xs text-ink-3">{filename}</span>
        {lang && (
          <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-ink-3">
            {lang}
          </span>
        )}
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.7] text-ink-2">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/* Token helpers — keep hero snippets readable and on-theme. */
export const K = ({ children }: { children: ReactNode }) => (
  <span className="tok-k">{children}</span>
);
export const S = ({ children }: { children: ReactNode }) => (
  <span className="tok-s">{children}</span>
);
export const C = ({ children }: { children: ReactNode }) => (
  <span className="tok-c">{children}</span>
);
export const T = ({ children }: { children: ReactNode }) => (
  <span className="tok-t">{children}</span>
);
export const F = ({ children }: { children: ReactNode }) => (
  <span className="tok-f">{children}</span>
);
