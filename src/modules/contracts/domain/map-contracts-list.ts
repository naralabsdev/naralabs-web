import type { ContractsListPayload } from "@/modules/explore/domain/atlas-types";
import type {
  ContractsListRow,
  ContractsListViewModel,
} from "@/modules/contracts/domain/contracts-list-view-model";
import { truncateMiddle } from "@/modules/landing/components/activity/borderless-table";
import { timeAgo } from "@/shared/lib/functions/time-ago";

function mapSchemaLabel(status: string): string {
  if (status === "partial" || status === "decoded") return "Decoded";
  return "Raw only";
}

function mapContractRow(contract: ContractsListPayload["items"][number]): ContractsListRow {
  const displayName = contract.display_name?.trim();

  return {
    id: contract.contract_id,
    name: displayName || truncateMiddle(contract.contract_id, 6, 4),
    eventCount: contract.event_count,
    schemaStatus: contract.schema_status,
    schemaLabel: mapSchemaLabel(contract.schema_status),
    lastActivity: timeAgo(new Date(contract.last_seen), { withAgo: true }),
    ledgerRange: `${contract.first_ledger.toLocaleString()} – ${contract.last_ledger.toLocaleString()}`,
  };
}

export function mapContractsList(payload: ContractsListPayload): ContractsListViewModel {
  return {
    items: payload.items.map(mapContractRow),
    total: payload.total,
    page: payload.page,
    pageSize: payload.page_size,
  };
}
