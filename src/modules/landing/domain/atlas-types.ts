export type ActivityBucket = {
  bucket: string;
  count: number;
};

export type NetworkStats = {
  network: string;
  total_events: number;
  contract_count: number;
  last_ingested_ledger: number;
  chain_head_ledger?: number | null;
  ingest_lag_ledgers?: number | null;
  events_24h: number;
  last_indexed_at?: string | null;
  oldest_stored_ledger?: number | null;
  activity: ActivityBucket[];
};

export type EventItem = {
  id: string;
  contract_id: string;
  ledger: number;
  txn_hash: string;
  ingested_at: string;
  event_type: string;
  summary_preview: string;
  decode_status: string;
};

export type ContractItem = {
  contract_id: string;
  display_name?: string | null;
  event_count: number;
  first_ledger: number;
  last_ledger: number;
  last_seen: string;
  schema_status: string;
};

export type HomePayload = {
  stats: NetworkStats;
  recent_events: EventItem[];
  active_contracts: ContractItem[];
};
