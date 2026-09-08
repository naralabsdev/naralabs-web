import type { ContractRecentEventRow } from "@/modules/contracts/domain/contract-view-model";
import { RecentEventsTable } from "@/shared/ui/explorer-table";

export function ContractEventsTable({ rows }: { rows: ContractRecentEventRow[] }) {
  return (
    <div className="overflow-x-auto">
      <RecentEventsTable
        rows={rows}
        showStatus
        showContract={false}
        emptyMessage="No events match the current filters."
      />
    </div>
  );
}
