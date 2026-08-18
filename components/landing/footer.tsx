'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { STATS } from '@/lib/product';
import { services } from '@/lib/services';
import { LogoMark } from '@/components/logo';
import { DeployBadge } from '@/components/deploy-badge';

type FooterLink = {
  label: string;
  href: string;
  /** External links open in a new tab and carry rel=noreferrer. */
  external?: boolean;
};

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Docs',
    links: [
      { label: 'Quick start', href: '/docs/quick-start' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Portable API', href: '/docs/portable-api' },
      { label: 'All docs', href: '/docs' },
    ],
  },
  {
    heading: 'Blog',
    links: [{ label: 'Latest posts', href: '/blog' }],
  },
  {
    heading: 'GitHub',
    links: [
      { label: 'Repository', href: 'https://github.com/stackshy/cloudemu', external: true },
      { label: 'Issues', href: 'https://github.com/stackshy/cloudemu/issues', external: true },
      { label: 'Releases', href: 'https://github.com/stackshy/cloudemu/releases', external: true },
    ],
  },
];

/**
 * Footer — the editorial site footer.
 *
 * A hairline-bordered slab: the cloudemu wordmark and a one-line sign-off on the
 * left, three real link columns (Docs, Blog, GitHub) on the right, and a
 * monospace bottom line stating the license and Go version. The accent shows up
 * once, on the wordmark's terminal caret. Reveals once on scroll via `fadeUp`;
 * static when the viewer prefers reduced motion.
 */
export function Footer() {
  const reduce = useReducedMotion();
  const implementations = services.length * STATS.clouds;

  return (
    <footer className="relative w-full border-t border-line bg-surface/30">
      <motion.div
        variants={reduce ? undefined : staggerContainer(0.08)}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
        className="mx-auto w-full max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <motion.div
            variants={reduce ? undefined : fadeUp(0, 12)}
            className="max-w-sm"
          >
            <LogoMark />
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              The cloud, in memory
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              {implementations} in-memory cloud service implementations across AWS, Azure, and GCP.
              Your real cloud SDKs call it unchanged — no cloud accounts, no bills.
            </p>
            <p className="mt-4 text-sm text-ink-2">
              Run it in-process, as a standalone server, or in Docker — from any language.
            </p>
          </motion.div>

          <motion.nav
            variants={reduce ? undefined : fadeUp(0, 12)}
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3"
          >
            {COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-3">
                <h2 className="u-eyebrow">{column.heading}</h2>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-ink-2 transition-colors hover:text-ink"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-ink-2 transition-colors hover:text-ink"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.nav>
        </div>

        <motion.div
          variants={reduce ? undefined : fadeUp(0, 12)}
          className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-mono text-xs tracking-wide text-ink-3">
            MIT License &middot; Requires Go 1.25+ &middot; an open-source project
          </p>
          <DeployBadge />
        </motion.div>
      </motion.div>
    </footer>
  );
}
