export type EventTypeCountPayload = {
  event_type: string;
  count: number;
};

export type ContractDetailPayload = {
  contract_id: string;
  network: string;
  display_name?: string | null;
  event_count: number;
  transaction_count: number;
  decoded_count: number;
  events_24h: number;
  first_ledger: number;
  last_ledger: number;
  last_seen: string;
  schema_status: string;
  type_breakdown: EventTypeCountPayload[];
};

export type ContractEventPayload = {
  id: string;
  contract_id: string;
  ledger: number;
  txn_hash: string;
  event_type: string;
  summary_preview: string;
  decode_status: string;
  ingested_at: string;
};

export type ContractEventsListPayload = {
  items: ContractEventPayload[];
  total: number;
  page: number;
  page_size: number;
};

export type ContractEventsQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  eventType?: string;
  decodeStatus?: "" | "decoded" | "raw";
};
