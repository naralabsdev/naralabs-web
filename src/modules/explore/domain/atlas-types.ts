import type { NetworkStats } from "@/modules/landing/domain/atlas-types";

export type PaginatedListPayload<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};

export type EventsListPayload = PaginatedListPayload<{
  id: string;
  contract_id: string;
  ledger: number;
  txn_hash: string;
  ingested_at: string;
  event_type: string;
  summary_preview: string;
  decode_status: string;
}>;

export type ContractsListPayload = PaginatedListPayload<{
  contract_id: string;
  display_name?: string | null;
  event_count: number;
  first_ledger: number;
  last_ledger: number;
  last_seen: string;
  schema_status: string;
}>;

export type { NetworkStats };
