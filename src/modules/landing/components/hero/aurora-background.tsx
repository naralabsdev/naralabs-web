"use client";

import { HeroGradientBackground } from "@/modules/landing/components/hero/hero-gradient/hero-gradient-background";
import type { AuroraTheme } from "@/modules/landing/components/hero/aurora-themes";

type AuroraBackgroundProps = {
  onReady?: () => void;
  theme?: AuroraTheme;
};

export function AuroraBackground({ onReady, theme = "default" }: AuroraBackgroundProps) {
  return (
    <div className="hero-aurora-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <HeroGradientBackground onReady={onReady} theme={theme} />
    </div>
  );
}
