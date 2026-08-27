/**
 * Contributor tiers & badges — derived purely from real commit counts + rank
 * (no invented data). Tiers are named for the "Collapse" world — a cloud
 * collapsing into ever-denser objects: the Singularity everything orbits, down
 * to first-arriving Stardust. Colors are token references so they stay on-theme.
 */

export interface Tier {
  key: string;
  label: string;
  glyph: string;
  color: string; // CSS var reference
  earnedBy: string; // how the tier is reached (commit count / rank)
}

export const TIERS: Record<string, Tier> = {
  core: { key: 'core', label: 'Singularity', glyph: '◆', color: 'var(--ember)', earnedBy: 'the #1 committer' },
  architect: { key: 'architect', label: 'Quasar', glyph: '▲', color: 'var(--viz-gcp)', earnedBy: '100+ commits' },
  maintainer: { key: 'maintainer', label: 'Pulsar', glyph: '●', color: 'var(--viz-azure)', earnedBy: '20+ commits' },
  builder: { key: 'builder', label: 'Nebula', glyph: '◇', color: 'var(--gcp)', earnedBy: '5+ commits' },
  contributor: { key: 'contributor', label: 'Stardust', glyph: '·', color: 'var(--text-3)', earnedBy: 'first commits' },
};

/** The five tiers in order, for the legend. */
export const TIER_ORDER: Tier[] = [TIERS.core, TIERS.architect, TIERS.maintainer, TIERS.builder, TIERS.contributor];

export function tierFor(rank: number, commits: number): Tier {
  if (rank === 0) return TIERS.core;
  if (commits >= 100) return TIERS.architect;
  if (commits >= 20) return TIERS.maintainer;
  if (commits >= 5) return TIERS.builder;
  return TIERS.contributor;
}

/** An optional milestone pill for notable commit counts. */
export function milestone(commits: number): string | null {
  if (commits >= 500) return '500+ club';
  if (commits >= 100) return '100+ club';
  if (commits >= 25) return '25+ club';
  return null;
}

/** Medal ring colors for the podium (rank 0/1/2): gold, silver, bronze. */
export const MEDALS = ['#e0a52a', '#a9a599', '#bd7b4a'];
