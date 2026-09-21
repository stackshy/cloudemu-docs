'use client';

import { useState } from 'react';

/**
 * SdkToggle — the §02 "one endpoint override" surface as a provider toggle:
 * pick AWS / GCP / Azure and see the single line that repoints that SDK at
 * cloudemu. One seam per SDK, nothing else changes.
 */
const SDKS = [
  {
    id: 'aws',
    p: 'AWS',
    sdk: 'aws-sdk-go-v2 · CLI',
    port: ':4566',
    code: (
      <>
        {'export '}
        <span className="k">AWS_ENDPOINT_URL</span>
        {'=http://127.0.0.1:4566'}
      </>
    ),
  },
  {
    id: 'gcp',
    p: 'GCP',
    sdk: 'cloud.google.com/go',
    port: ':4569',
    code: (
      <>
        {'option.'}
        <span className="k">WithEndpoint</span>
        {'("http://127.0.0.1:4569")'}
      </>
    ),
  },
  {
    id: 'azure',
    p: 'Azure',
    sdk: 'azure-sdk-for-go · ARM',
    port: ':4568 · TLS',
    code: (
      <>
        {'arm.ClientOptions → '}
        <span className="k">https://127.0.0.1:4568</span>
      </>
    ),
  },
] as const;

export function SdkToggle() {
  const [active, setActive] = useState<(typeof SDKS)[number]['id']>('aws');
  const cur = SDKS.find((s) => s.id === active) ?? SDKS[0];

  return (
    <div className="cl-sdk">
      <div className="cl-sdk-tabs" role="tablist" aria-label="SDK endpoint override">
        {SDKS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === active}
            className={`cl-sdk-tab${s.id === active ? ' is-active' : ''}`}
            onClick={() => setActive(s.id)}
          >
            {s.p}
          </button>
        ))}
      </div>
      <div className="cl-sdk-panel" role="tabpanel">
        <div className="cl-sdk-meta">
          <div className="sdk">
            <span>{cur.sdk}</span>
            <span className="port">{cur.port}</span>
          </div>
        </div>
        <pre className="cl-sdk-code">{cur.code}</pre>
      </div>
    </div>
  );
}
