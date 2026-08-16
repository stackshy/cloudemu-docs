import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import CustomSearchDialog from '@/components/search-dialog';

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

const description =
  'Run the real AWS, Azure, and GCP SDKs against a local, in-memory emulator — in-process, as a standalone server, or in Docker. Any language. No cloud accounts, no bills.';

export const metadata: Metadata = {
  title: {
    template: '%s | cloudemu',
    default: 'cloudemu — Zero-Cost Cloud Emulator for AWS, Azure & GCP',
  },
  description,
  openGraph: {
    title: 'cloudemu — Zero-Cost Cloud Emulator for AWS, Azure & GCP',
    description,
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
            defaultTheme: 'light',
            enableSystem: false,
            // Bump the storage key so any previously-saved dark preference is
            // ignored and everyone lands on the light default on next load.
            storageKey: 'cloudemu-theme-v2',
          }}
          search={{
            SearchDialog: CustomSearchDialog,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
