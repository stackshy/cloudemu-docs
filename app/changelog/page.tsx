import type { Metadata } from 'next';
import { Ledger } from '@/components/changelog/ledger';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Every cloudemu release, newest first — the official release notes for the emulator.',
  alternates: { canonical: '/changelog' },
};

export default function ChangelogPage() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-5 pb-24 sm:px-10">
      <header className="border-b border-line pb-10 pt-16">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <span className="text-accent">§</span> Release Ledger
        </span>
        <h1 className="font-serif mt-4 text-[clamp(38px,7vw,64px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
          Changelog
        </h1>
        <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-ink-2">
          Every cloudemu release, newest first — the emulator&rsquo;s official release notes, pulled
          straight from{' '}
          <a
            className="underline decoration-line-2 underline-offset-2 hover:text-accent"
            href="https://github.com/stackshy/cloudemu/releases"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Releases
          </a>
          .
        </p>
      </header>

      <Ledger />
    </main>
  );
}
