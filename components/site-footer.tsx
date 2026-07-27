import Link from '@/components/link';
import { Contributors } from '@/components/contributors';

export async function SiteFooter() {
  return (
    <footer className="w-full border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-start lg:justify-between">
        {/* Contributors — each profile listed individually (avatar + name),
            fetched live from the GitHub API. */}
        <Contributors />

        <nav className="flex gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
              Product
            </span>
            <Link href="/docs" className="text-sm text-ink-2 transition-colors hover:text-ink">
              Docs
            </Link>
            <Link href="/blog" className="text-sm text-ink-2 transition-colors hover:text-ink">
              Blog
            </Link>
            <Link
              href="/docs/quick-start"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              Quick Start
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
              Project
            </span>
            <a
              href="https://github.com/stackshy/cloudemu"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              GitHub
            </a>
            <a
              href="https://github.com/stackshy/cloudemu/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              MIT License
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
