"use client";

import { HeroGradientBackground } from "@/modules/landing/components/hero/hero-gradient/hero-gradient-background";

type AuroraBackgroundProps = {
  onReady?: () => void;
};

export function AuroraBackground({ onReady }: AuroraBackgroundProps) {
  return (
    <div className="hero-aurora-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <HeroGradientBackground onReady={onReady} />
    </div>
  );
}
