"use client";

import { useState } from "react";

import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { HighlightedJson } from "@/modules/events/components/highlighted-json";
import { SchemaTrustBadge } from "@/modules/registry/components/schema-trust-badge";
import { SchemaVersionHistorySection } from "@/modules/registry/components/schema-version-history-section";
import type {
  EventSchemaDetailViewModel,
  SchemaVersionHistoryViewModel,
} from "@/modules/registry/domain/schema-view-model";
import { ExplorerDetailPageLayout } from "@/modules/explore/components/explorer-detail-page-layout";
import { EXPLORER_DETAIL_PAGE_COPY } from "@/modules/explore/constants/explorer-page-copy";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import { ButtonLink } from "@/modules/landing/components/hero/button-link";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";
import { TabSelect } from "@/shared/ui/tab-select";
import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
} from "@/shared/ui/explorer-table/borderless-table";

type DetailTab = "overview" | "json";

function SchemaEventSummary({ schema }: { schema: EventSchemaDetailViewModel }) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-neutral-900">{schema.schemaName}</h2>
          <SchemaTrustBadge verified={schema.trustTier === "verified"} />
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
            v{schema.version}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-neutral-500">{schema.eventName}</p>
        <p className="mt-1 text-sm text-neutral-600">{schema.summary}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ButtonLink
          href={`/contracts/${schema.contractId}`}
          className="h-9 px-4 text-sm"
        >
          View contract
        </ButtonLink>
      </div>
    </div>
  );
}

function SchemaDefinitionSection({ schema }: { schema: EventSchemaDetailViewModel }) {
  return (
    <DetailSectionCard
      title="Schema definition"
      description="SEP-0048 fields submitted by the publisher."
    >
      <div className="space-y-4">
        {schema.doc ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Description
            </p>
            <p className="mt-2 text-sm text-neutral-700">{schema.doc}</p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Event name
            </p>
            <p className="mt-1 font-mono text-sm text-neutral-900">{schema.eventName}</p>
          </div>
          {schema.dataFormat ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Data format
              </p>
              <p className="mt-1 font-mono text-sm text-neutral-900">{schema.dataFormat}</p>
            </div>
          ) : null}
          {schema.author ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Author
              </p>
              <p className="mt-1 text-sm text-neutral-900">{schema.author}</p>
            </div>
          ) : null}
          {schema.verifiedWallet ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Verified wallet
              </p>
              <p className="mt-1 break-all font-mono text-sm text-neutral-900">
                {schema.verifiedWallet}
              </p>
            </div>
          ) : null}
        </div>

        {schema.prefixTopics.length > 0 ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Prefix topics
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {schema.prefixTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </DetailSectionCard>
  );
}

function SchemaParameterMappings({ schema }: { schema: EventSchemaDetailViewModel }) {
  const hasDocs = schema.params.some((param) => param.doc?.trim());

  return (
    <DetailSectionCard
      title="Parameter mappings"
      description="How raw Soroban topics and values map to named fields."
      flushContent
    >
      {schema.params.length > 0 ? (
        <div className="overflow-x-auto px-5 pb-2 sm:px-6">
          <BorderlessTable>
            <BorderlessTableHead>
              <BorderlessHeaderRow>
                <BorderlessHeaderCell>Name</BorderlessHeaderCell>
                <BorderlessHeaderCell>Type</BorderlessHeaderCell>
                <BorderlessHeaderCell>Location</BorderlessHeaderCell>
                {hasDocs ? <BorderlessHeaderCell>Description</BorderlessHeaderCell> : null}
              </BorderlessHeaderRow>
            </BorderlessTableHead>
            <BorderlessTableBody>
              {schema.params.map((param) => (
                <BorderlessRow key={`${param.name}-${param.location}`}>
                  <BorderlessCell className="font-medium">{param.name}</BorderlessCell>
                  <BorderlessCell className="font-mono text-xs">{param.type}</BorderlessCell>
                  <BorderlessCell className="font-mono text-xs">{param.location}</BorderlessCell>
                  {hasDocs ? (
                    <BorderlessCell className="text-sm text-neutral-600">
                      {param.doc?.trim() || "—"}
                    </BorderlessCell>
                  ) : null}
                </BorderlessRow>
              ))}
            </BorderlessTableBody>
          </BorderlessTable>
        </div>
      ) : (
        <p className="px-5 py-8 text-sm text-neutral-500 sm:px-6">
          No parameter mappings defined in this schema.
        </p>
      )}
    </DetailSectionCard>
  );
}

export function SchemaEventDetailPage({
  schema,
  versions,
}: {
  schema: EventSchemaDetailViewModel;
  versions: SchemaVersionHistoryViewModel;
}) {
  const [tab, setTab] = useState<DetailTab>("overview");

  return (
    <ExplorerPageShell auroraTheme="schemas">
      <ExplorerDetailPageLayout
        title={EXPLORER_DETAIL_PAGE_COPY.schemaEvent.title}
        description={EXPLORER_DETAIL_PAGE_COPY.schemaEvent.description}
        backLink={{ label: "Back to schemas", href: "/schemas" }}
      >
        <DetailSummaryCard>
          <SchemaEventSummary schema={schema} />
        </DetailSummaryCard>

        <DetailSectionCard flushContent>
          <DetailFieldList rows={schema.overviewRows} />
        </DetailSectionCard>

        <SchemaDefinitionSection schema={schema} />
        <SchemaParameterMappings schema={schema} />
        <SchemaVersionHistorySection versions={versions} />

        <DetailSectionCard
          title="Published schema body"
          description="Full JSON submitted to the registry."
          flushContent={tab === "json"}
        >
          <div className="border-b border-neutral-100 px-5 sm:px-6">
            <TabSelect
              options={[
                { id: "overview", label: "Summary" },
                { id: "json", label: "Raw JSON" },
              ]}
              selected={tab}
              onSelect={setTab}
            />
          </div>

          {tab === "overview" ? (
            <div className="space-y-3 px-5 py-4 text-sm text-neutral-600 sm:px-6">
              <p>
                This is the exact SEP-0048 payload stored for{" "}
                <span className="font-medium text-neutral-900">{schema.schemaName}</span> at version{" "}
                <span className="font-medium text-neutral-900">v{schema.version}</span>.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{schema.params.length} parameter mapping{schema.params.length === 1 ? "" : "s"}</li>
                <li>
                  {schema.prefixTopics.length} prefix topic
                  {schema.prefixTopics.length === 1 ? "" : "s"}
                </li>
                <li>
                  Published {schema.createdLabel}
                  {schema.author ? ` by ${schema.author}` : ""}
                </li>
              </ul>
            </div>
          ) : (
            <HighlightedJson code={schema.schemaBodyJson} />
          )}
        </DetailSectionCard>
      </ExplorerDetailPageLayout>
    </ExplorerPageShell>
  );
}
