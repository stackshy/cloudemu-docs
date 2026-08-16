import type { Variants } from 'framer-motion';

/** Shared motion foundation for the landing revamp.
 *  Import these so the whole page shares one easing + duration language. */

/** Signature ease-out curve used across every landing animation. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Canonical animation durations (seconds). */
export const DUR = { fast: 0.4, base: 0.6, slow: 0.9 } as const;

/** Default whileInView viewport config — reveal once, when 20% is visible. */
export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Fade + slide up. */
export const fadeUp = (delay = 0, y = 20): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE, delay } },
});

/** Plain opacity fade. */
export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE, delay } },
});

/** Fade + subtle scale up. */
export const scaleIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE, delay } },
});

/** Parent container that staggers its children's reveals. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});
