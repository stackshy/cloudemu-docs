import { Hero } from '@/components/landing/hero';
import { StatsBand } from '@/components/landing/stats-band';
import { RunModes } from '@/components/landing/run-modes';
import { FeatureCards } from '@/components/landing/feature-cards';
import { ServiceGrid } from '@/components/landing/service-grid';
import { CTASection } from '@/components/landing/cta-section';
import { Problem } from '@/components/landing/problem';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <main className="flex w-full flex-col items-center">
      <Hero />
      <StatsBand />
      <div className="w-full flex justify-center">
        <Problem />
      </div>
      <RunModes />
      <div className="w-full flex justify-center">
        <FeatureCards />
      </div>
      <div className="w-full flex justify-center">
        <ServiceGrid />
      </div>
      <div className="w-full flex justify-center">
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
