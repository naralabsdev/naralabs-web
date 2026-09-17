"use client";

import Link from "next/link";

import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { SchemaTrustBadge } from "@/modules/registry/components/schema-trust-badge";
import type { SchemaContractDetailViewModel } from "@/modules/registry/domain/schema-view-model";
import { ExplorerDetailPageLayout } from "@/modules/explore/components/explorer-detail-page-layout";
import { EXPLORER_DETAIL_PAGE_COPY } from "@/modules/explore/constants/explorer-page-copy";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import { ButtonLink } from "@/modules/landing/components/hero/button-link";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";
import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
} from "@/shared/ui/explorer-table/borderless-table";

function SchemaContractSummary({ contract }: { contract: SchemaContractDetailViewModel }) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Contract</p>
        <h2 className="mt-1 break-all font-mono text-sm font-semibold text-neutral-900">
          {contract.contractId}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {contract.bundles.length > 0
            ? `${contract.bundles.length} schema${contract.bundles.length === 1 ? "" : "s"}`
            : "No published schemas yet"}
          {contract.verifiedLabel ? ` · verified ${contract.verifiedLabel}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ButtonLink
          href={`/contracts/${contract.contractId}`}
          className="h-9 px-4 text-sm"
        >
          View in explorer
        </ButtonLink>
      </div>
    </div>
  );
}

export function SchemaContractDetailPage({
  contract,
}: {
  contract: SchemaContractDetailViewModel;
}) {
  return (
    <ExplorerPageShell auroraTheme="schemas">
      <ExplorerDetailPageLayout
        title={EXPLORER_DETAIL_PAGE_COPY.schemaContract.title}
        description={EXPLORER_DETAIL_PAGE_COPY.schemaContract.description}
        backLink={{ label: "Back to schemas", href: "/schemas" }}
      >
        <DetailSummaryCard>
          <SchemaContractSummary contract={contract} />
        </DetailSummaryCard>

        <DetailSectionCard flushContent>
          <DetailFieldList rows={contract.overviewRows} />
        </DetailSectionCard>

        <DetailSectionCard title="Indexed activity">
          {contract.activity ? (
            <DetailFieldList
              rows={[
                { label: "Total events", value: contract.activity.eventCount.toLocaleString() },
                {
                  label: "Transactions",
                  value: contract.activity.transactionCount.toLocaleString(),
                },
                {
                  label: "Decoded events",
                  value: contract.activity.decodedCount.toLocaleString(),
                },
                { label: "Events (24h)", value: contract.activity.events24h.toLocaleString() },
                {
                  label: "Ledger range",
                  value: `${contract.activity.firstLedger.toLocaleString()} – ${contract.activity.lastLedger.toLocaleString()}`,
                },
                { label: "Last seen", value: contract.activity.lastSeenLabel },
                { label: "Schema status", value: contract.activity.schemaStatusLabel },
              ]}
            />
          ) : (
            <p className="px-5 py-8 text-sm text-neutral-500 sm:px-6">
              No indexed activity yet for this contract. Published schemas can still be browsed
              below.
            </p>
          )}
        </DetailSectionCard>

        <DetailSectionCard title="Published schemas" flushContent>
          {contract.bundles.length === 0 ? (
            <p className="px-5 py-8 text-sm text-neutral-500 sm:px-6">
              No published schemas for this contract yet.
            </p>
          ) : (
            <div className="overflow-x-auto px-5 pb-2 sm:px-6">
              <BorderlessTable>
                <BorderlessTableHead>
                  <BorderlessHeaderRow>
                    <BorderlessHeaderCell>Schema</BorderlessHeaderCell>
                    <BorderlessHeaderCell>Status</BorderlessHeaderCell>
                    <BorderlessHeaderCell>Events</BorderlessHeaderCell>
                    <BorderlessHeaderCell>Author</BorderlessHeaderCell>
                    <BorderlessHeaderCell>Updated</BorderlessHeaderCell>
                  </BorderlessHeaderRow>
                </BorderlessTableHead>
                <BorderlessTableBody>
                  {contract.bundles.map((bundle) => (
                    <BorderlessRow key={bundle.version}>
                      <BorderlessCell>
                        <Link
                          href={bundle.href}
                          className="font-medium text-neutral-900 hover:text-primary hover:underline"
                        >
                          {bundle.label}
                        </Link>
                      </BorderlessCell>
                      <BorderlessCell>
                        <SchemaTrustBadge verified={bundle.trustTier === "verified"} />
                      </BorderlessCell>
                      <BorderlessCell>{bundle.eventCount}</BorderlessCell>
                      <BorderlessCell className="text-neutral-600">
                        {bundle.author ?? "—"}
                      </BorderlessCell>
                      <BorderlessCell className="text-neutral-500">
                        {bundle.updatedLabel}
                      </BorderlessCell>
                    </BorderlessRow>
                  ))}
                </BorderlessTableBody>
              </BorderlessTable>
            </div>
          )}
        </DetailSectionCard>
      </ExplorerDetailPageLayout>
    </ExplorerPageShell>
  );
}
