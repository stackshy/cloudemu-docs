import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';
import { LogoMark } from '@/components/logo';
import { GithubStarPill } from '@/components/github-stars';
import { SiteFooter } from '@/components/site-footer';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      nav={{
        title: <LogoMark />,
        url: '/',
      }}
      links={[
        { text: 'Docs', url: '/docs' },
        { text: 'Blog', url: '/blog' },
        { type: 'custom', secondary: true, children: <GithubStarPill /> },
      ]}
    >
      {children}
      <SiteFooter />
    </HomeLayout>
  );
}
