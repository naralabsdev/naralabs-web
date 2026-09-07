"use client";

import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import type { ContractDetailViewModel } from "@/modules/contracts/domain/contract-view-model";
import { cn } from "@/shared/lib/cn";

export function ContractOverviewSummary({ contract }: { contract: ContractDetailViewModel }) {
  const schemaClass =
    contract.schemaStatus === "partial"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-neutral-100 text-neutral-600 ring-neutral-200";

  return (
    <div className="flex items-center gap-2.5 px-5 py-3 sm:px-6">
      <DicebearAvatar seed={contract.id} style="triangles" className="size-7 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h1 className="text-sm font-semibold text-neutral-900">{contract.displayName}</h1>
          <span
            className={cn(
              "inline-flex rounded-full px-1.5 py-px text-[10px] font-medium ring-1 ring-inset",
              schemaClass,
            )}
          >
            {contract.schemaLabel}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 font-mono text-xs text-neutral-600">{contract.id}</p>
        <p className="mt-0.5 text-[11px] text-neutral-500">{contract.activitySummary}</p>
      </div>
    </div>
  );
}
