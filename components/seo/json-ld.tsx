/**
 * JsonLd — renders one or more schema.org objects as a JSON-LD <script>.
 * Inlined in the page so crawlers and AI answer-engines can read it.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(Array.isArray(data) ? data : [data]);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
