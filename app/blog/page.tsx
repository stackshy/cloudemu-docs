import Link from 'next/link';

const posts = [
  {
    title: 'Introducing cloudemu',
    description:
      'Test your cloud code without the cloud — a free, instant stand-in for AWS, Azure, and Google Cloud.',
    date: '2026-07-11',
    slug: 'hello-world',
  },
];

export default function BlogPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="u-eyebrow mb-3">
        blog
      </p>
      <h1 className="text-[32px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink">
        Blog
      </h1>
      <p className="mt-2 text-ink-2">
        Updates, tutorials, and engineering notes from cloudemu.
      </p>

      <div className="mt-12 flex flex-col">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-1 gap-1 border-t border-line py-7 transition-colors last:border-b sm:grid-cols-[8.5rem_1fr] sm:gap-6"
          >
            <time className="pt-1 font-mono text-xs uppercase tracking-[0.06em] text-ink-3">
              {post.date}
            </time>
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink">
                {post.title}
              </h2>
              <p className="mt-1.5 leading-relaxed text-ink-2">
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
