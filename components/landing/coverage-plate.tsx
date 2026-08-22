'use client';

import { useState } from 'react';
import { STATS } from '@/lib/product';
import { Leaf } from './primitives';
import { Reveal } from './reveal';

/* §3 — Coverage plate (interactive: hover a cloud to focus its column) */

type Glyph = 'full' | 'ring' | 'none';
const COVERAGE: [string, string, Glyph, Glyph, Glyph][] = [
  ['Storage', 'object · blob · buckets', 'full', 'full', 'full'],
  ['Compute', 'vms · instances', 'full', 'full', 'full'],
  ['Database', 'key-value · document', 'full', 'full', 'full'],
  ['Relational DB', 'rds · sql · cloudsql', 'full', 'full', 'ring'],
  ['Serverless', 'functions', 'full', 'full', 'full'],
  ['Kubernetes', 'eks · aks · gke + data plane', 'full', 'full', 'full'],
  ['Networking', 'vpc · vnet', 'full', 'full', 'full'],
  ['Message Queue', 'sqs · service bus · pubsub', 'full', 'full', 'full'],
  ['Secrets', 'secrets manager · key vault', 'full', 'full', 'full'],
  ['IAM', 'policies · roles', 'full', 'full', 'full'],
  ['AI / ML', 'bedrock · azure ai · vertex', 'full', 'full', 'ring'],
  ['Event Bus', 'eventbridge · grid · arc', 'full', 'full', 'full'],
  ['Container Registry', 'ecr · acr · artifact', 'full', 'full', 'full'],
  ['Resource Discovery', 'explorer · graph · asset', 'full', 'ring', 'ring'],
];

function G({ kind }: { kind: Glyph }) {
  if (kind === 'full')
    return <span className="inline-block h-[11px] w-[11px] rounded-full bg-accent align-middle" />;
  if (kind === 'ring')
    return <span className="inline-block h-[11px] w-[11px] rounded-full border-[1.5px] border-ink-3 align-middle" />;
  return <span className="inline-block h-[1.5px] w-[9px] bg-line-2 align-middle" />;
}

const PROVIDERS = ['AWS', 'Azure', 'GCP'] as const;

export function CoveragePlate() {
  const [focus, setFocus] = useState<number | null>(null);
  const fullCounts = [0, 1, 2].map((ci) => COVERAGE.filter((r) => r[2 + ci] === 'full').length);
  const colDim = (ci: number) => (focus === null || focus === ci ? 'opacity-100' : 'opacity-25');

  return (
    <Leaf
      section="3"
      title="Coverage"
      note={
        <>
          <span className="h">Legend</span>
          Filled = SDK-compatible over the wire. Ring = in-process Go API. Rule = not yet. Hover a cloud to focus it.
        </>
      }
    >
      <Reveal>
        <h2 className="font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink text-balance">
          What is <span className="italic font-medium text-accent">resident</span> in memory.
        </h2>
        <p className="mt-4 max-w-[56ch] text-base leading-[1.65] text-ink-2">
          Coverage stated as a parts list, not a marketing number. Every cell traces to a shipped
          handler — nothing is hand-waved.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-8 overflow-hidden rounded-[4px] border border-line-2 bg-surface">
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-[18px] py-3">
            <span className="font-serif text-[17px] italic text-ink">Plate II — Service map</span>
            <span className="font-mono text-xs text-ink-3">
              {focus === null ? (
                <>
                  <b className="text-accent">{STATS.sdkCompatServices}</b> services ·{' '}
                  <b className="text-accent">{STATS.clouds}</b> clouds · <b className="text-accent">0</b> accounts
                </>
              ) : (
                <>
                  <b className="text-accent">{fullCounts[focus]}</b> SDK-compatible domains in{' '}
                  <b className="text-ink">{PROVIDERS[focus]}</b>
                </>
              )}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-line-2 px-[18px] py-3 text-left font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-3">
                    Domain
                  </th>
                  {PROVIDERS.map((p, ci) => (
                    <th
                      key={p}
                      onMouseEnter={() => setFocus(ci)}
                      onMouseLeave={() => setFocus(null)}
                      onFocus={() => setFocus(ci)}
                      onBlur={() => setFocus(null)}
                      tabIndex={0}
                      className={`w-[88px] cursor-default border-b border-line-2 px-2 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.12em] outline-none transition-colors ${
                        focus === ci ? 'text-accent' : 'text-ink-3'
                      }`}
                      style={focus === ci ? { boxShadow: 'inset 0 -2px 0 var(--accent)' } : undefined}
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COVERAGE.map(([dom, sub, a, b, c], i) => (
                  <tr key={dom} className={`group ${i % 2 ? '' : 'bg-raised/40'} transition-colors hover:bg-accent/[0.06]`}>
                    <td className="border-b border-line px-[18px] py-[11px]">
                      <div className="font-serif text-[15px] font-medium text-ink transition-colors group-hover:text-accent">
                        {dom}
                      </div>
                      <div className="font-mono text-[11px] tracking-[0.02em] text-ink-3">{sub}</div>
                    </td>
                    {[a, b, c].map((k, ci) => (
                      <td key={ci} className={`border-b border-line text-center transition-opacity duration-200 ${colDim(ci)}`}>
                        <G kind={k} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-[22px] border-t border-line px-[18px] py-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink-3"><G kind="full" /> SDK-compatible</span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink-3"><G kind="ring" /> in-process Go API</span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink-3"><G kind="none" /> not yet</span>
          </div>
        </div>
      </Reveal>
    </Leaf>
  );
}
