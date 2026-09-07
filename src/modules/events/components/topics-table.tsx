"use client";

import type { TopicTableRow } from "@/modules/events/domain/event-view-model";
import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
} from "@/modules/landing/components/activity/borderless-table";
import { CopyFeedbackButton } from "@/shared/ui/copy-feedback-button";

export function TopicsTable({ rows }: { rows: TopicTableRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="px-8 py-10 text-center text-sm text-neutral-500">
        No topics available for this event.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-4 py-3 sm:px-5 sm:py-4">
      <BorderlessTable className="min-w-[32rem]">
        <BorderlessTableHead>
          <BorderlessHeaderRow>
            <BorderlessHeaderCell>#</BorderlessHeaderCell>
            <BorderlessHeaderCell>Type</BorderlessHeaderCell>
            <BorderlessHeaderCell>Decoded Value</BorderlessHeaderCell>
            <BorderlessHeaderCell>Raw</BorderlessHeaderCell>
          </BorderlessHeaderRow>
        </BorderlessTableHead>
        <BorderlessTableBody>
          {rows.map((row) => (
            <BorderlessRow key={row.index}>
              <BorderlessCell className="w-12 tabular-nums text-neutral-500">
                {row.index}
              </BorderlessCell>
              <BorderlessCell>
                <span className="inline-flex rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-700">
                  {row.type}
                </span>
              </BorderlessCell>
              <BorderlessCell className="font-medium text-neutral-900">
                {row.value}
              </BorderlessCell>
              <BorderlessCell className="max-w-[18rem] font-mono text-xs text-neutral-500">
                <span className="inline-flex max-w-full items-center gap-2">
                  <span className="truncate">{row.raw}</span>
                  <CopyFeedbackButton
                    value={row.raw}
                    label="Copy raw value"
                    successMessage="Copied raw value"
                  />
                </span>
              </BorderlessCell>
            </BorderlessRow>
          ))}
        </BorderlessTableBody>
      </BorderlessTable>
    </div>
  );
}
