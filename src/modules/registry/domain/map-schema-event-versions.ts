import type { EventSchemaVersionsPayload } from "@/modules/registry/domain/atlas-types";
import type { SchemaVersionHistoryViewModel } from "@/modules/registry/domain/schema-view-model";

function mapTrustLabel(tier: string): string {
  return tier === "verified" ? "Verified" : "Community";
}

export function mapSchemaEventVersions(
  payload: EventSchemaVersionsPayload,
  currentSchemaId: string,
): SchemaVersionHistoryViewModel {
  return {
    total: payload.total,
    items: payload.items.map((item) => ({
      id: item.id,
      version: item.version,
      isVerified: item.trustTier === "verified",
      trustLabel: mapTrustLabel(item.trustTier),
      status: item.status,
      author: item.author,
      verifiedWallet: item.verifiedWallet,
      verifiedLabel: item.verifiedAt
        ? new Date(item.verifiedAt).toLocaleString()
        : undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      createdLabel: new Date(item.createdAt).toLocaleString(),
      updatedLabel: new Date(item.updatedAt).toLocaleString(),
      href: `/schemas/${item.id}`,
      isCurrent: item.id === currentSchemaId,
    })),
  };
}
