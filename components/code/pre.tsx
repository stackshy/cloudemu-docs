'use client';

import {
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { Check, Copy } from 'lucide-react';

/** Tiny mono language marks — no emoji, no logos. */
const LANG_MARK: Record<string, string> = {
  go: 'GO',
  json: '{}',
  yaml: 'YML',
  diff: '±',
  text: 'TXT',
};

const TERMINAL_LANGS = new Set(['bash', 'sh', 'shell', 'console', 'zsh']);

function CopyButton({
  target,
  className = '',
}: {
  target: () => string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={async () => {
        await navigator.clipboard.writeText(target());
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`rounded p-1.5 text-ink-muted transition-colors hover:bg-raised hover:text-ink ${className}`}
    >
      {copied ? (
        <Check className="size-3.5 text-signal" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

/**
 * MDX `pre` override — ONE code surface for the whole site.
 *
 * - bash/sh/console → Terminal chrome: inset pane, accent `$` prompts
 *   (drawn in CSS so copy never includes them), no line numbers.
 * - everything else → CodeBlock chrome: filename header with a mono
 *   language mark, copy button, optional shiki line numbers/diff/focus.
 */
export function CodePre({
  title,
  children,
  ...rest
}: ComponentProps<'pre'> & { title?: string; icon?: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
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
          className="overflow-x-auto px-4 py-3.5 text-[13px] leading-[1.65] text-ink-inset"
        >
          {children}
        </pre>
      </figure>
    );
  }

  return (
    <figure className="u-codeblock not-prose group my-4 overflow-hidden">
      <figcaption className="flex items-center gap-2 border-b border-line bg-surface px-3.5 py-2">
        {lang && (
          <span
            aria-hidden
            className="rounded-[3px] border border-line px-1 py-px font-mono text-[10px] font-medium tracking-wider text-ink-muted"
          >
            {LANG_MARK[lang] ?? lang.toUpperCase()}
          </span>
        )}
        <span className="truncate font-mono text-xs text-ink-secondary">
          {title ?? ''}
        </span>
        <CopyButton target={text} className="ms-auto" />
      </figcaption>
      <pre
        ref={preRef}
        {...rest}
        className="overflow-x-auto py-3.5 text-[13px] leading-[1.65]"
      >
        {children}
      </pre>
    </figure>
  );
}
