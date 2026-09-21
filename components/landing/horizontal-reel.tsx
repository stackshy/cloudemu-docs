'use client';

import { useEffect, useRef } from 'react';

/**
 * HorizontalReel — a horizontal strip of behavior cards you swipe or scroll
 * through, at every screen size. Native overflow-scroll with scroll-snap keeps
 * it reliable (no scroll-jacking): trackpad/touch swipe directly, a mouse wheel
 * over the strip is translated to horizontal travel, and a drag-to-pan handler
 * makes it tactile with a plain mouse too.
 */

type Viz = 'chaos' | 'state' | 'err' | 'wave' | 'clock' | 'deps';

const PANELS: { n: string; name: string; tag: string; desc: string; viz: Viz }[] = [
  { n: '2.1', name: 'Chaos engineering', tag: 'fault + latency', viz: 'chaos', desc: 'Schedule outages, latency spikes and throttling inside real time windows. Your backoff code runs for real, every test.' },
  { n: '2.2', name: 'State machines', tag: 'lifecycle', viz: 'state', desc: 'VMs walk pending → running → stopping → stopped. Start a terminated instance and you get an error, not a shrug.' },
  { n: '2.3', name: 'Error injection', tag: 'probabilistic', viz: 'err', desc: 'Fail every call, every Nth, the first N, or at a fixed probability — scoped to one operation or a whole service.' },
  { n: '2.4', name: 'Recording & replay', tag: 'fluent asserts', viz: 'wave', desc: 'Every call is recorded — inputs, outputs, timing — then asserted against with a fluent API. No spies to wire up.' },
  { n: '2.5', name: 'Fake clock', tag: 'deterministic', viz: 'clock', desc: 'A clock you advance by hand. TTL expiry, dedup windows and alarms fire on command, not on wall time.' },
  { n: '2.6', name: 'Zero dependencies', tag: 'stdlib only', viz: 'deps', desc: 'The in-process library is standard-library only. It runs anywhere your test suite already runs.' },
];

/** A small concept animation per card — decorative, CSS-driven, aria-hidden. */
function BehaviorViz({ kind }: { kind: Viz }) {
  const cv = (n: number) => Array.from({ length: n });
  if (kind === 'chaos') {
    return <div className="viz viz-chaos">{cv(30).map((_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}</div>;
  }
  if (kind === 'state') {
    const labels = ['pending', 'running', 'stopping', 'stopped'];
    return (
      <div className="viz viz-state">
        <span className="viz-rail" />
        {labels.map((l, i) => (
          <span className="viz-node" key={l} style={{ ['--i' as string]: i }}><i /><b>{l}</b></span>
        ))}
      </div>
    );
  }
  if (kind === 'err') {
    return <div className="viz viz-err">{cv(28).map((_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}</div>;
  }
  if (kind === 'wave') {
    return <div className="viz viz-wave">{cv(22).map((_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}</div>;
  }
  if (kind === 'clock') {
    return (
      <div className="viz viz-clock">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="38" className="viz-clock-face" />
          <line x1="50" y1="50" x2="50" y2="20" className="viz-clock-hand" />
          <line x1="50" y1="50" x2="68" y2="50" className="viz-clock-hand2" />
          <circle cx="50" cy="50" r="3.2" className="viz-clock-pin" />
        </svg>
      </div>
    );
  }
  return (
    <div className="viz viz-deps">
      <span className="viz-deps-ring" /><span className="viz-deps-ring" /><span className="viz-deps-core">0</span>
    </div>
  );
}

export function HorizontalReel() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Translate a vertical mouse wheel into horizontal travel while the pointer
    // is over the strip, so wheel users can move through it without shift.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft >= max - 1;
      // only capture when there is room to travel in the wheel's direction
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    };

    // Drag-to-pan for a plain mouse.
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // native touch handles itself
      down = true;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = () => { down = false; track.classList.remove('is-dragging'); };

    track.addEventListener('wheel', onWheel, { passive: false });
    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      track.removeEventListener('wheel', onWheel);
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <section className="hr-outer">
      <div className="hr-track" ref={trackRef}>
        <div className="hr-panel hr-intro">
          <div className="cl-k">02 — behaviors</div>
          <h2 className="cl-h2 mt-3.5">Not a mock. A cloud you can <span className="em">push until it breaks</span>.</h2>
          <p className="cl-lead">It enforces lifecycle, throttles under load, injects outages and bends time — the failure paths your retries otherwise never run.</p>
          <div className="hr-hint">drag / scroll →</div>
        </div>
        {PANELS.map((p) => (
          <div className="hr-panel" key={p.n}>
            <div className="hr-card">
              <div className="hr-top">
                <span className="hr-n">{p.n}</span>
                <span className="hr-tag">{p.tag}</span>
              </div>
              <div className="hr-viz-wrap" aria-hidden="true"><BehaviorViz kind={p.viz} /></div>
              <div className="hr-foot">
                <h3 className="hr-name">{p.name}</h3>
                <p className="hr-desc">{p.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
