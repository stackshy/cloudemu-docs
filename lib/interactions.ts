'use client';

import { useRef } from 'react';
import type { MouseEvent } from 'react';
import {
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

/** Soft spring config — low stiffness / gentle damping keeps every
 *  pointer interaction premium and understated (Linear / Vercel feel). */
const SOFT_SPRING = { stiffness: 150, damping: 15, mass: 0.4 } as const;

/** Return shape for {@link useMagnetic}. Spread `style` onto a `motion.<el>`
 *  and wire the handlers + `ref` to the SAME element. */
export interface MagneticInteraction {
  /** Attach to the element you want to drift. */
  ref: React.RefObject<HTMLElement | null>;
  /** Spread onto a `motion.<el>` — carries the spring `x` / `y` values. */
  style: { x: MotionValue<number>; y: MotionValue<number> } | Record<string, never>;
  /** Wire to `onMouseMove` of the same element. */
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  /** Wire to `onMouseLeave` of the same element. */
  onMouseLeave: () => void;
}

/**
 * Pointer-magnetic drift for buttons and cards.
 *
 * The element gently follows the cursor: on move we measure the pointer's
 * offset from the element's center and translate by `offset * strength`,
 * springing back to rest on leave. Transform-only (no layout thrash).
 *
 * Respects reduced-motion: when the user prefers reduced motion the handlers
 * are no-ops and `style` is empty, so nothing moves.
 *
 * @param strength Fraction of the pointer offset to follow (0–1). Keep it
 *   small for subtlety; the default drifts a third of the way.
 * @returns `{ ref, style, onMouseMove, onMouseLeave }` — attach all four to
 *   the same `motion.<el>`.
 *
 * @example
 * const magnetic = useMagnetic();
 * <motion.button {...} ref={magnetic.ref} style={magnetic.style}
 *   onMouseMove={magnetic.onMouseMove} onMouseLeave={magnetic.onMouseLeave} />
 */
export function useMagnetic(strength = 0.35): MagneticInteraction {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const x = useSpring(useMotionValue(0), SOFT_SPRING);
  const y = useSpring(useMotionValue(0), SOFT_SPRING);

  if (reduced) {
    return {
      ref,
      style: {},
      onMouseMove: () => {},
      onMouseLeave: () => {},
    };
  }

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, style: { x, y }, onMouseMove, onMouseLeave };
}

/** Return shape for {@link useTilt}. Spread `style` onto a `motion.<el>`
 *  and wire the handlers + `ref` to the SAME element. */
export interface TiltInteraction {
  /** Attach to the panel you want to tilt. */
  ref: React.RefObject<HTMLElement | null>;
  /** Spread onto a `motion.<el>` — carries spring rotation + perspective. */
  style:
    | { rotateX: MotionValue<number>; rotateY: MotionValue<number>; transformPerspective: number }
    | Record<string, never>;
  /** Wire to `onMouseMove` of the same element. */
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  /** Wire to `onMouseLeave` of the same element. */
  onMouseLeave: () => void;
}

/**
 * Subtle 3D tilt for a panel.
 *
 * As the pointer moves across the element we rotate it around its X/Y axes,
 * proportional to the pointer's distance from center and clamped to
 * `±max` degrees. A fixed perspective gives the parallax depth. Rotation
 * springs back to flat on leave. Transform-only.
 *
 * Respects reduced-motion: when the user prefers reduced motion the handlers
 * are no-ops and `style` is empty, so the panel stays flat.
 *
 * @param max Maximum tilt in degrees on either axis. Keep it small (a few
 *   degrees) so the effect reads as premium, not gimmicky.
 * @returns `{ ref, style, onMouseMove, onMouseLeave }` — attach all four to
 *   the same `motion.<el>`.
 *
 * @example
 * const tilt = useTilt();
 * <motion.div ref={tilt.ref} style={tilt.style}
 *   onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} />
 */
export function useTilt(max = 6): TiltInteraction {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const rotateX = useSpring(useMotionValue(0), SOFT_SPRING);
  const rotateY = useSpring(useMotionValue(0), SOFT_SPRING);

  if (reduced) {
    return {
      ref,
      style: {},
      onMouseMove: () => {},
      onMouseLeave: () => {},
    };
  }

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalized pointer position within the element: -0.5 … 0.5.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Top of panel tilts back, moving right tilts right — clamped to ±max.
    rotateX.set(-py * max * 2);
    rotateY.set(px * max * 2);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    ref,
    style: { rotateX, rotateY, transformPerspective: 800 },
    onMouseMove,
    onMouseLeave,
  };
}
