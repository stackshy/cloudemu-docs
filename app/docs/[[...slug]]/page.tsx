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
        header: <p className="u-toc-title mb-2">On this page</p>,
      }}
    >
      <DocsTitle className="text-[32px] leading-[1.25] tracking-[-0.02em] text-ink">
        {data.title}
      </DocsTitle>
      <DocsDescription className="mb-6 text-base text-ink-2">
        {data.description}
      </DocsDescription>
      {(data.aws || data.azure || data.gcp) && (
        <p className="-mt-2 mb-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink-2">
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
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            ...mdxHeadings,
            pre: CodePre,
            Callout,
            ProviderTabs,
            ProviderTab,
            PacketFlow,
            ChaosTimeline,
            RequestFlow,
            PortableFlow,
            WireProtocols,
            TopologyGraph,
            FeatureGlyph,
            ServePorts,
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
