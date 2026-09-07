import type { ContractDetailPayload } from "@/modules/contracts/domain/atlas-types";
import type {
  ContractDetailViewModel,
  EventTypeBreakdownRow,
} from "@/modules/contracts/domain/contract-view-model";
import { getContractFieldTip } from "@/modules/contracts/constants/field-tips";
import type { DetailFieldRow } from "@/modules/events/domain/event-view-model";
import { timeAgo } from "@/shared/lib/functions/time-ago";

function truncateContractId(contractId: string): string {
  if (contractId.length <= 12) return contractId;
  return `${contractId.slice(0, 4)}…${contractId.slice(-4)}`;
}

function formatEventLabel(raw: string): string {
  const normalized = raw
    .trim()
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
  if (!normalized) return "Event";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSchemaLabel(status: string): string {
  if (status === "partial") return "Partial schema";
  if (status === "raw_only") return "Raw only";
  return status.replaceAll("_", " ");
}

function schemaBadge(status: string): DetailFieldRow["badge"] {
  if (status === "partial") {
    return { text: "Partial schema", tone: "success" };
  }
  return { text: "Raw only", tone: "neutral" };
}

function withFieldTip(row: DetailFieldRow): DetailFieldRow {
  return {
    ...row,
    tip: getContractFieldTip(row.label),
  };
}

function buildOverviewRows(payload: ContractDetailPayload): DetailFieldRow[] {
  return [
    withFieldTip({
      label: "Contract ID",
      value: payload.contract_id,
      copyValue: payload.contract_id,
      mono: true,
    }),
    withFieldTip({
      label: "Network",
      value: payload.network,
    }),
    withFieldTip({
      label: "Schema Status",
      value: formatSchemaLabel(payload.schema_status),
      badge: schemaBadge(payload.schema_status),
    }),
    withFieldTip({
      label: "Total Events",
      value: payload.event_count.toLocaleString(),
    }),
    withFieldTip({
      label: "Unique Transactions",
      value: payload.transaction_count.toLocaleString(),
    }),
    withFieldTip({
      label: "Decoded Events",
      value: payload.decoded_count.toLocaleString(),
    }),
    withFieldTip({
      label: "Events (24h)",
      value: payload.events_24h.toLocaleString(),
    }),
    withFieldTip({
      label: "First Ledger",
      value: payload.first_ledger.toLocaleString(),
      href: `/ledger/${payload.first_ledger}`,
    }),
    withFieldTip({
      label: "Last Ledger",
      value: payload.last_ledger.toLocaleString(),
      href: `/ledger/${payload.last_ledger}`,
    }),
    withFieldTip({
      label: "Last Seen",
      value: timeAgo(new Date(payload.last_seen), { withAgo: true }),
      timestampIso: payload.last_seen,
    }),
  ];
}

function mapTypeBreakdown(payload: ContractDetailPayload): EventTypeBreakdownRow[] {
  const total = payload.event_count || 1;
  return payload.type_breakdown.map((item) => ({
    eventType: formatEventLabel(item.event_type),
    eventTypeKey: item.event_type,
    count: item.count,
    shareLabel: `${((item.count / total) * 100).toFixed(1)}%`,
  }));
}

function buildActivitySummary(payload: ContractDetailPayload): string {
  const events = payload.event_count.toLocaleString();
  const txns = payload.transaction_count.toLocaleString();
  const lastActive = timeAgo(new Date(payload.last_seen), { withAgo: true });
  return `${events} events · ${txns} transactions · active ${lastActive}`;
}

export function mapContractDetail(payload: ContractDetailPayload): ContractDetailViewModel {
  const displayName =
    payload.display_name?.trim() || truncateContractId(payload.contract_id);

  return {
    id: payload.contract_id,
    displayName,
    network: payload.network,
    schemaStatus: payload.schema_status,
    schemaLabel: formatSchemaLabel(payload.schema_status),
    eventCount: payload.event_count,
    transactionCount: payload.transaction_count,
    decodedCount: payload.decoded_count,
    events24h: payload.events_24h,
    firstLedger: payload.first_ledger,
    lastLedger: payload.last_ledger,
    lastSeenAgo: timeAgo(new Date(payload.last_seen), { withAgo: true }),
    activitySummary: buildActivitySummary(payload),
    overviewRows: buildOverviewRows(payload),
    typeBreakdown: mapTypeBreakdown(payload),
  };
}
