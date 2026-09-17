import Link from "next/link";

import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import { LANDING_TABLE_TOOLTIPS } from "@/modules/landing/constants/homepage-content";
import { SchemaTrustBadge } from "@/modules/registry/components/schema-trust-badge";
import type { SchemaContractListRow } from "@/modules/registry/domain/schema-view-model";
import { cn } from "@/shared/lib/cn";
import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
  truncateMiddle,
} from "@/shared/ui/explorer-table";

export function SchemaContractsTable({
  rows,
  emptyMessage = "No published schema contracts found.",
  className,
}: {
  rows: SchemaContractListRow[];
  emptyMessage?: string;
  className?: string;
}) {
  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <BorderlessTable className={cn("min-w-[40rem]", className)}>
      <BorderlessTableHead>
        <BorderlessHeaderRow>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.schemas.contract}>
            Contract
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.schemas.schemas}>
            Schemas
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.schemas.events}>
            Events
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.schemas.status}>
            Status
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.schemas.updated}>
            Updated
          </BorderlessHeaderCell>
        </BorderlessHeaderRow>
      </BorderlessTableHead>
      <BorderlessTableBody>
        {rows.map((row) => (
          <BorderlessRow key={row.contractId}>
            <BorderlessCell>
              <Link href={`/contracts/${row.contractId}`} className="group block">
                <div className="flex items-center gap-2.5">
                  <DicebearAvatar seed={row.contractId} style="triangles" />
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900 group-hover:text-primary">
                      {row.contractLabel}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-neutral-500">
                      {truncateMiddle(row.contractId, 6, 4)}
                    </p>
                  </div>
                </div>
              </Link>
            </BorderlessCell>
            <BorderlessCell className="font-medium tabular-nums text-neutral-900">
              {row.schemaCount}
            </BorderlessCell>
            <BorderlessCell className="tabular-nums text-neutral-900">{row.eventCount}</BorderlessCell>
            <BorderlessCell>
              <SchemaTrustBadge verified={row.isVerified} />
            </BorderlessCell>
            <BorderlessCell className="whitespace-nowrap text-neutral-600">{row.updatedLabel}</BorderlessCell>
          </BorderlessRow>
        ))}
      </BorderlessTableBody>
    </BorderlessTable>
  );
}
