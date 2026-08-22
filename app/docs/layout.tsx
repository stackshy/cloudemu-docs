import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { LogoMark } from '@/components/logo';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: <LogoMark />,
        url: '/',
      }}
      themeSwitch={{ enabled: false }}
      sidebar={{
        defaultOpenLevel: 1,
        // The expanded sidebar has ~40 links; Next.js eagerly prefetches every
        // visible one on load, firing a burst of parallel ?_rsc= requests. Over
        // HTTP/1.1 (browser caps at ~6 connections/host) that burst saturates
        // the pool and stalls real navigation clicks. Disabling sidebar prefetch
        // makes navigation fetch on demand (one request per click) so the site
        // stays responsive regardless of the edge transport.
        prefetch: false,
      }}
      links={[
        {
          text: 'Changelog',
          url: '/changelog',
        },
        {
          text: 'Blog',
          url: '/blog',
        },
        {
          text: 'Contributors',
          url: '/contributors',
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
