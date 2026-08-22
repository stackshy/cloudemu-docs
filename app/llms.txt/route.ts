import { source } from '@/lib/source';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

/**
 * /llms.txt — a curated map of the docs for AI coding assistants.
 * (Not an SEO ranking signal; the one place it genuinely helps is dev docs.)
 */
export function GET() {
  const pages = source.getPages();
  const docLines = pages
    .map((p) => {
      const d = p.data as { title: string; description?: string };
      return `- [${d.title}](${SITE_URL}${p.url})${d.description ? `: ${d.description}` : ''}`;
    })
    .join('\n');

  const body = `# cloudemu

> A real emulator of AWS, Azure, and GCP that lives in memory. Point real code, SDKs, or CLIs at it — any language, ~10 ms a call, no cloud accounts, no bills.

cloudemu speaks the real cloud wire protocols, so unmodified apps, SDKs (any language), and CLIs run against an in-memory backend — in-process, as a standalone server, or in Docker.

## Documentation
${docLines}

## More
- [Changelog](${SITE_URL}/changelog): every release, newest first.
- [Blog](${SITE_URL}/blog): design notes and internals.
- [Source](https://github.com/stackshy/cloudemu): the Go source and issue tracker.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
