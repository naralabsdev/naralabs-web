import type { ContractRecentEventRow } from "@/modules/contracts/domain/contract-view-model";
import { RecentEventsTable } from "@/shared/ui/explorer-table";

export function ContractEventsTable({
  rows,
  emptyMessage = "No events match the current filters.",
}: {
  rows: ContractRecentEventRow[];
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <RecentEventsTable
        rows={rows}
        showStatus
        showContract={false}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}
