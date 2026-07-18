'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Latency Ticker: counts down from "2,400ms (real cloud)" to settle on
 * "~10ms" when scrolled into view. One second, plays once.
 */
export function LatencyTicker() {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(2400);
  const [done, setDone] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(10);
      setDone(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current) return;
        played.current = true;
        io.disconnect();

        const start = performance.now();
        const dur = 1000;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          // ease-out quart: fast early drop, settles gently
          const eased = 1 - Math.pow(1 - t, 4);
          setValue(Math.round(2400 - (2400 - 10) * eased));
          if (t < 1) requestAnimationFrame(tick);
          else setDone(true);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="inline-flex items-baseline gap-1.5 tabular-nums">
      <span className={done ? 'text-ink' : 'text-ink'}>
        {done ? '~10' : value.toLocaleString()}
        <span className="text-[0.8em]">ms</span>
      </span>
      <span className="text-[0.72em] text-ink-muted">
        {done ? '/ call' : 'real cloud'}
      </span>
    </span>
  );
}
