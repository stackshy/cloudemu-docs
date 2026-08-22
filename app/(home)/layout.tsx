import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';
import { LogoMark } from '@/components/logo';
import { GitHubStars } from '@/components/github-stars';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      nav={{
        title: <LogoMark />,
        url: '/',
      }}
      themeSwitch={{ enabled: false }}
      links={[
        { text: 'Docs', url: '/docs' },
        { text: 'Changelog', url: '/changelog' },
        { text: 'Blog', url: '/blog' },
        { text: 'Contributors', url: '/contributors' },
        { type: 'custom', children: <GitHubStars />, secondary: true },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
