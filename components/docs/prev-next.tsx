import Link from 'next/link';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';

/**
 * Prev/next page furniture: two bordered cards. Mono direction label with
 * arrow, page title in text-1. Hover strengthens the border and lifts 2px —
 * no color, no fill.
 */
export function PrevNext({ url }: { url: string }) {
  const { previous, next } = findNeighbour(source.pageTree, url);
  if (!previous && !next) return null;

  return (
    <div className="not-prose mt-12 grid grid-cols-1 gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {previous ? (
        <Link
          href={previous.url}
          className="group rounded-lg border border-line p-4 transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-line-2"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
            ← Previous
          </span>
          <span className="mt-1.5 block text-sm font-medium text-ink">
            {previous.name}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next && (
        <Link
          href={next.url}
          className="group rounded-lg border border-line p-4 text-right transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-line-2"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
            Next →
          </span>
          <span className="mt-1.5 block text-sm font-medium text-ink">
            {next.name}
          </span>
        </Link>
      )}
    </div>
  );
}
