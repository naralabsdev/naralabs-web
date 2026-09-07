"use client";

import type { ValueFieldRow } from "@/modules/events/domain/event-view-model";
import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { getEventFieldTip } from "@/modules/events/constants/field-tips";

export function ValueFields({ rows }: { rows: ValueFieldRow[] }) {
  const detailRows = rows.map((row) => ({
    label: row.label,
    value: row.display,
    secondary: row.hint ?? (row.type ? `Type: ${row.type}` : undefined),
    mono: row.type === "address" || row.type === "i128" || row.type === "i64",
    tip:
      getEventFieldTip(row.label) ??
      (row.hint
        ? row.hint
        : row.type
          ? `Decoded Soroban value with type \`${row.type}\`.`
          : undefined),
  }));

  return <DetailFieldList rows={detailRows} />;
}
