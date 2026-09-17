import { cn } from "@/shared/lib/cn";

import { MarketingChrome } from "./chrome/marketing-chrome";
import { LiveHomeDashboard } from "./live/live-home-dashboard";
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
          <LiveHomeDashboard initialData={data} />
        </main>
      </MarketingChrome>
    </div>
  );
}
