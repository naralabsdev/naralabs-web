"use client";

import { Suspense } from "react";

import { EventsListPanel } from "@/modules/events/components/events-list-panel";
import type { EventsListViewModel } from "@/modules/events/domain/events-list-view-model";
import { ExplorerListPageLayout } from "@/modules/explore/components/explorer-list-page-layout";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";

export function EventsListPage({
  events,
  network,
}: {
  events: EventsListViewModel;
  network: string;
}) {
  return (
    <ExplorerPageShell auroraTheme="events">
      <ExplorerListPageLayout
        title="All Events"
        description="Browse Soroban contract events indexed and decoded by NaraLabs."
      >
        <Suspense fallback={null}>
          <EventsListPanel network={network} initialData={events} />
        </Suspense>
      </ExplorerListPageLayout>
    </ExplorerPageShell>
  );
}
