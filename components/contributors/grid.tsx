'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Contributor } from '@/lib/contributors.generated';
import { tierFor, MEDALS } from '@/lib/contributor-tiers';

/**
 * ContributorGrid — an avatar wall: each person is a big tier-ringed avatar with
 * a podium medal (top three), full name, tier, and commit count beneath.
 * Presentational — the live data comes from the parent board.
 */
export function ContributorGrid({ people }: { people: Contributor[] }) {
  const reduce = useReducedMotion();

  const container = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.05 } } };
  const item = {
    hidden: reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 12 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] as const } },
  };

  return (
    <motion.div className="cw-wall" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
      {people.map((p, i) => {
        const tier = tierFor(i, p.contributions);
        const medal = i < 3 ? MEDALS[i] : null;
        return (
          <motion.a
            key={p.login}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            variants={item}
            className="cw-person"
            style={{ ['--tier' as string]: tier.color }}
          >
            <span className="cw-ava">
              <img src={p.avatar} alt={p.login} loading="lazy" />
              {medal && (
                <span className="cw-medal" style={{ ['--medal' as string]: medal }}>
                  {i + 1}
                </span>
              )}
            </span>
            <span className="cw-name">@{p.login}</span>
            <span className="cw-tier">
              <i className="cw-glyph" aria-hidden="true">{tier.glyph}</i>
              {tier.label}
            </span>
            <span className="cw-commits">
              {p.contributions.toLocaleString()} commit{p.contributions === 1 ? '' : 's'}
            </span>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
