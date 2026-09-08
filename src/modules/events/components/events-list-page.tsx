"use client";

import { EventsListPanel } from "@/modules/events/components/events-list-panel";
import type { EventsListViewModel } from "@/modules/events/domain/events-list-view-model";
import { ExplorerListSummary } from "@/modules/explore/components/explorer-list-summary";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import type { NetworkStatsSummary } from "@/modules/explore/domain/map-network-stats";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";

export function EventsListPage({
  stats,
  events,
  network,
}: {
  stats: NetworkStatsSummary;
  events: EventsListViewModel;
  network: string;
}) {
  return (
    <ExplorerPageShell>
      <div>
        <ExplorerListSummary
          title="All Events"
          description="Browse Soroban contract events indexed and decoded by NaraLabs."
          stats={stats}
        />

        <DetailSectionCard
          title="Events"
          description="Recently ingested events across all tracked contracts."
          flushContent
        >
          <EventsListPanel network={network} initialData={events} />
        </DetailSectionCard>
      </div>
    </ExplorerPageShell>
  );
}
