"use client";

import Link from "next/link";

import { SchemaTrustBadge } from "@/modules/registry/components/schema-trust-badge";
import type { ContractSchemaRow } from "@/modules/registry/domain/schema-view-model";
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

export function ContractPublishedSchemasSection({
  schemas,
}: {
  schemas: ContractSchemaRow[];
}) {
  return (
    <DetailSectionCard title="Published schemas" flushContent>
      {schemas.length === 0 ? (
        <p className="px-5 py-8 text-sm text-neutral-500 sm:px-6">
          No published schemas for this contract yet.
        </p>
      ) : (
        <div className="overflow-x-auto px-5 pb-2 sm:px-6">
          <BorderlessTable>
            <BorderlessTableHead>
              <BorderlessHeaderRow>
                <BorderlessHeaderCell>Event</BorderlessHeaderCell>
                <BorderlessHeaderCell>Version</BorderlessHeaderCell>
                <BorderlessHeaderCell>Status</BorderlessHeaderCell>
                <BorderlessHeaderCell>Author</BorderlessHeaderCell>
                <BorderlessHeaderCell>Updated</BorderlessHeaderCell>
              </BorderlessHeaderRow>
            </BorderlessTableHead>
            <BorderlessTableBody>
              {schemas.map((schema) => (
                <BorderlessRow key={schema.id}>
                  <BorderlessCell>
                    <Link
                      href={schema.href}
                      className="font-medium text-neutral-900 hover:text-primary hover:underline"
                    >
                      {schema.schemaName}
                    </Link>
                  </BorderlessCell>
                  <BorderlessCell>v{schema.version}</BorderlessCell>
                  <BorderlessCell>
                    <SchemaTrustBadge verified={schema.isVerified} />
                  </BorderlessCell>
                  <BorderlessCell className="text-neutral-600">
                    {schema.author ?? "—"}
                  </BorderlessCell>
                  <BorderlessCell className="text-neutral-500">{schema.updatedLabel}</BorderlessCell>
                </BorderlessRow>
              ))}
            </BorderlessTableBody>
          </BorderlessTable>
        </div>
      )}
    </DetailSectionCard>
  );
}
