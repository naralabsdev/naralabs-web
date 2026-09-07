import type { DetailFieldRow } from "@/modules/events/domain/event-view-model";

export type EventTypeBreakdownRow = {
  eventType: string;
  eventTypeKey: string;
  count: number;
  shareLabel: string;
};

export type ContractRecentEventRow = {
  id: string;
  eventType: string;
  summary: string;
  ledger: number;
  txnHash: string;
  decodeStatus: string;
  decodeLabel: string;
  ago: string;
};

export type ContractEventsListViewModel = {
  items: ContractRecentEventRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type ContractDetailViewModel = {
  id: string;
  displayName: string;
  network: string;
  schemaStatus: string;
  schemaLabel: string;
  eventCount: number;
  transactionCount: number;
  decodedCount: number;
  events24h: number;
  firstLedger: number;
  lastLedger: number;
  lastSeenAgo: string;
  activitySummary: string;
  overviewRows: DetailFieldRow[];
  typeBreakdown: EventTypeBreakdownRow[];
};
