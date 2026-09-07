import type { EventTypeBreakdownRow } from "@/modules/contracts/domain/contract-view-model";
import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
} from "@/modules/landing/components/activity/borderless-table";

export function TypeBreakdownTable({ rows }: { rows: EventTypeBreakdownRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="py-6 text-sm text-neutral-500">
        No event types indexed for this contract yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <BorderlessTable className="min-w-[24rem]">
        <BorderlessTableHead>
          <BorderlessHeaderRow>
            <BorderlessHeaderCell withInfo>Event Type</BorderlessHeaderCell>
            <BorderlessHeaderCell withInfo>Count</BorderlessHeaderCell>
            <BorderlessHeaderCell withInfo>Share</BorderlessHeaderCell>
          </BorderlessHeaderRow>
        </BorderlessTableHead>
        <BorderlessTableBody>
          {rows.map((row) => (
            <BorderlessRow key={row.eventType}>
              <BorderlessCell className="font-medium text-neutral-900">{row.eventType}</BorderlessCell>
              <BorderlessCell className="tabular-nums text-neutral-900">
                {row.count.toLocaleString()}
              </BorderlessCell>
              <BorderlessCell className="tabular-nums text-neutral-600">{row.shareLabel}</BorderlessCell>
            </BorderlessRow>
          ))}
        </BorderlessTableBody>
      </BorderlessTable>
    </div>
  );
}
