import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Instrument_Sans, JetBrains_Mono, Bricolage_Grotesque } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import CustomSearchDialog from '@/components/search-dialog';
import { JsonLd } from '@/components/seo/json-ld';
import { organizationLd, websiteLd } from '@/lib/seo';

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

// Bricolage Grotesque — the display voice for "Collapse": an expressive,
// slightly wide grotesque set heavy and tight. Carries the kinetic headlines
// and section titles across the whole site.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['500', '700', '800'],
});

const description =
  'A real emulator of AWS, Azure, and GCP that lives in memory. Point real code, SDKs, or CLIs at it — any language, ~10 ms a call, no cloud accounts, no bills.';

export const metadata: Metadata = {
  metadataBase: new URL('https://cloudemu.info'),
  title: {
    template: '%s · cloudemu',
    default: 'cloudemu — the cloud, in memory',
  },
  description,
  applicationName: 'cloudemu',
  keywords: [
    'cloud emulator',
    'AWS emulator',
    'Azure emulator',
    'GCP emulator',
    'LocalStack alternative',
    'in-memory cloud',
    'Go',
    'testing',
  ],
  openGraph: {
    type: 'website',
    title: 'cloudemu — the cloud, in memory',
    description,
    siteName: 'cloudemu',
    url: 'https://cloudemu.info',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cloudemu — the cloud, in memory',
    description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
    >
      <body>
        <JsonLd data={[organizationLd, websiteLd]} />
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
