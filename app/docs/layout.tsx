import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
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
      ]}
    >
      {children}
    </DocsLayout>
  );
}
