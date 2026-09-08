import type {
  ContractEventPayload,
  ContractEventsListPayload,
} from "@/modules/contracts/domain/atlas-types";
import type {
  ContractEventsListViewModel,
  ContractRecentEventRow,
} from "@/modules/contracts/domain/contract-view-model";
import { normalizePaginatedPayload } from "@/shared/lib/functions/normalize-paginated-payload";
import { timeAgo } from "@/shared/lib/functions/time-ago";

function formatEventLabel(raw: string): string {
  const normalized = raw
    .trim()
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
  if (!normalized) return "Event";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function mapEventRow(event: ContractEventPayload): ContractRecentEventRow {
  return {
    id: event.id,
    eventType: formatEventLabel(event.event_type),
    summary: event.summary_preview,
    ledger: event.ledger,
    txnHash: event.txn_hash,
    decodeStatus: event.decode_status,
    decodeLabel: event.decode_status === "decoded" ? "Decoded" : "Raw",
    ago: timeAgo(new Date(event.ingested_at), { withAgo: true }),
  };
}

export function mapContractEventsList(
  payload: ContractEventsListPayload,
  meta: { page: number; pageSize: number },
): ContractEventsListViewModel {
  const normalized = normalizePaginatedPayload(payload, meta);

  return {
    items: normalized.items.map(mapEventRow),
    total: normalized.total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  };
}
