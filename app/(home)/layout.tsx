import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';
import { LogoMark } from '@/components/logo';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      nav={{
        title: <LogoMark />,
        url: '/',
      }}
      links={[
        { text: 'Docs', url: '/docs' },
        { text: 'Blog', url: '/blog' },
        {
          text: 'GitHub',
          url: 'https://github.com/stackshy/cloudemu',
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
