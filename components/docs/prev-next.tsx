import Link from '@/components/link';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';

/**
 * Prev/next page furniture: two mono text links on a hairline-topped
 * footer row — no cards. Hover goes accent.
 */
export function PrevNext({ url }: { url: string }) {
  const { previous, next } = findNeighbour(source.pageTree, url);
  if (!previous && !next) return null;

  return (
    <div className="not-prose mt-12 flex items-center justify-between gap-4 border-t border-line pt-6 font-mono text-[13px]">
      {previous ? (
        <Link
          href={previous.url}
          className="text-ink-2 transition-colors hover:text-accent"
        >
          ← {previous.name}
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next && (
        <Link
          href={next.url}
          className="text-right text-ink-2 transition-colors hover:text-accent"
        >
          {next.name} →
        </Link>
      )}
    </div>
  );
}
