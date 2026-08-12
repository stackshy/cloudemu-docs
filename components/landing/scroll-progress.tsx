'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress: a thin fixed bar at the very top of the page that fills
 * left→right as the reader scrolls. Ember gradient, soft spring, origin-left.
 *
 * Reduced-motion: skips the spring and tracks scrollYProgress directly — it
 * still reflects position, just without the easing.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const scaleX = reduce ? scrollYProgress : smooth;

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: 'left',
        background:
          'linear-gradient(90deg, hsl(18 100% 59% / 0.85), hsl(18 100% 59%) 60%, hsl(19 90% 50%))',
      }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    />
  );
}
