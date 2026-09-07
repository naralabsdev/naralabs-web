"use client";

import { useState } from "react";
import { AuroraBackground } from "@/modules/landing/components/hero/aurora-background";
import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { EXPLORER_HERO } from "@/modules/landing/constants/homepage-content";
import { HeroSearchBlock } from "@/modules/landing/components/hero/hero-search-block";

export function HeroSection() {
  const [auroraReady, setAuroraReady] = useState(false);

  return (
    <section className={`hero-aurora relative ${auroraReady ? "hero-aurora--ready" : ""}`}>
      <AuroraBackground onReady={() => setAuroraReady(true)} />

      <HeroNav theme={auroraReady ? "dark" : "light"} />

      <MarketingContent className="relative z-20 pt-8 sm:pt-10">
        <h1
          className={`text-left font-display text-2xl font-semibold tracking-[-0.02em] sm:text-[1.65rem] ${
            auroraReady ? "text-white" : "text-foreground"
          }`}
        >
          {EXPLORER_HERO.title}
        </h1>

        <div className="mt-4 max-w-2xl">
          <HeroSearchBlock />
        </div>
      </MarketingContent>
    </section>
  );
}
