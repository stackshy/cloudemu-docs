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
import { Chip } from '@/components/ui';

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
        <div className="-mt-2 mb-4 flex flex-wrap gap-2">
          {data.aws && <Chip provider="aws">AWS · {data.aws}</Chip>}
          {data.azure && <Chip provider="azure">Azure · {data.azure}</Chip>}
          {data.gcp && <Chip provider="gcp">GCP · {data.gcp}</Chip>}
        </div>
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
