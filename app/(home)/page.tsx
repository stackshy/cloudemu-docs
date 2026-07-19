import { Hero } from '@/components/landing/hero';
import { SDKCompatSection } from '@/components/landing/sdk-compat-section';
import { ComparisonTable } from '@/components/landing/comparison-table';
import { FeatureCards } from '@/components/landing/feature-cards';
import { CoverageMatrix } from '@/components/landing/coverage-matrix';
import { TwoSurfaces } from '@/components/landing/two-surfaces';
import { CTASection } from '@/components/landing/cta-section';
import { ScrollWire } from '@/components/landing/scroll-wire';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <ScrollWire />
      <Hero />
      <SDKCompatSection />
      <ComparisonTable />
      <FeatureCards />
      <CoverageMatrix />
      <TwoSurfaces />
      <CTASection />
    </main>
  );
}
