'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Shared one-shot in-view trigger for diagrams: returns [ref, on].
 * `on` flips true the first time the element crosses the threshold and
 * immediately under prefers-reduced-motion (diagrams then render their
 * settled state with no motion).
 */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, on] as const;
}

/** True when the user prefers reduced motion (client only; false on SSR). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  return reduced;
}
