"use client";

import { EventsListPanel } from "@/modules/events/components/events-list-panel";
import type { EventsListViewModel } from "@/modules/events/domain/events-list-view-model";
import { ExplorerPageHeader } from "@/modules/explore/components/explorer-page-header";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import { ExplorerStatGrid } from "@/modules/explore/components/explorer-stat-grid";
import { ExplorerTableCard } from "@/modules/explore/components/explorer-table-card";
import type { NetworkStatsSummary } from "@/modules/explore/domain/map-network-stats";

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
      <ExplorerPageHeader
        title="All Events"
        description="Browse Soroban contract events indexed and decoded by NaraLabs."
      />
      <ExplorerStatGrid stats={stats} />
      <ExplorerTableCard>
        <EventsListPanel network={network} initialData={events} />
      </ExplorerTableCard>
    </ExplorerPageShell>
  );
}
