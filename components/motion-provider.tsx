'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/** All framer-motion animations respect the user's reduced-motion setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
