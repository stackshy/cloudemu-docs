import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { blogSource } from '@/lib/source';
import { CodePre } from '@/components/code/pre';
import { Callout } from '@/components/docs/callout';
import { mdxHeadings } from '@/components/docs/heading';
import { JsonLd } from '@/components/seo/json-ld';
import { blogPostingLd } from '@/lib/seo';

export function generateStaticParams() {
  return blogSource
    .generateParams()
    .map((p) => ({ slug: p.slug?.[0] ?? '' }))
    .filter((p) => p.slug !== '');
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = page.data as any;
  const MDX = data.body;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <JsonLd
        data={blogPostingLd({
          title: data.title,
          description: data.description,
          path: page.url,
          date: data.date,
        })}
      />
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-2 font-mono text-xs text-ink-3 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All posts
      </Link>

      <article>
        <header className="mb-10 border-b border-line pb-8">
          {data.date && (
            <time className="font-mono text-xs uppercase tracking-widest text-ink-3">
              {data.date}
            </time>
          )}
          <h1 className="font-serif mt-3 text-[clamp(34px,6vw,54px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-ink">
            {data.title}
          </h1>
          {data.description && (
            <p className="mt-3 text-lg leading-relaxed text-ink-2">{data.description}</p>
          )}
        </header>

        <div className="prose">
          <MDX
            components={{
              ...defaultMdxComponents,
              ...mdxHeadings,
              pre: CodePre,
              Callout,
            }}
          />
        </div>
      </article>
    </main>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) return {};
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: `/blog/${params.slug}` },
  };
}
