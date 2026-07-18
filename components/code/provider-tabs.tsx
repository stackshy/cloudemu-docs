'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { useProvider, setProvider } from '@/lib/provider-store';
import {
  PROVIDER_LABEL,
  PROVIDER_TEXT,
  PROVIDER_VIVID,
  type Provider,
} from '@/components/ui';

const ORDER: Provider[] = ['aws', 'azure', 'gcp'];

/**
 * Globally-synced provider tab group. Selecting AWS here switches every
 * ProviderTabs on the site (and persists). Use in MDX as:
 *
 *   <ProviderTabs>
 *     <ProviderTab value="aws">…</ProviderTab>
 *     …
 *   </ProviderTabs>
 */
export function ProviderTabs({ children }: { children: ReactNode }) {
  const active = useProvider();

  const panels = Children.toArray(children).filter(isValidElement) as {
    props: { value?: Provider; children?: ReactNode };
  }[];

  return (
    <div className="u-codeblock not-prose my-4 overflow-hidden">
      <div
        role="tablist"
        aria-label="Cloud provider"
        className="flex border-b border-line bg-surface"
      >
        {ORDER.map((p) => {
          const selected = p === active;
          return (
            <button
              key={p}
              role="tab"
              aria-selected={selected}
              onClick={() => setProvider(p)}
              className="relative px-5 py-2.5 font-mono text-xs tracking-wide transition-colors"
              style={{
                color: selected ? PROVIDER_TEXT[p] : 'var(--text-muted)',
                boxShadow: selected
                  ? `inset 0 -2px 0 ${PROVIDER_VIVID[p]}`
                  : undefined,
              }}
            >
              {PROVIDER_LABEL[p]}
            </button>
          );
        })}
      </div>
      {ORDER.map((p) => {
        const panel = panels.find((el) => el.props.value === p);
        return (
          <div
            key={p}
            role="tabpanel"
            hidden={p !== active}
            className="[&_.u-codeblock]:my-0 [&_.u-codeblock]:rounded-none [&_.u-codeblock]:border-0 [&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-0"
          >
            {panel?.props.children}
          </div>
        );
      })}
    </div>
  );
}

export function ProviderTab({
  children,
}: {
  value: Provider;
  children: ReactNode;
}) {
  return <>{children}</>;
}
