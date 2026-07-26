import Link from '@/components/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="overflow-hidden rounded-lg border border-line bg-inset font-mono text-[13px] leading-relaxed">
          <div className="border-b border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-ink-inset-muted">
            cloudemu — session
          </div>
          <div className="px-4 py-4 text-ink-inset">
            <p>
              <span className="text-ink-inset-muted">$</span> cloudemu route
              /this-page
            </p>
            <p className="mt-2 text-danger">Error: RouteNotFound (code 404)</p>
            <p className="mt-1 text-ink-inset-muted">
              the requested path is not wired to any handler.
            </p>
            <p className="mt-4">
              <span className="text-ink-inset-muted">$</span>{' '}
              <Link
                href="/docs"
                className="text-ink-inset underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                cloudemu route /docs
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
