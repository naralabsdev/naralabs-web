import type { SchemaContractProfilePayload } from "@/modules/registry/domain/atlas-types";
import type {
  SchemaBundleRow,
  SchemaContractDetailViewModel,
} from "@/modules/registry/domain/schema-view-model";
import type { DetailFieldRow } from "@/modules/events/domain/event-view-model";
import { timeAgo } from "@/shared/lib/functions/time-ago";
import { truncateMiddle } from "@/shared/ui/explorer-table/borderless-table";

function mapTrustLabel(isVerified: boolean): string {
  return isVerified ? "Verified" : "Not verified";
}

function trustBadge(isVerified: boolean): DetailFieldRow["badge"] {
  return isVerified
    ? { text: "Verified", tone: "success" }
    : { text: "Not verified", tone: "neutral" };
}

function mapBundleRow(
  bundle: SchemaContractProfilePayload["bundles"][number],
  contractId: string,
): SchemaBundleRow {
  return {
    version: bundle.version,
    label: `Schema v${bundle.version}`,
    trustTier: bundle.trustTier,
    trustLabel: bundle.trustTier === "verified" ? "Verified" : "Not verified",
    eventCount: bundle.eventCount,
    author: bundle.author,
    updatedAt: bundle.updatedAt,
    updatedLabel: new Date(bundle.updatedAt).toLocaleDateString(),
    verifiedAt: bundle.verifiedAt,
    verifiedLabel: bundle.verifiedAt
      ? new Date(bundle.verifiedAt).toLocaleDateString()
      : undefined,
    href: `/schemas/${contractId}/v/${bundle.version}`,
  };
}

function buildOverviewRows(payload: SchemaContractProfilePayload): DetailFieldRow[] {
  const rows: DetailFieldRow[] = [
    {
      label: "Contract ID",
      value: payload.contractId,
      copyValue: payload.contractId,
      mono: true,
      href: `/contracts/${payload.contractId}`,
    },
    {
      label: "Status",
      value: mapTrustLabel(payload.isVerified),
      badge: trustBadge(payload.isVerified),
    },
    {
      label: "Indexed activity",
      value: payload.indexed ? "Available" : "Not indexed yet",
    },
    {
      label: "Published schemas",
      value: String(payload.bundles.length),
    },
  ];

  if (payload.verifiedAt) {
    rows.push({
      label: "Verified at",
      value: new Date(payload.verifiedAt).toLocaleString(),
      timestampIso: payload.verifiedAt,
    });
  }

  return rows;
}

export function mapSchemaContractDetail(
  payload: SchemaContractProfilePayload,
): SchemaContractDetailViewModel {
  return {
    contractId: payload.contractId,
    contractLabel: truncateMiddle(payload.contractId, 8, 6),
    network: payload.network,
    indexed: payload.indexed,
    isVerified: payload.isVerified,
    trustLabel: mapTrustLabel(payload.isVerified),
    verifiedAt: payload.verifiedAt,
    verifiedLabel: payload.verifiedAt
      ? new Date(payload.verifiedAt).toLocaleDateString()
      : undefined,
    bundles: payload.bundles.map((bundle) => mapBundleRow(bundle, payload.contractId)),
    activity: payload.activity
      ? {
          eventCount: payload.activity.eventCount,
          transactionCount: payload.activity.transactionCount,
          decodedCount: payload.activity.decodedCount,
          events24h: payload.activity.events24h,
          firstLedger: payload.activity.firstLedger,
          lastLedger: payload.activity.lastLedger,
          lastSeenLabel: timeAgo(new Date(payload.activity.lastSeen), { withAgo: true }),
          schemaStatusLabel: payload.activity.schemaStatus.replaceAll("_", " "),
        }
      : null,
    overviewRows: buildOverviewRows(payload),
  };
}
