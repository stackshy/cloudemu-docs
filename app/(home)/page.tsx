import { Hero } from '@/components/landing/hero';
import { StatsBand } from '@/components/landing/stats-band';
import { SDKCompatSection } from '@/components/landing/sdk-compat-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FeatureCards } from '@/components/landing/feature-cards';
import { ServiceGrid } from '@/components/landing/service-grid';
import { CTASection } from '@/components/landing/cta-section';
import { Problem } from '@/components/landing/problem';
import { Footer } from '@/components/landing/footer';
import { Reveal } from '@/components/landing/reveal';
import { ScrollProgress } from '@/components/landing/scroll-progress';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <ScrollProgress />

      <Hero />

      <StatsBand />

      <Reveal className="w-full flex justify-center">
        <Problem />
      </Reveal>

      <Reveal className="w-full flex justify-center">
        <SDKCompatSection />
      </Reveal>

      <Reveal className="w-full flex justify-center">
        <HowItWorks />
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

      <Footer />
    </main>
  );
}
