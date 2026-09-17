"use client";

import { ContractsListPanel } from "@/modules/contracts/components/contracts-list-panel";
import type { ContractsListViewModel } from "@/modules/contracts/domain/contracts-list-view-model";
import { ExplorerListPageLayout } from "@/modules/explore/components/explorer-list-page-layout";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";

export function ContractsListPage({
  contracts,
  network,
}: {
  contracts: ContractsListViewModel;
  network: string;
}) {
  return (
    <ExplorerPageShell auroraTheme="contracts">
      <ExplorerListPageLayout
        title="All Contracts"
        description="Explore Soroban contracts ranked by recent indexed event activity."
      >
        <ContractsListPanel network={network} initialData={contracts} />
      </ExplorerListPageLayout>
    </ExplorerPageShell>
  );
}
