import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { CodePre } from '@/components/code/pre';
import { ProviderTabs, ProviderTab } from '@/components/code/provider-tabs';
import { Callout } from '@/components/docs/callout';
import { mdxHeadings } from '@/components/docs/heading';
import { PrevNext } from '@/components/docs/prev-next';
import { PacketFlow } from '@/components/diagrams/packet-flow';
import { ChaosTimeline } from '@/components/diagrams/chaos-timeline';
import { RequestFlow } from '@/components/diagrams/request-flow';
import { PortableFlow } from '@/components/diagrams/portable-flow';
import { WireProtocols } from '@/components/diagrams/wire-protocols';
import { TopologyGraph } from '@/components/diagrams/topology-graph';
import { FeatureGlyph } from '@/components/diagrams/feature-glyph';
import { ServePorts } from '@/components/diagrams/serve-ports';
import { DiagramFrame } from '@/components/docs/figure';

/** Diagrams framed as FIG. plates at the mapping layer — no MDX edits. */
const framed = {
  RequestFlow: () => (
    <DiagramFrame caption="The request path — a real SDK call into the in-memory backend and back.">
      <RequestFlow />
    </DiagramFrame>
  ),
  WireProtocols: () => (
    <DiagramFrame caption="The wire protocols cloudemu speaks, per provider.">
      <WireProtocols />
    </DiagramFrame>
  ),
  ServePorts: () => (
    <DiagramFrame caption="One long-lived server; stable endpoints per cloud.">
      <ServePorts />
    </DiagramFrame>
  ),
  TopologyGraph: () => (
    <DiagramFrame caption="The network topology the connectivity engine evaluates.">
      <TopologyGraph />
    </DiagramFrame>
  ),
  ChaosTimeline: () => (
    <DiagramFrame caption="A time-bounded chaos window, with automatic recovery.">
      <ChaosTimeline />
    </DiagramFrame>
  ),
  PortableFlow: () => (
    <DiagramFrame caption="The portable API layered over per-provider drivers.">
      <PortableFlow />
    </DiagramFrame>
  ),
  PacketFlow: () => (
    <DiagramFrame caption="A packet traversing the simulated network path.">
      <PacketFlow />
    </DiagramFrame>
  ),
};

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const data = page.data as any;
  const MDX = data.body;

  return (
    <DocsPage
      toc={data.toc}
      full={data.full}
      breadcrumb={{ className: 'u-breadcrumb' }}
      footer={{ enabled: false }}
      tableOfContent={{
        header: <p className="u-toc-title mb-2">Contents of this leaf</p>,
      }}
    >
      <div className="u-chapter-opener not-prose mb-8 border-b border-line pb-7">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <span className="text-accent">§</span> The Field Manual
        </p>
        <DocsTitle className="font-serif text-[40px] leading-[1.08] tracking-[-0.025em] text-ink">
          {data.title}
        </DocsTitle>
        {data.description && (
          <DocsDescription className="mb-0 mt-3 text-[17px] leading-relaxed text-ink-2">
            {data.description}
          </DocsDescription>
        )}
        {(data.aws || data.azure || data.gcp) && (
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink-2">
            {data.aws && (
              <span>
                <span style={{ color: 'var(--aws)' }}>aws</span> {data.aws}
              </span>
            )}
            {data.azure && (
              <span>
                <span style={{ color: 'var(--azure)' }}>azr</span> {data.azure}
              </span>
            )}
            {data.gcp && (
              <span>
                <span style={{ color: 'var(--gcp)' }}>gcp</span> {data.gcp}
              </span>
            )}
          </p>
        )}
      </div>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            ...mdxHeadings,
            pre: CodePre,
            Callout,
            ProviderTabs,
            ProviderTab,
            FeatureGlyph,
            ...framed,
          }}
        />
        <PrevNext url={page.url} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
