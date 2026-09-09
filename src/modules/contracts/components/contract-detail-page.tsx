"use client";

import { ContractEventsPanel } from "@/modules/contracts/components/contract-events-panel";
import { ContractOverviewSummary } from "@/modules/contracts/components/contract-overview-summary";
import { TypeBreakdownTable } from "@/modules/contracts/components/type-breakdown-table";
import type { ContractDetailViewModel } from "@/modules/contracts/domain/contract-view-model";
import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";

export function ContractDetailPage({ contract }: { contract: ContractDetailViewModel }) {
  return (
    <ExplorerPageShell>
      <div>
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
          />
        </DetailSectionCard>
      </div>
    </ExplorerPageShell>
  );
}
