'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Server, HardDrive, Database, Zap, Network, Activity,
  Shield, Globe, GitBranch, MessageSquare, Bell, Radio,
  Box, MemoryStick, Lock, FileText,
} from 'lucide-react';
import { services } from '@/lib/services';
import { STATS } from '@/lib/product';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { SectionHeader } from '@/components/landing/section';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Server, HardDrive, Database, Zap, Network, Activity,
  Shield, Globe, GitBranch, MessageSquare, Bell, Radio,
  Box, MemoryStick, Lock, FileText,
};

/** Semantic provider tokens — the only place provider colors touch text. */
const PROVIDER_CLASS = {
  aws: 'text-aws',
  azure: 'text-azure',
  gcp: 'text-gcp',
};

export function ServiceGrid() {
  const reduce = useReducedMotion();
  const categories = services.length;

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-20">
      <SectionHeader
        index="05"
        kicker="Coverage"
        title={`${categories} service categories`}
        lede={`${categories * STATS.clouds} implementations behind them — every category built for AWS, Azure, and GCP.`}
        className="mb-8"
      />

      <motion.div
        variants={reduce ? undefined : staggerContainer(0.04)}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
        className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10"
      >
        {services.map((service) => {
          const Icon = iconMap[service.icon];
          return (
            <motion.div key={service.slug} variants={reduce ? undefined : fadeUp(0, 12)}>
              <Link
                href={`/docs/services/${service.slug}`}
                className="group relative flex items-baseline justify-between gap-4 py-4 border-t border-line transition-colors duration-200 hover:border-line-2"
              >
                <span
                  aria-hidden
                  className={
                    'pointer-events-none absolute left-0 top-[-1px] h-[2px] rounded-full bg-accent origin-left ' +
                    'w-8 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100' +
                    (reduce ? '' : ' -translate-x-2 group-hover:translate-x-0')
                  }
                />
                <span
                  className={
                    'flex items-center gap-2.5 shrink-0 transition-transform duration-200 ease-out' +
                    (reduce ? '' : ' group-hover:translate-x-[2px]')
                  }
                >
                  {Icon && (
                    <Icon
                      className={
                        'w-4 h-4 text-ink-3 transition-[color,transform] duration-200 ease-out group-hover:text-accent' +
                        (reduce ? '' : ' group-hover:-translate-y-[1px]')
                      }
                    />
                  )}
                  <span className="font-medium text-ink transition-colors duration-200 group-hover:text-accent">
                    {service.category}
                  </span>
                </span>
                <span className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 font-mono text-[11px] text-ink-3 text-right">
                  <Chip colorClass={PROVIDER_CLASS.aws} label="aws" value={service.aws} />
                  <Chip colorClass={PROVIDER_CLASS.azure} label="az" value={service.azure} />
                  <Chip colorClass={PROVIDER_CLASS.gcp} label="gcp" value={service.gcp} />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

function Chip({ colorClass, label, value }: { colorClass: string; label: string; value: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className={colorClass}>{label}</span> {value}
    </span>
  );
}
