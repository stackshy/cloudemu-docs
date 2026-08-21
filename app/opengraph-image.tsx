import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'cloudemu — the cloud, in memory';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Static OG card in the Field Manual palette (generated at build time — safe
// under output: 'export'). System-font fallback keeps it dependency-free.
// Every node is display:flex per Satori's multi-child rule.
export default function OpengraphImage() {
  const paper = '#f3efe3';
  const ink = '#221d14';
  const ink2 = '#4c473a';
  const ink3 = '#857e6d';
  const ember = '#b23c0c';
  const rule = '#c7bea9';

  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'monospace',
    color: ink3,
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: paper,
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ ...row, fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', borderBottom: `2px solid ${rule}`, paddingBottom: 22 }}>
          <div style={{ display: 'flex' }}>cloudemu · Field Manual</div>
          <div style={{ display: 'flex' }}>Rev 2.0</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 118, color: ink, letterSpacing: -4, lineHeight: 1.02 }}>
            The cloud,
          </div>
          <div style={{ display: 'flex', fontSize: 118, letterSpacing: -4, lineHeight: 1.02, fontStyle: 'italic' }}>
            <span style={{ color: ink }}>in&nbsp;</span>
            <span style={{ color: ember }}>memory</span>
            <span style={{ color: ink }}>.</span>
          </div>
          <div style={{ display: 'flex', fontSize: 33, color: ink2, marginTop: 30, maxWidth: 940, lineHeight: 1.3 }}>
            A real emulator of AWS, Azure &amp; GCP you point real code at — and it answers from RAM.
          </div>
        </div>

        <div style={{ ...row, fontSize: 24, borderTop: `2px solid ${rule}`, paddingTop: 22 }}>
          <div style={{ display: 'flex' }}>
            <span style={{ color: ember }}>90</span>
            <span>&nbsp;services ·&nbsp;</span>
            <span style={{ color: ember }}>3</span>
            <span>&nbsp;clouds · 0 accounts</span>
          </div>
          <div style={{ display: 'flex' }}>~10 ms / call</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
