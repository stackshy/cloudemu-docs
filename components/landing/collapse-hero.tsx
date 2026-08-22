'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PRODUCT } from '@/lib/product';

/**
 * CollapseHero — the signature moment. The public cloud starts scattered wide
 * (latency ticking high), then collapses into a single in-memory core and the
 * latency snaps to single-digit ms. Firing a command flings fresh resources
 * into the core with a ripple + toast. The <h1> renders server-side for SEO;
 * the canvas hydrates on top. Fully reduced-motion safe.
 */

type CmdColor = 'aws' | 'az' | 'gc';
const COMMANDS: { id: string; cmd: string; color: CmdColor; label: string }[] = [
  { id: 's3', cmd: 'aws s3 mb s3://prod', color: 'aws', label: 'make_bucket: prod' },
  { id: 'ec2', cmd: 'aws ec2 run-instances', color: 'aws', label: 'i-0a1b run-instances → running' },
  { id: 'ddb', cmd: 'aws dynamodb create-table', color: 'aws', label: 'CREATING → ACTIVE  prod-table' },
  { id: 'az', cmd: 'az group create', color: 'az', label: 'group "prod" created (eastus)' },
  { id: 'gcp', cmd: 'gcloud storage buckets create', color: 'gc', label: 'bucket gs://prod created' },
];

interface Particle {
  x: number; y: number; tx: number; ty: number;
  r: number; c: string; sx: number; sy: number;
}

