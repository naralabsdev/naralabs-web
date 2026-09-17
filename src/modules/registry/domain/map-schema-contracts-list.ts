import type { SchemaContractListPayload } from "@/modules/registry/domain/atlas-types";
import type {
  SchemaContractListRow,
  SchemaContractsListViewModel,
} from "@/modules/registry/domain/schema-view-model";
import { truncateMiddle } from "@/shared/ui/explorer-table/borderless-table";

function mapTrustLabel(isVerified: boolean): string {
  return isVerified ? "Verified" : "Community";
}

function mapContractRow(item: SchemaContractListPayload["items"][number]): SchemaContractListRow {
  return {
    contractId: item.contractId,
    contractLabel: truncateMiddle(item.contractId, 8, 6),
    network: item.network,
    schemaCount: item.schemaCount,
    eventCount: item.eventCount,
    isVerified: item.isVerified,
    trustLabel: mapTrustLabel(item.isVerified),
    verifiedAt: item.verifiedAt,
    verifiedLabel: item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString() : undefined,
    updatedAt: item.updatedAt,
    updatedLabel: new Date(item.updatedAt).toLocaleDateString(),
  };
}

export function mapSchemaContractsList(
  payload: SchemaContractListPayload,
  meta: { page: number; pageSize: number },
): SchemaContractsListViewModel {
  return {
    items: payload.items.map(mapContractRow),
    total: payload.total,
    page: meta.page,
    pageSize: meta.pageSize,
  };
}
