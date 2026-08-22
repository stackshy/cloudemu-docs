'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * The one copy button, shared by every code surface on the site.
 * Icon morphs to a check for 1.6s after copying.
 */
export function CopyButton({
  target,
  text,
  className = '',
}: {
  /** returns the text to copy at click time (client callers) */
  target?: () => string;
  /** static text to copy (serializable — usable from server components) */
  text?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={async () => {
        await navigator.clipboard.writeText(text ?? target?.() ?? '');
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`rounded p-1.5 text-ink-3 transition-colors hover:bg-raised hover:text-ink ${className}`}
    >
      {copied ? (
        <Check className="size-3.5 text-ok" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}
