'use client';

import Link from '@/components/link';
import { ArrowRight } from 'lucide-react';
import { HighlightedGo } from '@/components/landing/highlighted-go';
import { Reveal } from '@/components/reveal';
import { useInView } from '@/components/diagrams/use-in-view';

/**
 * Two surfaces, one honest comparison: SDK-compat server vs Portable Go API,
 * side by side, divided by a single vertical hairline. Each side: mono label,
 * stat line, a small code sample (the earned box), one sentence, arrow link.
 * Answers "which one do I use?" in a glance.
 */

const SURFACES = [
  {
    label: 'SDK-COMPAT SERVER',
    stat: '21 domains · real wire protocols',
    code: `ts := httptest.NewServer(awsserver.New(drivers))
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.BaseEndpoint = aws.String(ts.URL)
})`,
    body: 'Point the real SDK at a local endpoint. Your production code runs in tests exactly as it ships.',
    href: '/docs/sdk-compat',
    linkText: 'sdk-compat docs',
  },
  {
    label: 'PORTABLE GO API',
    stat: '21 domains · in-process, no HTTP',
    code: `cloud := cloudemu.NewAWS()
cloud.S3.CreateBucket(ctx, "app-data")
cloud.S3.PutObject(ctx, "app-data", "cfg.yaml",
    []byte("port: 8080"), "text/yaml", nil)`,
    body: 'Typed Go interfaces on the same backend — for setup code, assertions, and tests that skip HTTP altogether.',
    href: '/docs/portable-api',
    linkText: 'portable api docs',
  },
];

export function TwoSurfaces() {
  const [ref, on] = useInView<HTMLDivElement>(0.15);

  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-ink-3">05</span> · two surfaces
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
            Same backend. Two ways in.
          </h2>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <div
            ref={ref}
            className="relative grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-y-0"
          >
            {/* vertical hairline grows in from the top; lg+ only */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 hidden w-px bg-line lg:block"
              style={{
                transform: on ? 'scaleY(1)' : 'scaleY(0)',
                transformOrigin: 'top',
                transition: 'transform 400ms var(--ease-out)',
              }}
            />
            {SURFACES.map((s, i) => (
              <div
                key={s.label}
                className={i === 0 ? 'lg:pr-12' : 'lg:pl-12'}
                style={{
                  opacity: on ? 1 : 0,
                  transform: on
                    ? 'translateX(0)'
                    : `translateX(${i === 0 ? -8 : 8}px)`,
                  transition: `opacity 300ms var(--ease-out), transform 300ms var(--ease-out)`,
                }}
              >
                <p className="font-mono text-xs font-medium tracking-[0.06em] text-ink">
                  {s.label}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
                  {s.stat}
                </p>
                <pre className="u-codeblock mt-5 overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.6]">
                  <code className="u-code-plain">
                    <HighlightedGo code={s.code} />
                  </code>
                </pre>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">
                  {s.body}
                </p>
                <Link
                  href={s.href}
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-ink underline decoration-line-2 underline-offset-4 hover:text-accent hover:decoration-accent"
                >
                  {s.linkText}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
