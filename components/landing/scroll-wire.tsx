'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The scroll wire — a hairline running down the left gutter with a small
 * accent packet riding it: the packet's position IS the scroll position,
 * and the mono marker ticks through the section numbers as they pass
 * (00 hero → 01…05 → $ cta). The page as a wire, navigation as a packet.
 *
 * xl-only, aria-hidden, rAF-throttled, transform-based. Hidden entirely
 * under prefers-reduced-motion.
 */

const LABELS = ['00', '01', '02', '03', '04', '05', '$'];

export function ScrollWire() {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState('00');
  const [hidden, setHidden] = useState(true);
  const ticking = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setHidden(false);

    const update = () => {
      ticking.current = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('main > section'),
      );
      const mid = window.scrollY + window.innerHeight / 2;
      let idx = 0;
      sections.forEach((s, i) => {
        if (s.offsetTop <= mid) idx = i;
      });
      setLabel(LABELS[Math.min(idx, LABELS.length - 1)]);
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="fixed left-7 top-1/2 z-30 hidden h-[42vh] -translate-y-1/2 flex-col items-center gap-3 xl:flex"
    >
      <span className="font-mono text-[10px] tabular-nums text-ink-3">
        {label}
      </span>
      <div className="relative w-px flex-1 bg-line">
        {/* the packet: position = scroll progress */}
        <span
          className="absolute -left-[2.5px] size-1.5 rounded-[1.5px] bg-accent"
          style={{
            top: `calc(${(progress * 100).toFixed(2)}% - 3px)`,
            transition: 'top 120ms linear',
          }}
        />
      </div>
      <span className="font-mono text-[10px] text-ink-3">$</span>
    </div>
  );
}
