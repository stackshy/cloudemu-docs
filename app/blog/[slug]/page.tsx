import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { CodeCopy } from '@/components/blog/code-copy';

const blogDir = path.join(process.cwd(), 'content/blog');

async function getBlogPost(slug: string) {
  const filePath = path.join(blogDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, 'utf-8');
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/);
  const content = source.replace(/^---\n[\s\S]*?\n---\n/, '');

  let title = slug;
  let description = '';
  let date = '';
  let author = '';
  const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, '');
  if (frontmatterMatch) {
    const fm = frontmatterMatch[1];
    const titleMatch = fm.match(/title:\s*(.*)/);
    const descMatch = fm.match(/description:\s*(.*)/);
    const dateMatch = fm.match(/date:\s*(.*)/);
    const authorMatch = fm.match(/author:\s*(.*)/);
    if (titleMatch) title = unquote(titleMatch[1]);
    if (descMatch) description = unquote(descMatch[1]);
    if (dateMatch) date = unquote(dateMatch[1]);
    if (authorMatch) author = unquote(authorMatch[1]);
  }

  return { title, description, date, author, content };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Inline formatting: escape first, then apply markdown for `code`, **bold**,
// and [text](href). Order matters — inline code is extracted before bold so
// asterisks inside code aren't treated as emphasis.
function inline(s: string): string {
  return escapeHtml(s)
    .replace(
      /`([^`]+)`/g,
      '<code class="u-chip-code">$1</code>',
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-ink font-semibold">$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="font-medium text-ink underline decoration-line-2 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent">$1</a>',
    );
}

// A small block-level markdown renderer good enough for blog posts: fenced code
// blocks, headings, unordered lists, blockquotes, and paragraphs — each with
// inline formatting applied.
function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  let inList = false;
  let tableBuffer: string[] = [];

  const closeList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };

  const flushCode = () => {
    out.push(
      `<pre class="my-7 overflow-x-auto rounded-lg border border-line bg-raised p-4"><code class="font-mono text-[13px] leading-[1.65]">${escapeHtml(
        codeBuffer.join('\n'),
      )}</code></pre>`,
    );
    codeBuffer = [];
  };

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer.map((r) =>
      r
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim()),
    );
    const isSep = (cells: string[]) => cells.every((c) => /^:?-{2,}:?$/.test(c));
    const header = rows[0];
    const bodyStart = rows[1] && isSep(rows[1]) ? 2 : 1;
    const th = header
      .map(
        (c) =>
          `<th class="border-b border-line-2 px-3 py-2 text-left font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-ink-3">${inline(
            c,
          )}</th>`,
      )
      .join('');
    let body = '';
    for (let i = bodyStart; i < rows.length; i++) {
      body +=
        '<tr>' +
        rows[i]
          .map(
            (c) =>
              `<td class="border-b border-line px-3 py-2 text-ink-2">${inline(c)}</td>`,
          )
          .join('') +
        '</tr>';
    }
    out.push(
      `<div class="my-4 overflow-x-auto"><table class="w-full border-collapse text-sm"><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`,
    );
    tableBuffer = [];
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushTable();
        closeList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    if (line.trimStart().startsWith('|')) {
      closeList();
      tableBuffer.push(line);
      continue;
    }
    flushTable();

    if (line.startsWith('### ')) {
      closeList();
      out.push(`<h3 class="text-[17px] font-semibold text-ink mt-8 mb-2">${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      closeList();
      out.push(`<h2 class="text-[22px] font-semibold text-ink mt-12 mb-3 border-t border-line pt-6">${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      closeList();
      out.push(`<h1 class="text-[26px] font-semibold text-ink mt-10 mb-4">${inline(line.slice(2))}</h1>`);
    } else if (line.startsWith('> ')) {
      closeList();
      out.push(
        `<blockquote class="my-4 border-l-2 border-line-2 pl-4 italic text-ink-2">${inline(
          line.slice(2),
        )}</blockquote>`,
      );
    } else if (/^[-*] /.test(line)) {
      if (!inList) {
        out.push('<ul class="my-4 flex flex-col gap-1">');
        inList = true;
      }
      out.push(`<li class="ml-6 list-disc text-ink-2">${inline(line.slice(2))}</li>`);
    } else if (line.trim() === '') {
      closeList();
    } else {
      closeList();
      out.push(`<p class="my-5 text-ink-2 leading-[1.75]">${inline(line)}</p>`);
    }
  }

  closeList();
  flushTable();
  if (inCode && codeBuffer.length) {
    flushCode();
  }

  return out.join('\n');
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <article>
        <h1 className="text-[32px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink mb-3">{post.title}</h1>
        {(post.date || post.author) && (
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.06em] text-ink-3">
            {post.date}
            {post.date && post.author ? ' · ' : ''}
            {post.author}
          </p>
        )}
        <p className="text-base text-ink-2 mb-8 leading-relaxed">{post.description}</p>
        <CodeCopy>
          <div
            className="max-w-[72ch] text-base"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CodeCopy>
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
