import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Banner } from 'fumadocs-ui/components/banner';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import CustomSearchDialog from '@/components/search-dialog';

export const metadata: Metadata = {
  title: {
    template: '%s | cloudemu',
    default: 'cloudemu — Zero-Cost Cloud Emulation for Go',
  },
  description:
    'In-memory cloud service emulation for AWS, Azure, and GCP. No cloud accounts, no Docker, no network calls.',
  openGraph: {
    title: 'cloudemu — Zero-Cost Cloud Emulation for Go',
    description:
      'In-memory cloud service emulation for AWS, Azure, and GCP. No cloud accounts, no Docker, no network calls.',
    siteName: 'cloudemu',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider
          theme={{
            attribute: 'class',
            defaultTheme: 'system',
            enableSystem: true,
          }}
          search={{
            SearchDialog: CustomSearchDialog,
          }}
        >
          <Banner id="cloudemu-v2-release" variant="rainbow" height="2.75rem">
            <span className="inline-flex items-center gap-1.5">
              <Logo
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              />
              <strong>cloudemu v2.0.0</strong> is here — packages are
              reorganized and the import path is now{' '}
              <code className="mx-0.5 rounded bg-black/15 px-1 py-0.5 font-mono text-[0.85em] dark:bg-white/15">
                /v2
              </code>
              .{' '}
              <Link
                href="/docs/installation#migrating-to-v2"
                className="font-semibold underline underline-offset-2 hover:no-underline"
              >
                Read the migration notes →
              </Link>
            </span>
          </Banner>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
