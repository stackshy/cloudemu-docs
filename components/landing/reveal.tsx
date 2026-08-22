'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Dir = 'up' | 'down' | 'left' | 'right' | 'none';

/**
 * Reveal — the scroll-reveal wrapper. A client island that wraps server-rendered
 * children. `dir` controls where it slides in from ('right' = enters from the
 * right and settles left, etc.), `distance` the travel. Same element in every
 * case (no hydration mismatch); reduced motion starts fully visible.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  dir = 'up',
  distance,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  dir?: Dir;
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const d = distance ?? (dir === 'left' || dir === 'right' ? 64 : 24);
  const from =
    dir === 'up' ? { y: d } :
    dir === 'down' ? { y: -d } :
    dir === 'right' ? { x: d } :
    dir === 'left' ? { x: -d } : {};
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
