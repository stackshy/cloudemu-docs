'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/components/diagrams/use-in-view';

/**
 * One-time count-up to `to` when scrolled into view. ~700ms, ease-out
 * cubic, requestAnimationFrame. Plays once. Under prefers-reduced-motion
 * the final value renders immediately (useInView flips `on` right away
 * and the tween is skipped). `suffix` (e.g. "+") renders throughout.
 */
export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [ref, on] = useInView<HTMLSpanElement>(0.5);
  const [value, setValue] = useState(0);
  const played = useRef(false);

  useEffect(() => {
    if (!on || played.current) return;
    played.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }

    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      // ease-out cubic: fast start, gentle settle
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
