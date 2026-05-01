'use client';

import Link from 'next/link';
import { Check, Minus } from 'lucide-react';

/**
 * APICoverage makes the difference between the two ways of using cloudemu
 * unmistakable:
 *
 *   • Portable Go API   — every service, every provider, every domain (48/48)
 *   • SDK-Compat HTTP   — the subset of domains that have HTTP wire handlers
 *
 * Both run against the same in-memory backend; the choice is whether to call
 * cloudemu's Go interface directly or to point a real cloud SDK client at
 * a local httptest server.
 */

const domains = [
  { name: 'Storage', sdk: true },
  { name: 'Compute', sdk: true },
  { name: 'Database', sdk: true },
  { name: 'Networking', sdk: true },
  { name: 'Monitoring', sdk: true },
  { name: 'Serverless', sdk: true },
  { name: 'Message Queue', sdk: true },
  { name: 'IAM', sdk: false },
  { name: 'DNS', sdk: false },
  { name: 'Load Balancer', sdk: false },
  { name: 'Notification', sdk: false },
  { name: 'Event Bus', sdk: false },
  { name: 'Container Registry', sdk: false },
  { name: 'Cache', sdk: false },
  { name: 'Secrets', sdk: false },
  { name: 'Logging', sdk: false },
];

const sdkLive = domains.filter((d) => d.sdk).length;
const sdkLiveServices = sdkLive * 3;
const totalServices = domains.length * 3;

export function APICoverage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Two ways to use cloudemu
        </h2>
        <p className="text-fd-muted-foreground text-lg max-w-2xl mx-auto">
          Same in-memory backend. Pick the surface that fits your test code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portable Go API */}
        <div className="rounded-2xl border border-fd-border bg-fd-card p-7">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-xl font-semibold">Portable Go API</h3>
            <span className="text-sm text-fd-muted-foreground">All providers</span>
          </div>
          <p className="text-fd-muted-foreground text-sm mb-5">
            Call cloudemu&apos;s Go interfaces directly. Every service in every domain is here from day one.
          </p>

          <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-fd-border">
            <span className="text-5xl font-extrabold text-fd-foreground tabular-nums">
              {totalServices}
            </span>
            <span className="text-sm text-fd-muted-foreground">
              services available
              <br />
              <span className="text-xs">16 domains × 3 providers</span>
            </span>
          </div>

          <pre className="rounded-lg bg-fd-secondary/50 border border-fd-border p-4 text-xs font-mono overflow-x-auto leading-relaxed">
            <code>
              <span className="text-purple-400">cloud</span> := cloudemu.NewAWS()
              {'\n'}
              <span className="text-purple-400">cloud</span>.S3.PutObject(ctx, ...)
              {'\n'}
              <span className="text-purple-400">cloud</span>.IAM.CheckPermission(ctx, ...)
              {'\n'}
              <span className="text-purple-400">cloud</span>.SecretsManager.GetSecret(ctx, ...)
            </code>
          </pre>

          <Link
            href="/docs/portable-api"
            className="mt-5 inline-block text-sm font-medium text-fd-primary hover:underline"
          >
            Portable API docs →
          </Link>
        </div>

        {/* SDK-Compatible Server */}
        <div className="relative rounded-2xl border border-fd-primary/40 bg-gradient-to-br from-fd-primary/5 to-transparent p-7">
          <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fd-primary text-fd-primary-foreground text-xs font-semibold">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Real SDKs work here
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-xl font-semibold">SDK-Compat HTTP Server</h3>
            <span className="text-sm text-fd-muted-foreground">In progress</span>
          </div>
          <p className="text-fd-muted-foreground text-sm mb-5">
            Point real <code className="font-mono text-xs px-1 rounded bg-fd-card border border-fd-border">aws-sdk-go-v2</code> /{' '}
            <code className="font-mono text-xs px-1 rounded bg-fd-card border border-fd-border">azure-sdk-for-go</code> /{' '}
            <code className="font-mono text-xs px-1 rounded bg-fd-card border border-fd-border">cloud.google.com/go</code> at a local httptest server.
          </p>

          <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-fd-border">
            <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tabular-nums">
              {sdkLiveServices}
            </span>
            <span className="text-sm text-fd-muted-foreground">
              services live
              <br />
              <span className="text-xs">{sdkLive} domains × 3 providers · {totalServices - sdkLiveServices} more in progress</span>
            </span>
          </div>

          <pre className="rounded-lg bg-fd-secondary/50 border border-fd-border p-4 text-xs font-mono overflow-x-auto leading-relaxed">
            <code>
              <span className="text-purple-400">ts</span> := httptest.NewServer(awsserver.New(...))
              {'\n'}
              <span className="text-purple-400">client</span> := s3.NewFromConfig(cfg, <span className="text-fd-muted-foreground">/* ... */</span>)
              {'\n'}
              <span className="text-purple-400">client</span>.PutObject(ctx, ...) <span className="text-fd-muted-foreground">{'// real SDK, in-memory backend'}</span>
            </code>
          </pre>

          <Link
            href="/docs/sdk-compat"
            className="mt-5 inline-block text-sm font-medium text-fd-primary hover:underline"
          >
            SDK-Compat docs →
          </Link>
        </div>
      </div>

      {/* Domain matrix */}
      <div className="mt-10 rounded-xl border border-fd-border bg-fd-card overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {domains.map((d) => (
            <div
              key={d.name}
              className="flex items-center justify-between gap-3 px-5 py-3 border-b border-r border-fd-border last:border-r-0"
            >
              <span className="text-sm font-medium">{d.name}</span>
              {d.sdk ? (
                <span className="inline-flex items-center gap-1 text-xs text-fd-primary font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  SDK
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground">
                  <Minus className="w-3.5 h-3.5" />
                  Go API
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="px-5 py-3 text-xs text-fd-muted-foreground bg-fd-secondary/30 border-t border-fd-border">
          <span className="text-fd-primary font-semibold">SDK</span> = Live SDK-compat HTTP handler.{' '}
          <span className="text-fd-foreground">Go API</span> = Available via the Portable API; SDK-compat shipping in lockstep.
        </div>
      </div>
    </section>
  );
}
