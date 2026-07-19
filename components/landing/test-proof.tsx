'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/components/diagrams/use-in-view';

const CMD = 'go test ./storage';

/**
 * Test-run proof line under the MorphCode: on first view the command types
 * on (24ms/char) after the `$ `, then after a 350ms beat the result fades
 * in (250ms). One-time; under prefers-reduced-motion the full line renders
 * immediately.
 */
export function TestProof() {
  const [ref, on] = useInView<HTMLParagraphElement>(0.6);
  const [chars, setChars] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const typed = chars >= CMD.length;

  useEffect(() => {
    if (!on) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChars(CMD.length);
      setShowResult(true);
      return;
    }
    const iv = setInterval(() => {
      setChars((c) => {
        if (c >= CMD.length) {
          clearInterval(iv);
          return c;
        }
        return c + 1;
      });
    }, 24);
    return () => clearInterval(iv);
  }, [on]);

  useEffect(() => {
    if (!typed || showResult) return;
    const t = setTimeout(() => setShowResult(true), 350);
    return () => clearTimeout(t);
  }, [typed, showResult]);

  return (
    <p ref={ref} className="mt-3 font-mono text-xs text-ink-3">
      <span className="select-none">$ </span>
      <span aria-label={CMD}>{CMD.slice(0, chars)}</span>
      {'  '}
      <span
        aria-hidden={!showResult}
        style={{
          opacity: showResult ? 1 : 0,
          transition: 'opacity 250ms var(--ease-out)',
        }}
      >
        <span className="text-ok">ok</span> 0.04s · real SDK, no network
      </span>
    </p>
  );
}
