import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Shared, hook-free landing primitives. No 'use client' — usable from both the
 * server-rendered page shell and the interactive client islands.
 */

/** A manual page: outer marginalia column (§ signature + note) beside the body. */
export function Leaf({
  section,
  title,
  note,
  children,
  last,
}: {
  section: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <section className={last ? '' : 'border-b border-line'}>
      <div className="mx-auto grid max-w-[1180px] gap-5 px-5 py-16 sm:gap-11 sm:px-10 sm:py-24 md:grid-cols-[120px_minmax(0,1fr)]">
        <aside className="flex gap-6 md:block">
          <div className="u-sig">
            <b>§ {section}</b>
            {title}
          </div>
          {note && <div className="u-marginnote mt-0 max-w-[24ch] md:mt-5 md:border-t md:border-line md:pt-3.5">{note}</div>}
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3 ${className ?? ''}`}>
      {children}
    </span>
  );
}

export function BtnPrimary({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-[3px] bg-accent px-5 py-3 font-mono text-[13px] font-semibold uppercase tracking-[0.03em] text-accent-ink transition-transform hover:-translate-y-px"
    >
      {children}
    </Link>
  );
}

export function LinkArrow({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="border-b border-line-2 pb-[3px] font-mono text-[13px] uppercase tracking-[0.03em] text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </Link>
  );
}
