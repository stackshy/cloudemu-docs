'use client';

import { useEffect, useRef, useState } from 'react';

/** Fixed scroll-progress bar (ember) pinned to the top of the viewport. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      el.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <div className="cl-prog" ref={ref} aria-hidden="true" />;
}

/** Counts up to `to` when scrolled into view. Reduced-motion shows `to` at once. */
export function CountUp({ to, prefix = '', className }: { to: number; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(to); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1100; let start: number | null = null;
        const step = (ts: number) => {
          if (start === null) start = ts;
          const p = Math.min(1, (ts - start) / dur);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className={className}>{prefix}{val}</span>;
}
