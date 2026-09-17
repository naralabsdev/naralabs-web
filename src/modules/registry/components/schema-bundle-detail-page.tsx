"use client";

import { useState } from "react";

import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { HighlightedJson } from "@/modules/events/components/highlighted-json";
import { SchemaTrustBadge } from "@/modules/registry/components/schema-trust-badge";
import { parseSchemaBody } from "@/modules/registry/domain/parse-schema-body";
import type { SchemaBundleDetailViewModel } from "@/modules/registry/domain/schema-view-model";
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

type EventTab = "overview" | "json";

function SchemaBundleSummary({ schema }: { schema: SchemaBundleDetailViewModel }) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-neutral-900">{schema.label}</h2>
          <SchemaTrustBadge verified={schema.trustTier === "verified"} />
        </div>
        <p className="mt-1 font-mono text-xs text-neutral-600">{schema.contractId}</p>
        <p className="mt-1 text-sm text-neutral-500">
          {schema.events.length} event{schema.events.length === 1 ? "" : "s"}
        </p>
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

function SchemaBundleEventPanel({
  event,
}: {
  event: SchemaBundleDetailViewModel["events"][number];
}) {
  const [tab, setTab] = useState<EventTab>("overview");
  const body = parseSchemaBody(JSON.parse(event.schemaBodyJson) as unknown);

  return (
    <DetailSectionCard
      title={event.eventName}
      description={event.doc}
      action={<SchemaTrustBadge verified={event.trustTier === "verified"} />}
      flushContent={tab === "json"}
    >
      <div className="border-b border-neutral-100 px-5 sm:px-6">
        <TabSelect
          options={[
            { id: "overview", label: "Overview" },
            { id: "json", label: "Schema body" },
          ]}
          selected={tab}
          onSelect={setTab}
        />
      </div>

      {tab === "overview" ? (
        <div className="space-y-4 px-5 py-4 sm:px-6">
          {event.prefixTopics.length > 0 ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Prefix topics
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {event.prefixTopics.map((topic) => (
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

          {body.params && body.params.length > 0 ? (
            <div className="overflow-x-auto">
              <BorderlessTable>
                <BorderlessTableHead>
                  <BorderlessHeaderRow>
                    <BorderlessHeaderCell>Name</BorderlessHeaderCell>
                    <BorderlessHeaderCell>Type</BorderlessHeaderCell>
                    <BorderlessHeaderCell>Location</BorderlessHeaderCell>
                  </BorderlessHeaderRow>
                </BorderlessTableHead>
                <BorderlessTableBody>
                  {body.params.map((param) => (
                    <BorderlessRow key={`${param.name}-${param.location}`}>
                      <BorderlessCell className="font-medium">{param.name ?? "—"}</BorderlessCell>
                      <BorderlessCell className="font-mono text-xs">{param.type ?? "—"}</BorderlessCell>
                      <BorderlessCell className="font-mono text-xs">
                        {param.location ?? "—"}
                      </BorderlessCell>
                    </BorderlessRow>
                  ))}
                </BorderlessTableBody>
              </BorderlessTable>
            </div>
          ) : null}
        </div>
      ) : (
        <HighlightedJson code={event.schemaBodyJson} />
      )}
    </DetailSectionCard>
  );
}

export function SchemaBundleDetailPage({ schema }: { schema: SchemaBundleDetailViewModel }) {
  return (
    <ExplorerPageShell auroraTheme="schemas">
      <ExplorerDetailPageLayout
        title={EXPLORER_DETAIL_PAGE_COPY.schemaBundle.title}
        description={EXPLORER_DETAIL_PAGE_COPY.schemaBundle.description}
        backLink={{ label: "Back to contract", href: `/contracts/${schema.contractId}` }}
      >
        <DetailSummaryCard>
          <SchemaBundleSummary schema={schema} />
        </DetailSummaryCard>

        <DetailSectionCard flushContent>
          <DetailFieldList rows={schema.overviewRows} />
        </DetailSectionCard>

        {schema.events.map((event) => (
          <SchemaBundleEventPanel key={event.id} event={event} />
        ))}
      </ExplorerDetailPageLayout>
    </ExplorerPageShell>
  );
}
