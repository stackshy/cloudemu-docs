import type { ReactNode } from 'react';

/** Mono uppercase section marker — the identity treatment for eyebrows. */
export function Eyebrow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`u-eyebrow ${className}`}>{children}</p>;
}

export type Provider = 'aws' | 'azure' | 'gcp';

export const PROVIDER_LABEL: Record<Provider, string> = {
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
};

/** Text color + vivid rail/dot color per provider — always via tokens. */
export const PROVIDER_TEXT: Record<Provider, string> = {
  aws: 'var(--aws)',
  azure: 'var(--azure)',
  gcp: 'var(--gcp)',
};
export const PROVIDER_VIVID: Record<Provider, string> = {
  aws: 'var(--aws-vivid)',
  azure: 'var(--azure-vivid)',
  gcp: 'var(--gcp-vivid)',
};
export const PROVIDER_DIM: Record<Provider, string> = {
  aws: 'var(--aws-dim)',
  azure: 'var(--azure-dim)',
  gcp: 'var(--gcp-dim)',
};

/** Small mono chip; optionally provider-tinted. */
export function Chip({
  children,
  provider,
  className = '',
}: {
  children: ReactNode;
  provider?: Provider;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[3px] border border-line bg-raised px-1.5 py-px font-mono text-[11px] tracking-wide text-ink-secondary ${className}`}
      style={
        provider
          ? { color: PROVIDER_TEXT[provider], borderColor: `color-mix(in srgb, ${PROVIDER_VIVID[provider]} 45%, transparent)` }
          : undefined
      }
    >
      {children}
    </span>
  );
}

/** Provider status dot (vivid). */
export function ProviderDot({ provider }: { provider: Provider }) {
  return (
    <span
      aria-hidden
      className="inline-block size-1.5 rounded-full"
      style={{ background: PROVIDER_VIVID[provider] }}
    />
  );
}
