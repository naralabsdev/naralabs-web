import type { EventSchemaPublicPayload } from "@/modules/registry/domain/atlas-types";
import type { ContractSchemaRow } from "@/modules/registry/domain/schema-view-model";
import { parseSchemaBody } from "@/modules/registry/domain/parse-schema-body";

export function mapContractSchemaRow(item: EventSchemaPublicPayload): ContractSchemaRow {
  const body = parseSchemaBody(item.schemaBody);

  return {
    id: item.id,
    eventName: item.eventName,
    schemaName: body.name?.trim() || item.eventName,
    version: item.version,
    isVerified: item.trustTier === "verified",
    trustLabel: item.trustTier === "verified" ? "Verified" : "Not verified",
    author: item.author,
    updatedLabel: new Date(item.updatedAt).toLocaleDateString(),
    href: `/schemas/${item.id}`,
  };
}
