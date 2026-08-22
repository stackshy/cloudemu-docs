import Link from '@/components/link';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';

/**
 * Prev/next — page pagination. A ruled footer with two cards: a mono
 * "PREVIOUS / NEXT" label over the destination title. Warms to ember on hover.
 */
export function PrevNext({ url }: { url: string }) {
  const { previous, next } = findNeighbour(source.pageTree, url);
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Page navigation"
      className="not-prose mt-16 grid grid-cols-2 gap-4 border-t border-line pt-7"
    >
      {previous ? (
        <Link href={previous.url} className="group flex flex-col gap-1.5 text-left">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            ← Previous
          </span>
          <span className="font-serif text-lg font-medium leading-tight text-ink transition-colors group-hover:text-accent">
            {previous.name}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next ? (
        <Link href={next.url} className="group flex flex-col items-end gap-1.5 text-right">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            Next →
          </span>
          <span className="font-serif text-lg font-medium leading-tight text-ink transition-colors group-hover:text-accent">
            {next.name}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
}
