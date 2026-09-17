import type { SchemaBundleDetailPayload } from "@/modules/registry/domain/atlas-types";
import {
  parseSchemaBody,
  stringifySchemaBody,
} from "@/modules/registry/domain/parse-schema-body";
import type {
  SchemaBundleDetailViewModel,
  SchemaBundleEventRow,
} from "@/modules/registry/domain/schema-view-model";
import type { DetailFieldRow } from "@/modules/events/domain/event-view-model";
import { truncateMiddle } from "@/shared/ui/explorer-table/borderless-table";

function trustBadge(tier: string): DetailFieldRow["badge"] {
  if (tier === "verified") {
    return { text: "Verified", tone: "success" };
  }
  return { text: "Not verified", tone: "neutral" };
}

function mapEventRow(event: SchemaBundleDetailPayload["events"][number]): SchemaBundleEventRow {
  const body = parseSchemaBody(event.schemaBody);

  return {
    id: event.id,
    eventName: event.eventName,
    version: event.version,
    trustTier: event.trustTier,
    trustLabel: event.trustTier === "verified" ? "Verified" : "Not verified",
    prefixTopics: body.prefix_topics ?? [],
    paramCount: body.params?.length ?? 0,
    doc: body.doc,
    schemaBodyJson: stringifySchemaBody(event.schemaBody),
  };
}

function buildOverviewRows(payload: SchemaBundleDetailPayload): DetailFieldRow[] {
  const rows: DetailFieldRow[] = [
    {
      label: "Contract ID",
      value: payload.contractId,
      copyValue: payload.contractId,
      mono: true,
      href: `/schemas/${payload.contractId}`,
    },
    {
      label: "Schema version",
      value: `v${payload.version}`,
    },
    {
      label: "Status",
      value: payload.trustTier === "verified" ? "Verified" : "Not verified",
      badge: trustBadge(payload.trustTier),
    },
    {
      label: "Events",
      value: String(payload.events.length),
    },
  ];

  if (payload.author) {
    rows.push({ label: "Author", value: payload.author });
  }

  rows.push(
    {
      label: "Created",
      value: new Date(payload.createdAt).toLocaleString(),
      timestampIso: payload.createdAt,
    },
    {
      label: "Updated",
      value: new Date(payload.updatedAt).toLocaleString(),
      timestampIso: payload.updatedAt,
    },
  );

  if (payload.verifiedAt) {
    rows.push({
      label: "Verified at",
      value: new Date(payload.verifiedAt).toLocaleString(),
      timestampIso: payload.verifiedAt,
    });
  }

  return rows;
}

export function mapSchemaBundleDetail(
  payload: SchemaBundleDetailPayload,
): SchemaBundleDetailViewModel {
  return {
    contractId: payload.contractId,
    contractLabel: truncateMiddle(payload.contractId, 8, 6),
    network: payload.network,
    version: payload.version,
    label: `Schema v${payload.version}`,
    trustTier: payload.trustTier,
    trustLabel: payload.trustTier === "verified" ? "Verified" : "Not verified",
    author: payload.author,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    createdLabel: new Date(payload.createdAt).toLocaleDateString(),
    updatedLabel: new Date(payload.updatedAt).toLocaleDateString(),
    verifiedAt: payload.verifiedAt,
    verifiedLabel: payload.verifiedAt
      ? new Date(payload.verifiedAt).toLocaleDateString()
      : undefined,
    overviewRows: buildOverviewRows(payload),
    events: payload.events.map(mapEventRow),
  };
}
