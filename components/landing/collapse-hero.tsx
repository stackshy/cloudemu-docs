'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PRODUCT } from '@/lib/product';
import { IsoMemory } from './iso-memory';

/**
 * CollapseHero — headline (server-rendered for SEO) beside an isometric memory
 * block: wireframe cubes with a few "surfaced" ember cubes floating out of RAM.
 * A run-a-command dock fires a ✓ ms toast; the primary CTA is magnetic.
 */

type CmdColor = 'aws' | 'az' | 'gc';
const COMMANDS: { id: string; cmd: string; color: CmdColor; label: string }[] = [
  { id: 's3', cmd: 'aws s3 mb s3://prod', color: 'aws', label: 'make_bucket: prod' },
  { id: 'ec2', cmd: 'aws ec2 run-instances', color: 'aws', label: 'i-0a1b run-instances → running' },
  { id: 'ddb', cmd: 'aws dynamodb create-table', color: 'aws', label: 'CREATING → ACTIVE  prod-table' },
  { id: 'az', cmd: 'az group create', color: 'az', label: 'group "prod" created (eastus)' },
  { id: 'gcp', cmd: 'gcloud storage buckets create', color: 'gc', label: 'bucket gs://prod created' },
];

export function CollapseHero() {
  const magRef = useRef<HTMLAnchorElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mag = magRef.current;
    if (!mag) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: MouseEvent) => {
      const r = mag.getBoundingClientRect();
      mag.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px,${(e.clientY - r.top - r.height / 2) * 0.3 - 2}px)`;
    };
    const onLeave = () => { mag.style.transform = ''; };
    mag.addEventListener('mousemove', onMove);
    mag.addEventListener('mouseleave', onLeave);
    return () => { mag.removeEventListener('mousemove', onMove); mag.removeEventListener('mouseleave', onLeave); };
  }, []);

  const fireToast = (c: (typeof COMMANDS)[number]) => {
    const t = toastRef.current;
    if (!t) return;
    const ms = 6 + Math.floor(Math.random() * 7);
    t.innerHTML = `<span class="ok">✓</span> ${c.label} <span class="ms">${ms}ms</span>`;
    t.classList.add('on');
    window.clearTimeout((t as HTMLDivElement & { _tm?: number })._tm);
    (t as HTMLDivElement & { _tm?: number })._tm = window.setTimeout(() => t.classList.remove('on'), 1900);
  };

  return (
    <div className="cl-stage">
      <div className="cl-viz"><IsoMemory /></div>

      <div className="cl-readout cool">
        <div className="lbl">round-trip latency</div>
        <div className="num">~9<span className="u">ms</span></div>
      </div>

      <div className="cl-hero">
        <div className="cl-fade cl-fade-1 font-mono text-[12.5px] uppercase tracking-[0.16em] text-ink-2 flex items-center gap-2.5">
          <span className="inline-block h-[7px] w-[7px] rounded-[2px] bg-ember" /> A real emulator · AWS · Azure · GCP
        </div>
        <h1 className="cl-h1">
          <span className="cl-line"><span>The whole cloud,</span></span>
          <span className="cl-line"><span>collapsed into <span className="em">memory</span>.</span></span>
        </h1>
        <p className="cl-fade cl-fade-2 mt-6 max-w-[46ch] text-[clamp(16px,1.5vw,20px)] leading-[1.5] text-ink-2">
          Point real SDKs and CLIs at AWS, Azure &amp; GCP running entirely on your machine. No accounts,
          no bills, no network — answers straight from RAM.
        </p>
        <div className="cl-cta cl-fade cl-fade-3 mt-8 flex flex-wrap gap-3">
          <Link className="cl-btn-p" href="/docs/quick-start" ref={magRef}>Get started →</Link>
          <a className="cl-btn-s" href={PRODUCT.repo} target="_blank" rel="noreferrer">★ Star on GitHub</a>
        </div>
      </div>

      <div className="cl-toast" ref={toastRef} aria-hidden="true" />
      <div className="cl-dock on" aria-label="Run a command">
        {COMMANDS.map((c) => (
          <button key={c.id} className="cl-chip" onClick={() => fireToast(c)}>
            <span className="p">$</span> {c.cmd}
          </button>
        ))}
      </div>
      <div className="cl-hint on">scroll <b>↓</b></div>
    </div>
  );
}
