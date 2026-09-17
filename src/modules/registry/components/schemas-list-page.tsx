"use client";

import { SchemasListPanel } from "@/modules/registry/components/schemas-list-panel";
import type { SchemaContractsListViewModel } from "@/modules/registry/domain/schema-view-model";
import { ExplorerListPageLayout } from "@/modules/explore/components/explorer-list-page-layout";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";

export function SchemasListPage({
  contracts,
  network,
}: {
  contracts: SchemaContractsListViewModel;
  network: string;
}) {
  return (
    <ExplorerPageShell auroraTheme="schemas">
      <ExplorerListPageLayout
        title="Event Schemas"
        description="Browse Soroban contracts with published SEP-0048 event schemas in the registry."
      >
        <SchemasListPanel network={network} initialData={contracts} />
      </ExplorerListPageLayout>
    </ExplorerPageShell>
  );
}
