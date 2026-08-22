import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Shared Open Graph card in the "Collapse" palette (generated at build time —
 * static-export safe). Warm Bone stage, ink type, ember heat. `eyebrow` names
 * the section; every node is display:flex per Satori's multi-child rule.
 */
export function ogCard(eyebrow: string) {
  const paper = '#f1efe7';
  const ink = '#12140f';
  const ink2 = '#4a4d43';
  const ink3 = '#6b6a5e';
  const ember = '#ff5a1f';
  const rule = '#d8d4c6';

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
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ ...row, fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', borderBottom: `2px solid ${rule}`, paddingBottom: 22 }}>
          <div style={{ display: 'flex' }}>cloudemu · {eyebrow}</div>
          <div style={{ display: 'flex' }}>the cloud, in memory</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 100, fontWeight: 800, color: ink, letterSpacing: -4, lineHeight: 1.0 }}>The whole cloud,</div>
          <div style={{ display: 'flex', fontSize: 100, fontWeight: 800, letterSpacing: -4, lineHeight: 1.0 }}>
            <span style={{ color: ink }}>collapsed into&nbsp;</span>
            <span style={{ color: ember }}>memory</span>
            <span style={{ color: ink }}>.</span>
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: ink2, marginTop: 30, maxWidth: 960, lineHeight: 1.3 }}>
            A real emulator of AWS, Azure &amp; GCP you point real code at — answers straight from RAM.
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
    { ...OG_SIZE },
  );
}
