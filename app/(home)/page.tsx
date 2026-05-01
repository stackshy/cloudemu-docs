import { Hero } from '@/components/landing/hero';
import { SDKCompatSection } from '@/components/landing/sdk-compat-section';
import { APICoverage } from '@/components/landing/api-coverage';
import { ComparisonTable } from '@/components/landing/comparison-table';
import { FeatureCards } from '@/components/landing/feature-cards';
import { ServiceGrid } from '@/components/landing/service-grid';
import { CodeExample } from '@/components/landing/code-example';
import { CTASection } from '@/components/landing/cta-section';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <Hero />

      <SDKCompatSection />

      <APICoverage />

      <ComparisonTable />
      <FeatureCards />
      <ServiceGrid />
      <CodeExample />
      <CTASection />
    </main>
  );
}
