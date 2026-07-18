'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

const CMD = 'go get github.com/stackshy/cloudemu/v2';

/**
 * Terminal Type-On: the install command types itself (30ms/char) with a
 * blinking block cursor on first view, then rests. Copy button appears
 * after typing completes and never copies the prompt.
 */
export function TerminalTypeOn() {
  const ref = useRef<HTMLDivElement>(null);
  const [chars, setChars] = useState(0);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);
  const done = chars >= CMD.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChars(CMD.length);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const iv = setInterval(() => {
          setChars((c) => {
            if (c >= CMD.length) {
              clearInterval(iv);
              return c;
            }
            return c + 1;
          });
        }, 30);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 rounded-lg border border-line bg-inset px-4 py-3 font-mono text-[13px] text-ink-inset"
    >
      <span aria-hidden className="select-none text-signal">
        $
      </span>
      <span className="flex-1 whitespace-nowrap" aria-label={CMD}>
        {CMD.slice(0, chars)}
        <span
          aria-hidden
          className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] bg-signal"
          style={{
            animation: done ? 'none' : 'u-blink 1s step-end infinite',
            opacity: done ? 0 : 1,
          }}
        />
      </span>
      <button
        type="button"
        aria-label="Copy install command"
        onClick={async () => {
          await navigator.clipboard.writeText(CMD);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className={`rounded p-1.5 text-ink-inset-muted transition-all duration-300 hover:bg-white/10 hover:text-ink-inset ${
          done ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {copied ? (
          <Check className="size-3.5 text-signal" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  );
}