export function CollapseHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const latRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const magRef = useRef<HTMLAnchorElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  // imperative handle set by the engine so the buttons can fire into the core
  const fireRef = useRef<(color: CmdColor) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const lat = latRef.current;
    const readout = readoutRef.current;
    if (!canvas || !stage || !lat || !readout) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const vAws = css.getPropertyValue('--viz-aws').trim() || '#ff5a1f';
    const vAz = css.getPropertyValue('--viz-azure').trim() || '#3a7bd5';
    const vGc = css.getPropertyValue('--viz-gcp').trim() || '#e8a33d';
    const providerColors = [vAws, vAz, vGc];
    const colorFor = (c: CmdColor) => (c === 'aws' ? vAws : c === 'az' ? vAz : vGc);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    // fewer particles on small screens
    const N = window.innerWidth < 760 ? 90 : 150;
    let parts: Particle[] = [];
    const core = { x: 0, y: 0 };
    let coreR = 0;
    const ripples: { r: number; max: number; alpha: number }[] = [];

    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // below 1024 the hero flows top-to-bottom, so the core sits in the band
    // under the nav rather than behind the centered text.
    const compact = () => W < 1024;
    function computeTargets() {
      if (compact()) {
        // top-left corner, above the eyebrow — opposite the latency readout
        // (top-right) and clear of the headline below. Small, decorative.
        const small = W < 520;
        core.x = W * (small ? 0.3 : 0.34);
        core.y = small ? 82 : 104;
        coreR = Math.min(small ? 46 : 66, W * 0.15);
      } else {
        core.x = W * 0.7;
        core.y = H * 0.52;
        coreR = Math.max(70, Math.min(W, H) * 0.16);
      }
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const ang = (i / parts.length) * Math.PI * 2 * 3.3 + i * 0.6;
        const rr = coreR * Math.sqrt((i % 37) / 37) * (0.35 + 0.65 * ((i * 13 % 17) / 17));
        p.tx = core.x + Math.cos(ang) * rr;
        p.ty = core.y + Math.sin(ang) * rr * 0.92;
      }
    }
    function resize() {
      W = stage!.clientWidth; H = stage!.clientHeight;
      canvas!.width = W * DPR; canvas!.height = H * DPR;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      computeTargets();
    }
    function seed() {
      parts = [];
      for (let i = 0; i < N; i++) {
        const m = 220; let sx, sy;
        if (Math.random() < 0.5) {
          sx = Math.random() * (W + 2 * m) - m;
          sy = Math.random() < 0.5 ? -m * Math.random() - 40 : H + m * Math.random() + 40;
        } else {
          sx = Math.random() < 0.5 ? -m * Math.random() - 40 : W + m * Math.random() + 40;
          sy = Math.random() * (H + 2 * m) - m;
        }
        parts.push({ x: sx, y: sy, tx: 0, ty: 0, r: 1.4 + Math.random() * 2.6, c: providerColors[i % 3], sx: Math.random() * 1000, sy: Math.random() * 1000 });
      }
      computeTargets();
    }

    let phase = 0; // 0 scatter, 1 collapse, 2 settled
    let t0: number | null = null;
    const COLLAPSE_START = 700, COLLAPSE_DUR = 1150;
    const mouse = { x: -9999, y: -9999, inside: false };
    let scrollY = 0;
    let raf = 0;
    let running = true; // paused while the hero is scrolled off-screen

    const onMove = (e: MouseEvent) => {
      const r = stage!.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.inside = true;
    };
    const onLeave = () => { mouse.inside = false; };
    const onScroll = () => { scrollY = window.scrollY || window.pageYOffset; };
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    // pause the animation loop while the hero is out of view (saves CPU/battery)
    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(draw); }
      else if (!e.isIntersecting) { running = false; }
    }, { threshold: 0 });
    vis.observe(stage);

    function onSettled() {
      readout!.classList.remove('hot'); readout!.classList.add('cool');
      lat!.innerHTML = '~9<span class="u">ms</span>';
      dockRef.current?.classList.add('on');
      hintRef.current?.classList.add('on');
    }

    fireRef.current = (color: CmdColor) => {
      if (phase < 2) return;
      const cc = colorFor(color);
      for (let j = 0; j < 3; j++) {
        const ang = Math.random() * Math.PI * 2, rr = coreR * Math.sqrt(Math.random()) * 0.9;
        parts.push({
          x: core.x + Math.cos(Math.random() * 6.28) * (W * 0.6),
          y: core.y + Math.sin(Math.random() * 6.28) * (H * 0.6),
          tx: core.x + Math.cos(ang) * rr, ty: core.y + Math.sin(ang) * rr * 0.92,
          r: 1.6 + Math.random() * 2.4, c: cc, sx: Math.random() * 1000, sy: Math.random() * 1000,
        });
      }
      ripples.push({ r: coreR * 0.3, max: coreR * 2.4, alpha: 0.6 });
    };

    function draw(now: number) {
      if (t0 === null) t0 = now;
      const el = now - t0;
      ctx!.clearRect(0, 0, W, H);
      const heroFade = Math.max(0, 1 - scrollY / (H * 0.9));
      const settledAmt = phase >= 2 ? 1 : phase === 1 ? Math.min(1, (el - COLLAPSE_START) / COLLAPSE_DUR) : 0;
      if (phase === 0 && el > COLLAPSE_START) { phase = 1; readout!.classList.add('cool'); readout!.classList.remove('hot'); }
      if (phase === 1 && el > COLLAPSE_START + COLLAPSE_DUR) { phase = 2; onSettled(); }

      ctx!.save();
      const sc = 1 - (1 - heroFade) * 0.12;
      ctx!.translate(core.x, core.y); ctx!.scale(sc, sc); ctx!.translate(-core.x, -core.y);
      ctx!.globalAlpha = heroFade;

      if (settledAmt > 0) {
        const g = ctx!.createRadialGradient(core.x, core.y, 0, core.x, core.y, coreR * 2.1);
        g.addColorStop(0, `rgba(255,90,31,${0.16 * settledAmt})`);
        g.addColorStop(0.5, `rgba(255,90,31,${0.05 * settledAmt})`);
        g.addColorStop(1, 'rgba(255,90,31,0)');
        ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(core.x, core.y, coreR * 2.1, 0, Math.PI * 2); ctx!.fill();
      }
      for (let ri = ripples.length - 1; ri >= 0; ri--) {
        const rp = ripples[ri]; rp.r += (rp.max - rp.r) * 0.08; rp.alpha *= 0.94;
        ctx!.strokeStyle = `rgba(255,90,31,${rp.alpha})`; ctx!.lineWidth = 2;
        ctx!.beginPath(); ctx!.arc(core.x, core.y, rp.r, 0, Math.PI * 2); ctx!.stroke();
        if (rp.alpha < 0.02) ripples.splice(ri, 1);
      }
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (phase === 0) { p.x += Math.sin(el * 0.0006 + p.sx) * 0.25; p.y += Math.cos(el * 0.0006 + p.sy) * 0.25; }
        else if (phase === 1) { const k = easeInOut(Math.min(1, (el - COLLAPSE_START) / COLLAPSE_DUR)); p.x += (p.tx - p.x) * (0.06 + 0.1 * k); p.y += (p.ty - p.y) * (0.06 + 0.1 * k); }
        else {
          const bx = core.x + (p.tx - core.x) * (1 + 0.012 * Math.sin(el * 0.0018 + p.sx));
          const by = core.y + (p.ty - core.y) * (1 + 0.012 * Math.sin(el * 0.0018 + p.sy));
          p.x += (bx - p.x) * 0.08; p.y += (by - p.y) * 0.08;
          if (mouse.inside) {
            const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
            if (d2 < 9000 && d2 > 0.01) { const f = ((9000 - d2) / 9000 * 4) / Math.sqrt(d2); p.x += dx * f; p.y += dy * f; }
          }
        }
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.c; ctx!.globalAlpha = heroFade * (phase === 0 ? 0.55 : 0.9); ctx!.fill();
      }
      ctx!.globalAlpha = heroFade;
      if (settledAmt > 0.4) {
        ctx!.strokeStyle = `rgba(194,68,13,${0.1 * settledAmt * heroFade})`; ctx!.lineWidth = 1;
        for (let a = 0; a < parts.length; a += 2) {
          for (let b = a + 1; b < a + 5 && b < parts.length; b++) {
            const pa = parts[a], pb = parts[b], ddx = pa.x - pb.x, ddy = pa.y - pb.y;
            if (ddx * ddx + ddy * ddy < 2600) { ctx!.beginPath(); ctx!.moveTo(pa.x, pa.y); ctx!.lineTo(pb.x, pb.y); ctx!.stroke(); }
          }
        }
      }
      ctx!.restore();

      if (phase === 0) { const j = 300 + Math.floor(Math.abs(Math.sin(el * 0.02)) * 560); lat!.innerHTML = j + '<span class="u">ms</span>'; }
      else if (phase === 1) { const kk = Math.min(1, (el - COLLAPSE_START) / COLLAPSE_DUR); const v = Math.round((1 - easeInOut(kk)) * 760 + easeInOut(kk) * 9); lat!.innerHTML = v + '<span class="u">ms</span>'; }
      if (running) raf = requestAnimationFrame(draw);
    }

    // magnetic button
    const mag = magRef.current;
    const onMagMove = (e: MouseEvent) => {
      if (!mag) return;
      const r = mag.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2, my = e.clientY - r.top - r.height / 2;
      mag.style.transform = `translate(${mx * 0.3}px,${my * 0.3 - 2}px)`;
    };
    const onMagLeave = () => { if (mag) mag.style.transform = ''; };
    if (!reduce && mag) { mag.addEventListener('mousemove', onMagMove); mag.addEventListener('mouseleave', onMagLeave); }

    resize(); seed();
    if (reduce) {
      phase = 2;
      for (const p of parts) { p.x = p.tx; p.y = p.ty; }
      readout.classList.add('cool'); lat.innerHTML = '~9<span class="u">ms</span>';
      onSettled();
    }
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      vis.disconnect();
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      if (mag) { mag.removeEventListener('mousemove', onMagMove); mag.removeEventListener('mouseleave', onMagLeave); }
    };
  }, []);

  const fireToast = (c: (typeof COMMANDS)[number]) => {
    fireRef.current(c.color);
    const t = toastRef.current;
    if (!t) return;
    const ms = 6 + Math.floor(Math.random() * 7);
    t.innerHTML = `<span class="ok">✓</span> ${c.label} <span class="ms">${ms}ms</span>`;
    t.classList.add('on');
    window.clearTimeout((t as HTMLDivElement & { _tm?: number })._tm);
    (t as HTMLDivElement & { _tm?: number })._tm = window.setTimeout(() => t.classList.remove('on'), 1900);
  };

  return (
    <div className="cl-stage" ref={stageRef}>
      <canvas className="cl-canvas" ref={canvasRef} aria-hidden="true" />

      <div className="cl-readout cool" ref={readoutRef}>
        <div className="lbl">round-trip latency</div>
        <div className="num" ref={latRef}>~9<span className="u">ms</span></div>
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
      <div className="cl-dock" ref={dockRef} aria-label="Run a command">
        {COMMANDS.map((c) => (
          <button key={c.id} className="cl-chip" onClick={() => fireToast(c)}>
            <span className="p">$</span> {c.cmd}
          </button>
        ))}
      </div>
      <div className="cl-hint" ref={hintRef}>scroll <b>↓</b></div>
    </div>
  );
}
