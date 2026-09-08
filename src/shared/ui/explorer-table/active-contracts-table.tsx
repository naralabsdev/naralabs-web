import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import { LANDING_TABLE_TOOLTIPS } from "@/modules/landing/constants/homepage-content";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";

import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
  truncateMiddle,
} from "./borderless-table";

export type ExplorerContractRow = {
  id: string;
  name: string;
  eventCount: number;
  schemaLabel: string;
  lastActivity: string;
  ledgerRange: string;
};

export function ActiveContractsTable({
  rows,
  emptyMessage = "No contracts found.",
  className,
}: {
  rows: ExplorerContractRow[];
  emptyMessage?: string;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">{emptyMessage}</p>
    );
  }

  return (
    <BorderlessTable className={cn("min-w-[32rem]", className)}>
      <BorderlessTableHead>
        <BorderlessHeaderRow>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.contract}>
            Contract
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.events}>
            Events
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.schema}>
            Schema
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.lastActivity}>
            Last Activity
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.ledgers}>
            Ledgers
          </BorderlessHeaderCell>
        </BorderlessHeaderRow>
      </BorderlessTableHead>
      <BorderlessTableBody>
        {rows.map((contract) => (
          <BorderlessRow key={contract.id}>
            <BorderlessCell>
              <Link href={`/contracts/${contract.id}`} className="group block">
                <div className="flex items-center gap-2.5">
                  <DicebearAvatar seed={contract.id} style="triangles" />
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900 group-hover:text-primary">
                      {contract.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-neutral-500">
                      {truncateMiddle(contract.id, 6, 4)}
                    </p>
                  </div>
                </div>
              </Link>
            </BorderlessCell>
            <BorderlessCell className="font-medium tabular-nums text-neutral-900">
              {contract.eventCount.toLocaleString()}
            </BorderlessCell>
            <BorderlessCell className="text-neutral-600">{contract.schemaLabel}</BorderlessCell>
            <BorderlessCell className="whitespace-nowrap text-neutral-600">
              {contract.lastActivity}
            </BorderlessCell>
            <BorderlessCell className="whitespace-nowrap font-mono text-xs text-neutral-500">
              {contract.ledgerRange}
            </BorderlessCell>
          </BorderlessRow>
        ))}
      </BorderlessTableBody>
    </BorderlessTable>
  );
}
