"use client";

import Link from "next/link";

import { SchemaTrustBadge } from "@/modules/registry/components/schema-trust-badge";
import type { SchemaVersionHistoryViewModel } from "@/modules/registry/domain/schema-view-model";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
} from "@/shared/ui/explorer-table/borderless-table";
import { cn } from "@/shared/lib/cn";

export function SchemaVersionHistorySection({
  versions,
}: {
  versions: SchemaVersionHistoryViewModel;
}) {
  return (
    <DetailSectionCard
      title="Version history"
      description="All published versions of this event schema, including trust tier changes."
      flushContent
    >
      {versions.items.length === 0 ? (
        <p className="px-5 py-8 text-sm text-neutral-500 sm:px-6">
          No other published versions found.
        </p>
      ) : (
        <div className="overflow-x-auto px-5 pb-2 sm:px-6">
          <BorderlessTable>
            <BorderlessTableHead>
              <BorderlessHeaderRow>
                <BorderlessHeaderCell>Version</BorderlessHeaderCell>
                <BorderlessHeaderCell>Status</BorderlessHeaderCell>
                <BorderlessHeaderCell>Author</BorderlessHeaderCell>
                <BorderlessHeaderCell>Published</BorderlessHeaderCell>
                <BorderlessHeaderCell>Updated</BorderlessHeaderCell>
                <BorderlessHeaderCell>Schema ID</BorderlessHeaderCell>
              </BorderlessHeaderRow>
            </BorderlessTableHead>
            <BorderlessTableBody>
              {versions.items.map((row) => (
                <BorderlessRow
                  key={row.id}
                  className={cn(row.isCurrent && "bg-primary/5")}
                >
                  <BorderlessCell className="font-medium tabular-nums">
                    v{row.version}
                    {row.isCurrent ? (
                      <span className="ml-2 text-xs font-normal text-primary">Current</span>
                    ) : null}
                  </BorderlessCell>
                  <BorderlessCell>
                    <SchemaTrustBadge verified={row.isVerified} />
                  </BorderlessCell>
                  <BorderlessCell className="text-neutral-600">
                    {row.author ?? "—"}
                  </BorderlessCell>
                  <BorderlessCell className="whitespace-nowrap text-neutral-600">
                    {row.createdLabel}
                  </BorderlessCell>
                  <BorderlessCell className="whitespace-nowrap text-neutral-600">
                    {row.updatedLabel}
                  </BorderlessCell>
                  <BorderlessCell>
                    {row.isCurrent ? (
                      <span className="font-mono text-xs text-neutral-500">
                        {row.id.slice(0, 8)}…
                      </span>
                    ) : (
                      <Link
                        href={row.href}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {row.id.slice(0, 8)}…
                      </Link>
                    )}
                  </BorderlessCell>
                </BorderlessRow>
              ))}
            </BorderlessTableBody>
          </BorderlessTable>
        </div>
      )}
    </DetailSectionCard>
  );
}
