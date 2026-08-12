'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { Kicker } from '@/components/landing/section';
import { DUR, EASE, fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

/** The one accent color — ember on warm charcoal. Used sparingly. */
const EMBER = '#FF6B2C';

const posts = [
  {
    title: 'Introducing cloudemu',
    description: 'Point real cloud SDKs at an in-memory backend. Why we built it, and how it stays out of your way.',
    date: '2026-03-26',
    slug: 'hello-world',
  },
];

export default function BlogPage() {
  const reduce = useReducedMotion();

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <motion.header
        variants={reduce ? undefined : staggerContainer(0.08)}
        initial={reduce ? false : 'hidden'}
        animate={reduce ? undefined : 'show'}
        className="flex flex-col gap-4 border-b border-fd-border pb-10"
      >
        <motion.div variants={reduce ? undefined : fadeUp(0, 12)}>
          <Kicker index="01">The log</Kicker>
        </motion.div>
        <motion.h1
          variants={reduce ? undefined : fadeUp(0, 12)}
          className="text-4xl font-bold tracking-tight"
        >
          Writing
        </motion.h1>
        <motion.p
          variants={reduce ? undefined : fadeUp(0, 12)}
          className="max-w-2xl text-lg text-fd-muted-foreground"
        >
          Design notes, wire-protocol traps, and the reasoning behind cloudemu&apos;s internals.
          Sparse on purpose — we write when there&apos;s something worth writing down.
        </motion.p>
      </motion.header>

      <motion.div
        variants={reduce ? undefined : staggerContainer()}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
      >
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} reduce={!!reduce} />
        ))}
      </motion.div>
    </main>
  );
}

/** A single hairline-separated entry. Date in tabular mono, title, one-line
 *  description. An ember underline slides in under the row on hover — motion,
 *  so it renders only when motion is allowed. */
function PostRow({
  post,
  reduce,
}: {
  post: { title: string; description: string; date: string; slug: string };
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div variants={reduce ? undefined : fadeUp(0, 14)}>
      <Link
        href={`/blog/${post.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative grid grid-cols-1 md:grid-cols-[130px_1fr] items-baseline gap-x-8 gap-y-2 py-7 border-b border-fd-border"
      >
        <time className="font-mono text-xs tabular-nums uppercase tracking-widest text-fd-muted-foreground/80">
          {post.date}
        </time>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-ember-500">
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed text-fd-muted-foreground">
            {post.description}
          </p>
        </div>

        {!reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
            style={{ background: EMBER, transformOrigin: 'left', willChange: 'transform, opacity' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 0.45 : 0 }}
            transition={{ duration: DUR.fast, ease: EASE }}
          />
        )}
      </Link>
    </motion.div>
  );
}
