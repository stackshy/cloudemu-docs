import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import { toHtml } from 'hast-util-to-html';
import { codeToHtml, type BundledLanguage } from 'shiki';

const blogDir = path.join(process.cwd(), 'content/blog');

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Render a markdown body to HTML: proper prose via remark, code via shiki (vesper). */
async function renderMarkdown(md: string): Promise<string> {
  // Pull fenced code blocks out first so shiki can highlight them, leaving a
  // plain token in their place that survives markdown parsing.
  const blocks: { lang: string; code: string }[] = [];
  const src = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang: string, code: string) => {
    const i = blocks.length;
    blocks.push({ lang: lang || 'text', code: code.replace(/\n$/, '') });
    return `\n\nCLOUDEMUCODE${i}END\n\n`;
  });

  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);
  const tree = processor.parse(src);
  const hast = await processor.run(tree);
  let html = toHtml(hast);

  const highlighted = await Promise.all(
    blocks.map(async (b) => {
      const out = await codeToHtml(b.code, {
        lang: b.lang as BundledLanguage,
        theme: 'vesper',
      }).catch(() => `<pre class="shiki"><code>${escapeHtml(b.code)}</code></pre>`);
      // Match the warm charcoal the docs/home code panels use.
      return out.replace(/background-color:#101010/i, 'background-color:hsl(26, 9%, 13%)');
    }),
  );

  html = html.replace(/<p>CLOUDEMUCODE(\d+)END<\/p>/g, (_m, i) => highlighted[Number(i)] ?? '');
  return html;
}

async function getBlogPost(slug: string) {
  const filePath = path.join(blogDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, 'utf-8');
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/);
  let body = source.replace(/^---\n[\s\S]*?\n---\n/, '');

  let title = slug;
  let description = '';
  let date = '';
  if (frontmatterMatch) {
    const fm = frontmatterMatch[1];
    const titleMatch = fm.match(/title:\s*(.*)/);
    const descMatch = fm.match(/description:\s*(.*)/);
    const dateMatch = fm.match(/date:\s*(.*)/);
    if (titleMatch) title = titleMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
    if (dateMatch) date = dateMatch[1].trim();
  }

  // Drop a leading H1 — the page renders the title itself.
  body = body.replace(/^#\s+.*\n+/, '');

  const html = await renderMarkdown(body);
  return { title, description, date, html };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <article>
        <header className="mb-10 pb-8 border-b border-fd-border">
          {post.date && (
            <time className="text-sm text-fd-muted-foreground">{post.date}</time>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight mt-2 mb-3">{post.title}</h1>
          {post.description && (
            <p className="text-lg text-fd-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}
        </header>
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}
