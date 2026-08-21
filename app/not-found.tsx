import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Errata — page not found',
};

/**
 * 404 — styled as an "Errata" slip in the Field Manual: the page you asked for
 * is not bound into this edition.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[1180px] flex-col justify-center px-5 py-24 sm:px-10">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        Errata · 404
      </span>
      <h1 className="font-serif mt-4 text-[clamp(40px,8vw,88px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink text-balance">
        This page isn&rsquo;t bound<br />
        into <span className="italic text-accent">this edition</span>.
      </h1>
      <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink-2">
        The reference you followed points to a leaf that doesn&rsquo;t exist here — a typo, a moved
        section, or an old link. The table of contents will get you back on the right page.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[3px] bg-accent px-5 py-3 font-mono text-[13px] font-semibold uppercase tracking-[0.03em] text-accent-ink transition-transform hover:-translate-y-px"
        >
          Front cover →
        </Link>
        <Link
          href="/docs"
          className="border-b border-line-2 pb-[3px] font-mono text-[13px] uppercase tracking-[0.03em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Table of contents
        </Link>
      </div>
    </main>
  );
}
