"use client";

import { ContractsListPanel } from "@/modules/contracts/components/contracts-list-panel";
import type { ContractsListViewModel } from "@/modules/contracts/domain/contracts-list-view-model";
import { ExplorerPageHeader } from "@/modules/explore/components/explorer-page-header";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import { ExplorerStatGrid } from "@/modules/explore/components/explorer-stat-grid";
import { ExplorerTableCard } from "@/modules/explore/components/explorer-table-card";
import type { NetworkStatsSummary } from "@/modules/explore/domain/map-network-stats";

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
      <ExplorerPageHeader
        title="All Contracts"
        description="Explore Soroban contracts ranked by recent indexed event activity."
      />
      <ExplorerStatGrid stats={stats} />
      <ExplorerTableCard>
        <ContractsListPanel network={network} initialData={contracts} />
      </ExplorerTableCard>
    </ExplorerPageShell>
  );
}
