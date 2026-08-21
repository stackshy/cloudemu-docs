import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';
import { LogoMark } from '@/components/logo';
import { GitHubStars } from '@/components/github-stars';

export default function ChangelogLayout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      nav={{ title: <LogoMark />, url: '/' }}
      links={[
        { text: 'Docs', url: '/docs' },
        { text: 'Changelog', url: '/changelog' },
        { text: 'Blog', url: '/blog' },
        { type: 'custom', children: <GitHubStars />, secondary: true },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
