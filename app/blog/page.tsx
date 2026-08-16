import Link from 'next/link';
import { blogSource } from '@/lib/source';

export default function BlogPage() {
  const posts = [...blogSource.getPages()].sort((a, b) => {
    const da = (a.data as { date?: string }).date ?? '';
    const db = (b.data as { date?: string }).date ?? '';
    return db.localeCompare(da);
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <header className="flex flex-col gap-4 border-b border-line pb-10">
        <span className="u-eyebrow">The log</span>
        <h1 className="text-4xl font-semibold tracking-[-0.02em] text-ink">Writing</h1>
        <p className="max-w-xl text-lg leading-relaxed text-ink-2">
          Design notes, wire-protocol traps, and the reasoning behind cloudemu&apos;s
          internals. Sparse on purpose — we write when there&apos;s something worth writing
          down.
        </p>
      </header>

      <div>
        {posts.map((post) => {
          const date = (post.data as { date?: string }).date;
          return (
            <Link
              key={post.url}
              href={post.url}
              className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-line py-7 md:grid-cols-[130px_1fr]"
            >
              <time className="font-mono text-xs uppercase tracking-widest text-ink-3 tabular-nums">
                {date}
              </time>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                  {post.data.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink-2">{post.data.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
