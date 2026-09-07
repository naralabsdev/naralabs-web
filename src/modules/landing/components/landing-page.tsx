import { cn } from "@/shared/lib/cn";

import { ActivitySection } from "./activity/activity-section";
import { MarketingChrome } from "./chrome/marketing-chrome";
import { HeroSection } from "./hero/hero-section";
import { NetworkStatsSection } from "./network/network-stats-section";
import type { HomePageViewModel } from "../domain/home-view-model";
import { inter, satoshi } from "../fonts";
import "../styles/marketing.css";

export function LandingPage({ data }: { data: HomePageViewModel }) {
  return (
    <div
      className={cn(
        satoshi.variable,
        inter.variable,
        "marketing-theme font-default flex min-h-screen flex-col overflow-x-hidden bg-[var(--surface)]",
      )}
    >
      <MarketingChrome>
        <main>
          <div className="relative overflow-visible">
            <HeroSection />
            <NetworkStatsSection overview={data.networkOverview} />
          </div>
          <ActivitySection
            recentEvents={data.recentEvents}
            activeContracts={data.activeContracts}
          />
        </main>
      </MarketingChrome>
    </div>
  );
}
