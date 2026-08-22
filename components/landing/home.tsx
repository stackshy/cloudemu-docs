import { PRODUCT, STATS } from '@/lib/product';
import { CopyButton } from '@/components/code/copy-button';
import { Reveal } from './reveal';
import { CollapseHero } from './collapse-hero';
import { MemoryGrid } from './memory-grid';
import { HorizontalReel } from './horizontal-reel';
import { ScrollProgress, CountUp } from './motion';

/**
 * The landing — the "Collapse" world. A server component: the shell and all
 * copy render on the server (SEO); the interactive islands (CollapseHero,
 * MemoryGrid, CountUp, ScrollProgress, Reveal) hydrate on top.
 */

/* Services shown in the coverage ticker — illustrative names cloudemu covers. */
const TICKER = [
  'S3', 'EC2', 'DynamoDB', 'Lambda', 'VPC', 'Route 53', 'SQS', 'SNS', 'KMS', 'RDS', 'ECS', 'EKS',
  'Blob Storage', 'Cosmos DB', 'Functions', 'Key Vault', 'Service Bus', 'AKS',
  'GCS', 'Firestore', 'Pub/Sub', 'GKE', 'Cloud Run', 'BigQuery',
];

/* Compact one-liners per run mode for the §03 cards. */
const WAY_SNIPPETS: Record<string, { p: string; rest: string; em?: string; tail?: string }> = {
  'in-process': { p: 'cloud := ', rest: 'cloudemu.', em: 'NewAWS', tail: '()' },
  server: { p: '$ ', rest: 'go run ./cmd/cloudemu ', em: 'serve' },
  docker: { p: '$ ', rest: 'docker run -p 4566:4566 ', em: 'cloudemu' },
};

function Machine() {
  return (
    <section className="cl-sec">
      <div className="mx-auto max-w-[1180px]">
        <div className="cl-machine">
          <div>
            <Reveal><div className="cl-k">§ 01 — the machine</div></Reveal>
            <Reveal delay={0.05}>
              <h2 className="cl-h2 mt-3.5">Every resource is <span className="em">live in RAM</span>, on the real wire.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="cl-lead">
                The collapse isn&apos;t marketing — it&apos;s the architecture. Each bucket, instance and
                table you create is a struct in an in-memory store, reachable over the actual cloud wire
                protocols. That&apos;s why it answers in single-digit milliseconds.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}><MemoryGrid /></Reveal>
        </div>
      </div>
    </section>
  );
}

function Coverage() {
  return (
    <section className="cl-sec">
      <div className="mx-auto max-w-[1180px]">
        <Reveal><div className="cl-k">§ 03 — coverage</div></Reveal>
        <Reveal delay={0.05}><h2 className="cl-h2 mt-3.5">One binary. <span className="em">Three clouds.</span></h2></Reveal>
        <div className="cl-stats">
          <Reveal><div className="cl-stat"><div className="v"><CountUp to={STATS.sdkCompatServices} className="em" /></div><div className="l">services emulated</div></div></Reveal>
          <Reveal delay={0.05}><div className="cl-stat"><div className="v"><CountUp to={STATS.clouds} /></div><div className="l">clouds · AWS Azure GCP</div></div></Reveal>
          <Reveal delay={0.1}><div className="cl-stat"><div className="v"><CountUp to={10} prefix="~" className="em" /></div><div className="l">ms per call</div></div></Reveal>
          <Reveal delay={0.15}><div className="cl-stat"><div className="v"><CountUp to={0} /></div><div className="l">accounts · bills · setup</div></div></Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="cl-ticker">
            <div className="cl-track">
              {[0, 1].map((r) => (
                <span key={r}>{TICKER.map((s) => (<span key={s}>{s} <b>·</b> </span>))}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Ways() {
  return (
    <section className="cl-sec">
      <div className="mx-auto max-w-[1180px]">
        <Reveal><div className="cl-k">§ 04 — three ways to run it</div></Reveal>
        <Reveal delay={0.05}><h2 className="cl-h2 mt-3.5">Point <span className="em">real code</span> at it.</h2></Reveal>
        <div className="cl-ways">
          {PRODUCT_WAYS.map((w, i) => {
            const s = WAY_SNIPPETS[w.id];
            return (
              <Reveal key={w.id} delay={i * 0.06}>
                <div className="cl-way">
                  <div className="n">0{i + 1} / {w.kicker}</div>
                  <h3>{w.label}</h3>
                  <p>{w.blurb}</p>
                  <pre><span className="p">{s.p}</span>{s.rest}{s.em && <span className="em">{s.em}</span>}{s.tail}</pre>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Card copy for §03, derived from RUN_MODES ids. */
const PRODUCT_WAYS = [
  { id: 'server', kicker: 'SERVER', label: 'Standalone / Docker', blurb: 'A long-lived local cloud. Point any app, CLI or SDK — any language — at it.' },
  { id: 'in-process', kicker: 'SDK-COMPAT', label: 'In-process HTTP', blurb: 'Wrap it in httptest and aim real SDK clients straight at the handle.' },
  { id: 'docker', kicker: 'LIBRARY', label: 'Typed Go API', blurb: 'Skip the wire entirely — call the in-memory drivers directly.' },
] as const;

function Colophon() {
  return (
    <section className="cl-sec">
      <div className="mx-auto max-w-[1180px] text-center">
        <Reveal><div className="cl-k">§ 05 — power on</div></Reveal>
        <Reveal delay={0.05}>
          <h2 className="cl-h2 mx-auto mt-3.5 max-w-[18ch] text-center">Bring a cloud up in <span className="em">one line</span>.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="cl-lead mx-auto text-center">
            Point your existing tests at it today — no credentials, no network, no cleanup. A clean cloud
            on every run.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-[10px] border border-line-2 bg-surface py-2.5 pl-4 pr-2.5 font-mono text-[13.5px]">
            <span className="text-accent">$</span>
            <span>{PRODUCT.install}</span>
            <CopyButton text={PRODUCT.install} />
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a className="cl-btn-p" href="/docs/quick-start">Quick start →</a>
            <a className="cl-btn-s" href={PRODUCT.repo} target="_blank" rel="noreferrer">★ GitHub</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Foot() {
  const { aws, azure, gcp, kubernetes } = PRODUCT.ports;
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-[clamp(26px,6vw,90px)] py-8 font-mono text-[11px] tracking-[0.04em] text-ink-3">
        <span>cloudemu — the cloud, in memory</span>
        <span className="hidden md:inline">AWS :{aws} · AZURE :{azure} · GCP :{gcp} · K8S :{kubernetes}</span>
        <span>{PRODUCT.license} · localhost</span>
      </div>
    </footer>
  );
}

export function Home() {
  return (
    <main className="w-full">
      <ScrollProgress />
      <CollapseHero />
      <Machine />
      <HorizontalReel />
      <Coverage />
      <Ways />
      <Colophon />
      <Foot />
    </main>
  );
}

export default Home;
