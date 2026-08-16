import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { LogoMark } from '@/components/logo';
import { GitHubStars } from '@/components/github-stars';

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
        banner: (
          <div className="flex items-center justify-between gap-2">
            <span className="u-eyebrow">theme</span>
            <ThemeSwitch mode="light-dark" />
          </div>
        ),
      }}
      links={[
        {
          text: 'Blog',
          url: '/blog',
        },
        { type: 'custom', children: <GitHubStars />, secondary: true },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
