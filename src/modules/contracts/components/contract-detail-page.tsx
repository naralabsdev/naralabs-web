"use client";

import { ContractEventsPanel } from "@/modules/contracts/components/contract-events-panel";
import { ContractOverviewSummary } from "@/modules/contracts/components/contract-overview-summary";
import { ContractPublishedSchemasSection } from "@/modules/contracts/components/contract-published-schemas-section";
import { TypeBreakdownTable } from "@/modules/contracts/components/type-breakdown-table";
import type { ContractDetailViewModel } from "@/modules/contracts/domain/contract-view-model";
import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import type { ContractSchemaRow } from "@/modules/registry/domain/schema-view-model";
import { ExplorerDetailPageLayout } from "@/modules/explore/components/explorer-detail-page-layout";
import { EXPLORER_DETAIL_PAGE_COPY } from "@/modules/explore/constants/explorer-page-copy";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";

export function ContractDetailPage({
  contract,
  publishedSchemas,
}: {
  contract: ContractDetailViewModel;
  publishedSchemas: ContractSchemaRow[];
}) {
  return (
    <ExplorerPageShell auroraTheme="contracts">
      <ExplorerDetailPageLayout
        title={EXPLORER_DETAIL_PAGE_COPY.contract.title}
        description={EXPLORER_DETAIL_PAGE_COPY.contract.description}
      >
        <DetailSummaryCard>
          <ContractOverviewSummary contract={contract} />
        </DetailSummaryCard>

        <DetailSectionCard flushContent>
          <DetailFieldList rows={contract.overviewRows} />
        </DetailSectionCard>

        <DetailSectionCard title="Events by Type">
          <TypeBreakdownTable rows={contract.typeBreakdown} />
        </DetailSectionCard>

        <DetailSectionCard title="Events">
          <ContractEventsPanel
            contractId={contract.id}
            network={contract.network}
            eventTypes={contract.typeBreakdown}
            indexed={contract.indexed}
          />
        </DetailSectionCard>

        <ContractPublishedSchemasSection schemas={publishedSchemas} />
      </ExplorerDetailPageLayout>
    </ExplorerPageShell>
  );
}
