import type { SchemasListPayload } from "@/modules/registry/domain/atlas-types";
import type {
  SchemaListRow,
  SchemasListViewModel,
} from "@/modules/registry/domain/schema-view-model";
import { parseSchemaBody } from "@/modules/registry/domain/parse-schema-body";
import { truncateMiddle } from "@/shared/ui/explorer-table/borderless-table";

function mapSchemaRow(item: SchemasListPayload["items"][number]): SchemaListRow {
  const body = parseSchemaBody(item.schemaBody);

  return {
    id: item.id,
    schemaLabel: truncateMiddle(item.id, 6, 6),
    eventName: item.eventName,
    schemaName: body.name?.trim() || item.eventName,
    contractId: item.contractId,
    contractLabel: truncateMiddle(item.contractId, 8, 6),
    version: item.version,
    isVerified: item.trustTier === "verified",
    trustLabel: item.trustTier === "verified" ? "Verified" : "Not verified",
    author: item.author,
    updatedAt: item.updatedAt,
    updatedLabel: new Date(item.updatedAt).toLocaleDateString(),
    href: `/schemas/${item.id}`,
    contractHref: `/contracts/${item.contractId}`,
  };
}

export function mapSchemasList(
  payload: SchemasListPayload,
  meta: { page: number; pageSize: number },
): SchemasListViewModel {
  return {
    items: payload.items.map(mapSchemaRow),
    total: payload.total,
    page: meta.page,
    pageSize: meta.pageSize,
  };
}
