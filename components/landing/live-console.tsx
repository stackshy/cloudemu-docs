'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * LiveConsole — a "try a call" playground. Pick a cloud, click an example
 * command, and watch the emulated response land in ~10 ms. Responses are
 * canned (this is a static page) but the flow mirrors the real endpoints:
 * point a CLI at the printed port, get a real-shaped answer, instantly.
 */

type Provider = 'aws' | 'azure' | 'gcp';

const ENDPOINT: Record<Provider, string> = {
  aws: 'http://localhost:4566',
  azure: 'https://localhost:4568',
  gcp: 'http://localhost:4569',
};

const CMDS: Record<Provider, { label: string; cmd: string; out: string[] }[]> = {
  aws: [
    { label: 'create a bucket', cmd: 'aws s3 mb s3://prod', out: ['make_bucket: prod'] },
    { label: 'list tables', cmd: 'aws dynamodb list-tables', out: ['{', '  "TableNames": ["sessions", "orders"]', '}'] },
    { label: 'run an instance', cmd: 'aws ec2 run-instances --image-id ami-01', out: ['i-0ab12cd34ef · pending → running'] },
    { label: 'send a message', cmd: 'aws sqs send-message --queue-url .../jobs --message-body hi', out: ['{ "MessageId": "9f2c…", "MD5OfBody": "49f6…" }'] },
  ],
  azure: [
    { label: 'create a container', cmd: 'az storage container create -n assets', out: ['{ "created": true }'] },
    { label: 'list cosmos dbs', cmd: 'az cosmosdb list -g demo', out: ['[ { "name": "orders", "kind": "GlobalDocumentDB" } ]'] },
    { label: 'create a VM', cmd: 'az vm create -g demo -n web --image Ubuntu', out: ['web · creating → running'] },
    { label: 'put a secret', cmd: 'az keyvault secret set --vault kv --name db --value ***', out: ['{ "id": ".../secrets/db/8c1…", "enabled": true }'] },
  ],
  gcp: [
    { label: 'create a bucket', cmd: 'gcloud storage buckets create gs://prod', out: ['Creating gs://prod/... done.'] },
    { label: 'list instances', cmd: 'gcloud compute instances list', out: ['NAME  ZONE        STATUS', 'web   us-a1-c     RUNNING'] },
    { label: 'publish a message', cmd: 'gcloud pubsub topics publish jobs --message hi', out: ['messageIds: ["17"]'] },
    { label: 'create a secret', cmd: 'gcloud secrets create db --data-file=-', out: ['Created secret [db].'] },
  ],
};

type Line = { kind: 'cmd' | 'out' | 'meta'; text: string };

const SEED: Record<Provider, Line[]> = {
  aws: [
    { kind: 'cmd', text: 'aws --endpoint-url :4566 s3 mb s3://prod' },
    { kind: 'out', text: 'make_bucket: prod' },
    { kind: 'meta', text: '✓ 9 ms · 0 accounts' },
  ],
  azure: [
    { kind: 'cmd', text: 'az storage container create -n assets' },
    { kind: 'out', text: '{ "created": true }' },
    { kind: 'meta', text: '✓ 10 ms · 0 accounts' },
  ],
  gcp: [
    { kind: 'cmd', text: 'gcloud storage buckets create gs://prod' },
    { kind: 'out', text: 'Creating gs://prod/... done.' },
    { kind: 'meta', text: '✓ 8 ms · 0 accounts' },
  ],
};

const PROVIDER_LABEL: Record<Provider, string> = { aws: 'AWS', azure: 'Azure', gcp: 'GCP' };

export function LiveConsole() {
  const reduce = useReducedMotion();
  const [provider, setProvider] = useState<Provider>('aws');
  const [lines, setLines] = useState<Line[]>(SEED.aws);
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const switchProvider = (p: Provider) => {
    clearTimers();
    setBusy(false);
    setProvider(p);
    setLines(SEED[p]);
  };

  const run = useCallback(
    (cmd: string, out: string[]) => {
      if (busy) return;
      clearTimers();
      setBusy(true);
      setLines((l) => [...l, { kind: 'cmd', text: cmd }]);
      const delay = reduce ? 0 : 260;
      timers.current.push(
        setTimeout(() => {
          const ms = 8 + Math.floor(Math.random() * 5);
          setLines((l) => [
            ...l,
            ...out.map((t) => ({ kind: 'out' as const, text: t })),
            { kind: 'meta', text: `✓ ${ms} ms · 0 accounts` },
          ]);
          setBusy(false);
        }, delay),
      );
    },
    [busy, reduce],
  );

  const reset = () => {
    clearTimers();
    setBusy(false);
    setLines([{ kind: 'meta', text: `/_cloudemu/reset · ${PROVIDER_LABEL[provider]} cloud cleared` }]);
  };

  return (
    <div className="u-plate relative overflow-hidden">
      <span className="u-cross" style={{ top: 8, left: 8 }} />
      <span className="u-cross" style={{ top: 8, right: 8 }} />
      <span className="u-cross" style={{ bottom: 8, left: 8 }} />
      <span className="u-cross" style={{ bottom: 8, right: 8 }} />

      {/* header: provider selector + endpoint */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-4 py-3">
        <div role="tablist" aria-label="Cloud" className="flex gap-1">
          {(Object.keys(PROVIDER_LABEL) as Provider[]).map((p) => {
            const on = p === provider;
            return (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => switchProvider(p)}
                className={`relative rounded-[4px] px-2.5 py-1 font-mono text-[12px] transition-colors ${
                  on ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="console-chip"
                    className="absolute inset-0 rounded-[4px] bg-accent/10"
                    style={{ boxShadow: 'inset 0 0 0 1px var(--accent)' }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{PROVIDER_LABEL[p]}</span>
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[11px] text-ink-3">{ENDPOINT[provider]}</span>
        <button
          type="button"
          onClick={reset}
          className="ms-auto rounded-[3px] border border-line-2 px-2 py-1 font-mono text-[10.5px] tracking-wide text-ink-3 transition-colors hover:border-accent hover:text-accent"
          aria-label="Reset this cloud"
        >
          ⟳ reset
        </button>
      </div>

      {/* terminal body */}
      <div
        ref={bodyRef}
        className="h-[188px] overflow-y-auto px-4 py-3 font-mono text-[13px] leading-[1.75]"
        style={{ background: 'var(--terminal-bg)', color: 'var(--terminal-ink)' }}
      >
        {lines.map((l, i) => {
          if (l.kind === 'cmd')
            return (
              <div key={i} className="flex gap-2">
                <span style={{ color: 'var(--accent)' }} aria-hidden>$</span>
                <span className="break-all">{l.text}</span>
              </div>
            );
          if (l.kind === 'meta')
            return (
              <div key={i} style={{ color: 'var(--accent)' }} className="text-[12px]">
                {l.text}
              </div>
            );
          return (
            <div key={i} style={{ color: 'var(--terminal-muted)' }} className="break-all">
              {l.text}
            </div>
          );
        })}
        {busy && (
          <div style={{ color: 'var(--terminal-muted)' }} className="flex gap-2">
            <span style={{ color: 'var(--accent)' }}>$</span>
            <span className="ce-blink">▍</span>
          </div>
        )}
      </div>

      {/* try-it commands */}
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">try</span>
        <AnimatePresence mode="popLayout" initial={false}>
          {CMDS[provider].map((c) => (
            <motion.button
              key={c.cmd}
              type="button"
              onClick={() => run(c.cmd, c.out)}
              disabled={busy}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="rounded-full border border-line px-3 py-1 font-mono text-[11.5px] text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
            >
              {c.label}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
