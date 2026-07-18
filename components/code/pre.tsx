'use client';

import {
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { WrapText } from 'lucide-react';
import { CopyButton } from './copy-button';

/** Tiny mono language marks — no emoji, no logos. */
const LANG_MARK: Record<string, string> = {
  go: 'GO',
  json: '{}',
  yaml: 'YML',
  diff: '±',
  text: 'TXT',
};

const TERMINAL_LANGS = new Set(['bash', 'sh', 'shell', 'console', 'zsh']);

/**
 * MDX `pre` override — ONE code surface for the whole site.
 *
 * - bash/sh/console → Terminal chrome: darker pane, muted `$` prompts
 *   (drawn in CSS so copy never includes them), no line numbers.
 * - everything else → CodeBlock chrome: mono filename header, wrap toggle,
 *   copy button, optional shiki line highlight/diff/focus.
 */
export function CodePre({
  title,
  children,
  className: incomingClassName,
  ...rest
}: ComponentProps<'pre'> & { title?: string; icon?: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [wrap, setWrap] = useState(false);
  // keep shiki's own classes ("shiki", theme names, has-focused, …) —
  // the theme-switch and highlight CSS key off them
  const shikiClasses = incomingClassName ?? '';
  const lang = (rest as Record<string, unknown>)['data-language'] as
    | string
    | undefined;
  const text = () => preRef.current?.textContent ?? '';

  // strip fumadocs' icon prop from the DOM
  delete (rest as Record<string, unknown>).icon;

  if (lang && TERMINAL_LANGS.has(lang)) {
    return (
      <figure className="u-terminal not-prose group relative my-4 overflow-hidden rounded-lg border border-line bg-inset">
        <CopyButton
          target={text}
          className="absolute right-2 top-2 z-10 text-ink-inset-muted hover:bg-white/10 hover:text-ink-inset"
        />
        <pre
          ref={preRef}
          {...rest}
          className={`${shikiClasses} overflow-x-auto px-4 py-3.5 text-[13px] leading-[1.65] text-ink-inset`}
        >
          {children}
        </pre>
      </figure>
    );
  }

  return (
    <figure className="u-codeblock not-prose group my-4 overflow-hidden">
      <figcaption className="flex items-center gap-2 border-b border-line bg-surface px-3.5 py-1.5">
        {lang && (
          <span
            aria-hidden
            className="rounded-[3px] border border-line px-1 py-px font-mono text-[10px] font-medium tracking-wider text-ink-3"
          >
            {LANG_MARK[lang] ?? lang.toUpperCase()}
          </span>
        )}
        <span className="truncate font-mono text-xs text-ink-3">
          {title ?? ''}
        </span>
        <button
          type="button"
          aria-label="Toggle line wrap"
          aria-pressed={wrap}
          onClick={() => setWrap((w) => !w)}
          className={`ms-auto rounded p-1.5 transition-colors hover:bg-raised hover:text-ink ${
            wrap ? 'text-ink' : 'text-ink-3'
          }`}
        >
          <WrapText className="size-3.5" />
        </button>
        <CopyButton target={text} />
      </figcaption>
      <pre
        ref={preRef}
        {...rest}
        className={`${shikiClasses} overflow-x-auto py-3.5 text-[13px] leading-[1.65] ${
          wrap ? '[&_code]:whitespace-pre-wrap' : ''
        }`}
      >
        {children}
      </pre>
    </figure>
  );
}
