'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

/** The one accent color — ember on warm charcoal. Used sparingly. */
const EMBER = '#FF6B2C';

/** Join truthy class fragments. Local so this file stays self-contained. */
function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

type KickerProps = {
  /** Optional section number, rendered in ember and zero-padded as-passed (e.g. "01"). */
  index?: string;
  /** The eyebrow label. Rendered uppercase, letter-spaced. */
  children: React.ReactNode;
  className?: string;
};

/**
 * Kicker — a monospace eyebrow.
 *
 * Renders `01 — THE PROBLEM`: the index in ember, an em-dash separator, then the
 * label in uppercase with wide tracking. Omit `index` for a bare label.
 *
 * @example
 * <Kicker index="01">The problem</Kicker>
 * <Kicker>How it works</Kicker>
 */
export function Kicker({ index, children, className }: KickerProps) {
  return (
    <span
      className={join(
        'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fd-muted-foreground',
        className,
      )}
    >
      {index && (
        <>
          <span style={{ color: EMBER }}>{index}</span>
          <span aria-hidden className="text-fd-muted-foreground/60">
            —
          </span>
        </>
      )}
      <span>{children}</span>
    </span>
  );
}

type SectionHeaderProps = {
  /** Optional section number for the kicker (e.g. "02"). */
  index?: string;
  /** Optional eyebrow label above the title. */
  kicker?: React.ReactNode;
  /** The section heading. */
  title: React.ReactNode;
  /** Optional supporting paragraph under the title. */
  lede?: React.ReactNode;
  /** Text alignment. 'center' centers the block; 'left' (default) is flush-left. */
  align?: 'left' | 'center';
  className?: string;
};

/**
 * SectionHeader — the editorial header every home section leads with.
 *
 * Stacks an optional {@link Kicker}, an `<h2>` title, and an optional lede
 * paragraph. The three reveal in sequence (kicker → title → lede) via
 * `staggerChildren` using `fadeUp`, triggered `whileInView` once. When the
 * viewer prefers reduced motion, everything renders static.
 *
 * @example
 * <SectionHeader
 *   index="01"
 *   kicker="The problem"
 *   title="Run real cloud SDKs without a real cloud."
 *   lede="No accounts, no Docker, no network."
 * />
 */
export function SectionHeader({
  index,
  kicker,
  title,
  lede,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const reduce = useReducedMotion();
  const centered = align === 'center';

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer(0.08)}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={viewportOnce}
      className={join(
        'flex flex-col gap-4',
        centered && 'items-center text-center',
        className,
      )}
    >
      {kicker && (
        <motion.div variants={reduce ? undefined : fadeUp(0, 12)}>
          <Kicker index={index}>{kicker}</Kicker>
        </motion.div>
      )}

      <motion.h2
        variants={reduce ? undefined : fadeUp(0, 12)}
        className="text-3xl font-bold tracking-tight sm:text-4xl"
      >
        {title}
      </motion.h2>

      {lede && (
        <motion.p
          variants={reduce ? undefined : fadeUp(0, 12)}
          className={join(
            'max-w-2xl text-lg text-fd-muted-foreground',
            centered && 'mx-auto',
          )}
        >
          {lede}
        </motion.p>
      )}
    </motion.div>
  );
}
