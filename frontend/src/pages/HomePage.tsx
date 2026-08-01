/**
 * Home page: composes the hero, feature grid, and stats banner.
 */

import { HeroSection } from "@/pages/HeroSection";
import { FeatureGrid } from "@/pages/FeatureGrid";
import { StatsBanner } from "@/pages/StatsBanner";

export default function HomePage(): JSX.Element {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeatureGrid />
      <StatsBanner />
    </div>
  );
}
