'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { AnimatedBackground } from './animated-background';
import { Terminal } from './code-window';
import { Logo } from '../logo';

export function Hero() {
  const reduce = useReducedMotion();
  const container = staggerContainer(0.09, 0.04);
  const item = fadeUp(0, 12);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>
      {/* Soft ember ambient glow — depth behind the headline, both themes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]"
        style={{
          background:
            'radial-gradient(58% 55% at 50% 2%, rgba(255,107,44,0.12), transparent 72%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-2), transparent)' }}
      />

      <div className="mx-auto w-full max-w-3xl px-6 pb-16 pt-24 text-center sm:pt-28">
        <motion.div
          variants={reduce ? undefined : container}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? false : 'show'}
        >
          <motion.div variants={reduce ? undefined : item} className="mb-7 flex justify-center">
            <Logo width={52} height={52} />
          </motion.div>

          <motion.div variants={reduce ? undefined : item} className="mb-5">
            <span className="u-eyebrow">A real cloud emulator · any language</span>
          </motion.div>

          <motion.h1
            variants={reduce ? undefined : item}
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.5rem]"
          >
            Run the real cloud SDKs
            <br />
            without a{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(92deg, var(--accent), #ff9a5c)' }}
            >
              real cloud
            </span>
            .
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : item}
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:text-lg"
          >
            A drop-in AWS, Azure, and GCP that runs entirely in memory. Point your real
            app, SDK, or CLI at it — in-process, as a standalone server, or in Docker.
            Any language, ~10&nbsp;ms a call, zero cloud accounts.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : item}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/docs/quick-start" className="u-btn u-btn-primary group">
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/docs/sdk-compat" className="u-btn u-btn-secondary">
              How it works
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-14 max-w-2xl text-left"
        >
          <Terminal
            title="your terminal"
            lines={[
              { kind: 'comment', text: 'Start the whole cloud with one command' },
              { kind: 'cmd', text: 'docker run -p 4566:4566 ghcr.io/stackshy/cloudemu' },
              { kind: 'out', text: 'cloudemu ready — AWS :4566  Azure :4568  GCP :4569' },
              { kind: 'blank' },
              { kind: 'comment', text: 'Point your real app, SDK, or CLI at it — any language' },
              { kind: 'cmd', text: 'aws --endpoint-url http://localhost:4566 s3 mb s3://prod' },
              { kind: 'out', text: 'make_bucket: prod' },
            ]}
          />

          <p className="mt-3 text-center text-xs text-ink-3">
            Prefer Go? Wire it straight into your app or tests with the in-process API.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
