import { Hero } from '@/components/landing/hero';
import { SDKCompatSection } from '@/components/landing/sdk-compat-section';
import { FeatureCards } from '@/components/landing/feature-cards';
import { ServiceGrid } from '@/components/landing/service-grid';
import { CTASection } from '@/components/landing/cta-section';
import { Reveal } from '@/components/landing/reveal';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <Hero />

      <Reveal className="w-full flex justify-center">
        <SDKCompatSection />
      </Reveal>

      <Reveal className="w-full flex justify-center">
        <FeatureCards />
      </Reveal>

      <Reveal className="w-full flex justify-center">
        <ServiceGrid />
      </Reveal>

      <Reveal className="w-full flex justify-center">
        <CTASection />
      </Reveal>
    </main>
  );
}
