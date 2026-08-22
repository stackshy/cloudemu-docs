import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — page not found',
};

/**
 * 404 — on-theme with "Collapse": the page you asked for was never written to
 * memory.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[1180px] flex-col justify-center px-5 py-24 sm:px-10">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        404 · not found
      </span>
      <h1 className="font-serif mt-4 text-[clamp(40px,8vw,88px)] font-extrabold leading-[0.9] tracking-[-0.03em] text-ink text-balance">
        This page was never<br />
        written to <span className="text-ember">memory</span>.
      </h1>
      <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink-2">
        The link you followed points to a resource that doesn&rsquo;t exist here — a typo, a moved
        page, or an old link. Head back and try again.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Link href="/" className="cl-btn-p">Home →</Link>
        <Link href="/docs" className="cl-btn-s">Read the docs</Link>
      </div>
    </main>
  );
}
