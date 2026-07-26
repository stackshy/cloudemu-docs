import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import CustomSearchDialog from '@/components/search-dialog';
import { AnnouncementBanner } from '@/components/announcement-banner';
import { MotionProvider } from '@/components/motion-provider';
import Link from '@/components/link';

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable}`}
    >
      <body>
        <a
          href="#nd-page"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2 focus:font-mono focus:text-xs"
        >
          Skip to content
        </a>
        <RootProvider
          theme={{
            attribute: 'class',
            defaultTheme: 'dark',
            enableSystem: true,
          }}
          search={{
            SearchDialog: CustomSearchDialog,
          }}
          components={{ Link }}
        >
          <MotionProvider>
            <AnnouncementBanner />
            {children}
          </MotionProvider>
        </RootProvider>
      </body>
    </html>
  );
}
