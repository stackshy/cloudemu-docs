'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * MemoryGrid — a region of memory cells that light up in waves (in provider
 * colors) when scrolled into view, with a live cell counter. The "resources
 * live in RAM" idea, made literal. Reduced-motion fills instantly.
 */
const CELLS = 96;

export function MemoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<Record<number, string>>({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const classes = ['aws', 'az', 'gc'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const next: Record<number, string> = {};
        let n = 0;
        for (let i = 0; i < CELLS; i++) {
          // deterministic-ish scatter (~62% lit)
          if ((i * 7 + (i % 5) * 13) % 8 < 5) { next[i] = classes[i % 3]; n++; }
        }
        if (reduce) { setLit(next); setCount(n); return; }
        // reveal in waves
        const order = Object.keys(next).map(Number);
        let done = 0;
        order.forEach((idx, k) => {
          window.setTimeout(() => {
            setLit((prev) => ({ ...prev, [idx]: next[idx] }));
            done++; setCount(done);
          }, k * 16);
        });
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="cl-gridwrap" ref={ref}>
      <div className="cl-gridhead">
        <span>memory · <b>region us-mem-1</b></span>
        <span>{count} cells</span>
      </div>
      <div className="cl-mgrid" aria-hidden="true">
        {Array.from({ length: CELLS }).map((_, i) => (
          <div key={i} className={`cl-cell${lit[i] ? ' on ' + lit[i] : ''}`} />
        ))}
      </div>
    </div>
  );
}
