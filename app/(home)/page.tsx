import type { Metadata } from 'next';
import { Home } from '@/components/landing/home';
import { JsonLd } from '@/components/seo/json-ld';
import { softwareApplicationLd } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareApplicationLd} />
      <Home />
    </>
  );
}
