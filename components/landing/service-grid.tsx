'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  Server, HardDrive, Database, Zap, Network, Activity,
  Shield, Globe, GitBranch, MessageSquare, Bell, Radio,
  Box, MemoryStick, Lock, FileText,
} from 'lucide-react';
import { services } from '@/lib/services';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Server, HardDrive, Database, Zap, Network, Activity,
  Shield, Globe, GitBranch, MessageSquare, Bell, Radio,
  Box, MemoryStick, Lock, FileText,
};

const PROVIDER = {
  aws: '#FF9900',
  azure: '#0078D4',
  gcp: '#4285F4',
  oci: '#C74634',
};

export function ServiceGrid() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-20">
      <div className="mb-4 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight">16 service categories</h2>
        <p className="mt-2 text-fd-muted-foreground">
          Every category is implemented for AWS, Azure, and GCP — with OCI arriving service by service.
        </p>
      </div>

      <motion.div
        variants={reduce ? undefined : container}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10"
      >
        {services.map((service) => {
          const Icon = iconMap[service.icon];
          return (
            <motion.div key={service.slug} variants={reduce ? undefined : item}>
              <Link
                href={`/docs/services/${service.slug}`}
                className="group flex items-baseline justify-between gap-4 py-4 border-t border-fd-border hover:border-fd-primary/50 transition-colors"
              >
                <span className="flex items-center gap-2.5 shrink-0">
                  {Icon && (
                    <Icon className="w-4 h-4 text-fd-muted-foreground group-hover:text-fd-primary transition-colors" />
                  )}
                  <span className="font-medium group-hover:text-fd-primary transition-colors">
                    {service.category}
                  </span>
                </span>
                <span className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 font-mono text-[11px] text-fd-muted-foreground/80 text-right">
                  <Chip color={PROVIDER.aws} label="aws" value={service.aws} />
                  <Chip color={PROVIDER.azure} label="az" value={service.azure} />
                  <Chip color={PROVIDER.gcp} label="gcp" value={service.gcp} />
                  {service.oci && <Chip color={PROVIDER.oci} label="oci" value={service.oci} />}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

function Chip({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <span className="whitespace-nowrap">
      <span style={{ color }}>{label}</span> {value}
    </span>
  );
}
