"use client";

import { ContractsListPanel } from "@/modules/contracts/components/contracts-list-panel";
import type { ContractsListViewModel } from "@/modules/contracts/domain/contracts-list-view-model";
import { ExplorerListSummary } from "@/modules/explore/components/explorer-list-summary";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import type { NetworkStatsSummary } from "@/modules/explore/domain/map-network-stats";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";

export function ContractsListPage({
  stats,
  contracts,
  network,
}: {
  stats: NetworkStatsSummary;
  contracts: ContractsListViewModel;
  network: string;
}) {
  return (
    <ExplorerPageShell>
      <div>
        <ExplorerListSummary
          title="All Contracts"
          description="Explore Soroban contracts ranked by recent indexed event activity."
          stats={stats}
        />

        <DetailSectionCard
          title="Contracts"
          description="Active contracts with indexed events on the network."
          flushContent
        >
          <ContractsListPanel network={network} initialData={contracts} />
        </DetailSectionCard>
      </div>
    </ExplorerPageShell>
  );
}
