import type { EventsListPayload } from "@/modules/explore/domain/atlas-types";
import type { EventsListRow, EventsListViewModel } from "@/modules/events/domain/events-list-view-model";
import { truncateMiddle } from "@/modules/landing/components/activity/borderless-table";
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

function mapEventRow(event: EventsListPayload["items"][number]): EventsListRow {
  return {
    id: event.id,
    eventType: formatEventLabel(event.event_type),
    summary: event.summary_preview,
    contractName: truncateMiddle(event.contract_id, 6, 4),
    contractId: event.contract_id,
    ledger: event.ledger,
    txnHash: event.txn_hash,
    decodeStatus: event.decode_status,
    decodeLabel: event.decode_status === "decoded" ? "Decoded" : "Raw",
    ago: timeAgo(new Date(event.ingested_at), { withAgo: true }),
  };
}

export function mapEventsList(
  payload: EventsListPayload,
  meta: { page: number; pageSize: number },
): EventsListViewModel {
  const normalized = normalizePaginatedPayload(payload, meta);

  return {
    items: normalized.items.map(mapEventRow),
    total: normalized.total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  };
}
