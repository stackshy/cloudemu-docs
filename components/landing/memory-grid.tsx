'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * MemoryGrid — a region of memory cells. On first view it fills in waves; then
 * it stays alive: cells continuously allocate, free and change provider color,
 * with the cell count ticking — the churn of an in-memory store under load. The
 * churn pauses when off-screen (perf) and is disabled under reduced motion.
 */
const CELLS = 96;
const CLASSES = ['aws', 'az', 'gc'];

export function MemoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<Record<number, string>>({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let filled = false;
    let visible = false;
    let churn = 0;

    const rand = (n: number) => Math.floor(Math.random() * n);

    function startChurn() {
      if (reduce || churn) return;
      churn = window.setInterval(() => {
        if (!visible) return;
        setLit((prev) => {
          const next = { ...prev };
          // a handful of allocations / frees / recolors per tick
          for (let k = 0; k < 3; k++) {
            const i = rand(CELLS);
            if (next[i]) {
              if (Math.random() < 0.45) delete next[i];
              else next[i] = CLASSES[rand(3)];
            } else {
              next[i] = CLASSES[rand(3)];
            }
          }
          setCount(Object.keys(next).length);
          return next;
        });
      }, 620);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        visible = e.isIntersecting;
        if (!visible || filled) return;
        filled = true;
        const next: Record<number, string> = {};
        let n = 0;
        for (let i = 0; i < CELLS; i++) {
          if ((i * 7 + (i % 5) * 13) % 8 < 5) { next[i] = CLASSES[i % 3]; n++; }
        }
        if (reduce) { setLit(next); setCount(n); return; }
        const order = Object.keys(next).map(Number);
        order.forEach((idx, k) => {
          window.setTimeout(() => {
            setLit((prev) => ({ ...prev, [idx]: next[idx] }));
            setCount((c) => c + 1);
          }, k * 16);
        });
        window.setTimeout(startChurn, order.length * 16 + 500);
      });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); if (churn) clearInterval(churn); };
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
