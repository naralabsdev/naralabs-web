"use client";

import type { ReactNode } from "react";

import { ContractEventsPanel } from "@/modules/contracts/components/contract-events-panel";
import { ContractOverviewSummary } from "@/modules/contracts/components/contract-overview-summary";
import { TypeBreakdownTable } from "@/modules/contracts/components/type-breakdown-table";
import type { ContractDetailViewModel } from "@/modules/contracts/domain/contract-view-model";
import { DetailFieldList } from "@/modules/events/components/detail-field-row";

function ContractSectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-3 overflow-hidden rounded-xl bg-white">
      <div className="border-b border-neutral-100 px-5 py-3 sm:px-6">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">{children}</div>
    </section>
  );
}

export function ContractDetailContent({ contract }: { contract: ContractDetailViewModel }) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <ContractOverviewSummary contract={contract} />
      </div>

      <section className="mt-3 overflow-hidden rounded-xl bg-white">
        <DetailFieldList rows={contract.overviewRows} />
      </section>

      <ContractSectionCard title="Events by Type">
        <TypeBreakdownTable rows={contract.typeBreakdown} />
      </ContractSectionCard>

      <ContractSectionCard title="Events">
        <ContractEventsPanel
          contractId={contract.id}
          network={contract.network}
          eventTypes={contract.typeBreakdown}
        />
      </ContractSectionCard>
    </div>
  );
}
