import type { EventSchemaPublicPayload } from "@/modules/registry/domain/atlas-types";
import {
  parseSchemaBody,
  stringifySchemaBody,
} from "@/modules/registry/domain/parse-schema-body";
import type {
  EventSchemaDetailViewModel,
  SchemaParamRow,
} from "@/modules/registry/domain/schema-view-model";
import type { DetailFieldRow } from "@/modules/events/domain/event-view-model";
import { truncateMiddle } from "@/shared/ui/explorer-table/borderless-table";

function mapTrustLabel(tier: string): string {
  return tier === "verified" ? "Verified" : "Community";
}

function trustBadge(tier: string): DetailFieldRow["badge"] {
  if (tier === "verified") {
    return { text: "Verified", tone: "success" };
  }
  return { text: "Community", tone: "neutral" };
}

function mapParams(raw: ReturnType<typeof parseSchemaBody>): SchemaParamRow[] {
  return (raw.params ?? []).map((param) => ({
    name: param.name ?? "—",
    type: param.type ?? "—",
    location: param.location ?? "—",
    doc: param.doc,
  }));
}

function buildOverviewRows(
  payload: EventSchemaPublicPayload,
  body: ReturnType<typeof parseSchemaBody>,
): DetailFieldRow[] {
  const schemaName = body.name?.trim() || payload.eventName;
  const rows: DetailFieldRow[] = [
    {
      label: "Schema name",
      value: schemaName,
    },
    {
      label: "Event name",
      value: payload.eventName,
      mono: true,
    },
    {
      label: "Contract ID",
      value: payload.contractId,
      copyValue: payload.contractId,
      mono: true,
      href: `/contracts/${payload.contractId}`,
    },
    {
      label: "Version",
      value: `v${payload.version}`,
    },
    {
      label: "Trust tier",
      value: mapTrustLabel(payload.trustTier),
      badge: trustBadge(payload.trustTier),
    },
    {
      label: "Publication",
      value: payload.status,
    },
  ];

  if (body.data_format) {
    rows.push({ label: "Data format", value: body.data_format, mono: true });
  }

  if (payload.author) {
    rows.push({ label: "Author", value: payload.author });
  }

  if (payload.verifiedWallet) {
    rows.push({
      label: "Verified wallet",
      value: payload.verifiedWallet,
      copyValue: payload.verifiedWallet,
      mono: true,
    });
  }

  if (payload.verifiedAt) {
    rows.push({
      label: "Verified at",
      value: new Date(payload.verifiedAt).toLocaleString(),
      timestampIso: payload.verifiedAt,
    });
  }

  rows.push(
    {
      label: "Published",
      value: new Date(payload.createdAt).toLocaleString(),
      timestampIso: payload.createdAt,
    },
    {
      label: "Last updated",
      value: new Date(payload.updatedAt).toLocaleString(),
      timestampIso: payload.updatedAt,
    },
    {
      label: "Schema ID",
      value: payload.id,
      copyValue: payload.id,
      mono: true,
    },
  );

  return rows;
}

export function mapEventSchemaDetail(
  payload: EventSchemaPublicPayload,
): EventSchemaDetailViewModel {
  const body = parseSchemaBody(payload.schemaBody);
  const schemaName = body.name?.trim() || payload.eventName;
  const prefixTopics = body.prefix_topics ?? [];
  const params = mapParams(body);

  return {
    id: payload.id,
    contractId: payload.contractId,
    contractLabel: truncateMiddle(payload.contractId, 8, 6),
    network: payload.network,
    eventName: payload.eventName,
    schemaName,
    version: payload.version,
    trustTier: payload.trustTier,
    trustLabel: mapTrustLabel(payload.trustTier),
    author: payload.author,
    status: payload.status,
    verifiedWallet: payload.verifiedWallet,
    verifiedAt: payload.verifiedAt,
    verifiedLabel: payload.verifiedAt
      ? new Date(payload.verifiedAt).toLocaleString()
      : undefined,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    createdLabel: new Date(payload.createdAt).toLocaleDateString(),
    updatedLabel: new Date(payload.updatedAt).toLocaleDateString(),
    summary: body.doc?.trim() || `SEP-0048 schema for ${schemaName}`,
    overviewRows: buildOverviewRows(payload, body),
    prefixTopics,
    dataFormat: body.data_format,
    doc: body.doc,
    params,
    schemaBodyJson: stringifySchemaBody(payload.schemaBody),
  };
}
