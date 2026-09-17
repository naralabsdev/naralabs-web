"use client";

import type { HomePageViewModel } from "@/modules/landing/domain/home-view-model";
import { ActivitySection } from "@/modules/landing/components/activity/activity-section";
import { HeroSection } from "@/modules/landing/components/hero/hero-section";
import { NetworkStatsSection } from "@/modules/landing/components/network/network-stats-section";
import { useHomeWebSocket } from "@/modules/landing/hooks/use-home-websocket";

export function LiveHomeDashboard({
  initialData,
}: {
  initialData: HomePageViewModel;
}) {
  const { data } = useHomeWebSocket(initialData);

  return (
    <>
      <div className="relative overflow-visible">
        <HeroSection
          recentEvents={data.recentEvents}
          activeContracts={data.activeContracts}
        />
        <NetworkStatsSection overview={data.networkOverview} />
      </div>
      <ActivitySection
        recentEvents={data.recentEvents}
        activeContracts={data.activeContracts}
        animated
      />
    </>
  );
}
