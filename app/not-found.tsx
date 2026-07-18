import Link from 'next/link';

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
              <span className="text-signal">$</span> cloudemu route /this-page
            </p>
            <p className="mt-2 text-error">
              Error: RouteNotFound (code 404)
            </p>
            <p className="mt-1 text-ink-inset-muted">
              the requested path is not wired to any handler.
            </p>
            <p className="mt-4">
              <span className="text-signal">$</span>{' '}
              <Link
                href="/docs"
                className="text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
              >
                cloudemu route /docs
              </Link>
              <span
                aria-hidden
                className="ml-1 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-signal"
                style={{ animation: 'u-blink 1s step-end infinite' }}
              />
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
